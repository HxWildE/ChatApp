import express from 'express';
import rateLimit from 'express-rate-limit';
import { protectRoute } from '../middleware/auth.js';
import { generateSmartReplies } from '../controllers/aiController.js';

const aiRouter = express.Router();

// Dedicated rate limiter for AI endpoints to protect Gemini API quotas
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 AI requests per minute
  message: {
    success: false,
    message: 'Too many AI requests. Please wait a moment.',
    suggestions: []
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/ai/smart-replies/:friendId
aiRouter.get('/smart-replies/:friendId', protectRoute, aiLimiter, generateSmartReplies);

export default aiRouter;
