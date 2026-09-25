import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import jwt from "jsonwebtoken";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST"]
  }
});

export const userSocketMap = {}; //{userId :socket}

io.use((socket, next) => {
  try {
    const cookieString = socket.handshake.headers.cookie;
    if (!cookieString) return next(new Error("Authentication error"));
    
    const match = cookieString.match(new RegExp('(^| )jwt=([^;]+)'));
    if (!match) return next(new Error("Authentication error"));
    
    const token = match[2];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server };
