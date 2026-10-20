import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import jwt from "jsonwebtoken";

const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL;

export const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        clientUrl,
        "http://localhost:5173",
        "http://localhost:5003",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5003"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"]
  }
});

export const userSocketMap = {}; // { userId: Set<socketId> }
const disconnectTimeouts = new Map(); // { userId: timeoutId }

io.use((socket, next) => {
  try {
    const cookieString = socket.handshake.headers.cookie;

    if (!cookieString) {
      return next(new Error("Authentication error"));
    }

    const match = cookieString.match(
      new RegExp("(^| )jwt=([^;]+)")
    );

    if (!match) {
      return next(new Error("Authentication error"));
    }

    const token = match[2];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.userId = decoded.userId?.toString();

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;

  if (userId) {
    // Cancel any pending disconnect grace timer if user reconnects (e.g. page refresh / route change)
    if (disconnectTimeouts.has(userId)) {
      clearTimeout(disconnectTimeouts.get(userId));
      disconnectTimeouts.delete(userId);
    }

    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    // Join room dedicated to this userId for 100% reliable multi-device / multi-tab event delivery
    socket.join(userId);

    console.log(`User Connected: ${userId} (active sockets: ${userSocketMap[userId].size})`);
  }

  // Send current online users to newly connected socket immediately
  socket.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Broadcast to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId }) => {
    if (receiverId && userId && receiverId.toString() !== userId.toString()) {
      io.to(receiverId.toString()).emit("typing", {
        senderId: userId
      });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    if (receiverId && userId && receiverId.toString() !== userId.toString()) {
      io.to(receiverId.toString()).emit("stopTyping", {
        senderId: userId
      });
    }
  });


  socket.on("messageDelivered", async ({ messageId, senderId }) => {
    try {
      const Message = (await import("../models/Message.js")).default;
      await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
      
      if (senderId) {
        io.to(senderId.toString()).emit("messageStatusUpdated", {
          messageId,
          status: 'delivered'
        });
      }
    } catch (err) {
      console.error("Error in messageDelivered socket handler:", err);
    }
  });

  socket.on("markAsSeen", async ({ senderId }) => {
    try {
      const Message = (await import("../models/Message.js")).default;
      await Message.updateMany(
        { senderId, receiverId: userId, status: { $ne: 'seen' } },
        { status: 'seen' }
      );
      
      if (senderId) {
        io.to(senderId.toString()).emit("messagesSeen", {
          receiverId: userId
        });
      }
    } catch (err) {
      console.error("Error in markAsSeen socket handler:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket Disconnected: ${socket.id} (user: ${userId})`);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);

      // If user has no more active sockets, start a 2.5s grace period before marking offline
      // This completely prevents flickering between online/offline on page refresh or brief reconnects
      if (userSocketMap[userId].size === 0) {
        const timeoutId = setTimeout(() => {
          if (userSocketMap[userId] && userSocketMap[userId].size === 0) {
            delete userSocketMap[userId];
            disconnectTimeouts.delete(userId);
            console.log(`User Marked Offline after grace period: ${userId}`);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
          }
        }, 2500);

        disconnectTimeouts.set(userId, timeoutId);
      }
    }
  });
});

export { app, server };