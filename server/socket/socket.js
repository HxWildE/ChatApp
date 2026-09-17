import { Server } from "socket.io";
import http from "http";
import app from "../app.js";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

export const userSocketMap = {}; //{userId :socket}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
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
