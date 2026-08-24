import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
import { Server } from "socket.io"

const app = express();

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

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cors());

app.use('/api/status', (req, res) => res.send('Server is live !'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log('running on port : ' + PORT));
};

start();