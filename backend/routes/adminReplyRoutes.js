import express from 'express';
import {
  sendReplyToRestaurant,
  getAllAdminReplies,
  getRepliesForRestaurant,
  markReplyAsRead
} from '../controllers/adminReplyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/reply-to-restaurant', protect, sendReplyToRestaurant);
router.get('/all-replies', protect, getAllAdminReplies);

// Restaurant routes
router.get('/my-replies', protect, getRepliesForRestaurant);
router.put('/:id/read', protect, markReplyAsRead);

export default router;
