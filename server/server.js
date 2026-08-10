import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
import { Server } from "socket.io"
dotenv.config();

const app = express();

const server = http.createServer(app);

app.use(express.json({ limit: '4mb' }));
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