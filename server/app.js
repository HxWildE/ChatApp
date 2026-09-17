import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Adjust as necessary for frontend URL
  credentials: true,
}));

app.use('/api/status', (req, res) => res.send('Server is live !'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

export default app;
