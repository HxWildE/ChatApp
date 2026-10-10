import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { sendFriendRequest, acceptFriendRequest } from '../controllers/friendController.js';

const router = express.Router();

router.post('/request/:id', protectRoute, sendFriendRequest);
router.post('/accept/:requestId', protectRoute, acceptFriendRequest);

export default router;
