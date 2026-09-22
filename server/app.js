import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin (like 5003, 5173) or allow undefined (like Postman)
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Apply rate limiting to all requests safely
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased to 500 to ensure no accidental blockouts during testing
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use('/api', limiter); // apply only to API routes

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

app.use('/api/status', (req, res) => res.send('Server is live !'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

export default app;
