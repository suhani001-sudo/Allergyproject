import express from 'express';
import {
    createReply,
    getUserReplies,
    getRestaurantReplies,
    markReplyAsRead
} from '../controllers/messageReplyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a reply (restaurant)
router.post('/', createReply);

// Get user's replies
router.get('/user', getUserReplies);

// Get restaurant's sent replies
router.get('/restaurant', getRestaurantReplies);

// Mark reply as read
router.put('/:id/read', markReplyAsRead);

export default router;
