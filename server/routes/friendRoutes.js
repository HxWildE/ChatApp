import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  searchUsers, 
  getFriendRequests 
} from '../controllers/friendController.js';

const router = express.Router();

router.get('/search', protectRoute, searchUsers);
router.get('/requests', protectRoute, getFriendRequests);
router.post('/request/:id', protectRoute, sendFriendRequest);
router.post('/accept/:requestId', protectRoute, acceptFriendRequest);
router.post('/reject/:requestId', protectRoute, rejectFriendRequest);

export default router;
