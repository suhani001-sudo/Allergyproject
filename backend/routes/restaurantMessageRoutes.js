import express from 'express';
import {
  createRestaurantMessage,
  getAllRestaurantMessages,
  getRestaurantOwnMessages,
  updateMessageStatus,
  deleteRestaurantMessage
} from '../controllers/restaurantMessageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Restaurant routes (protected - requires restaurant authentication)
router.post('/', protect, createRestaurantMessage);
router.get('/my-messages', protect, getRestaurantOwnMessages);

// Admin routes (protected - requires admin authentication)
router.get('/', protect, getAllRestaurantMessages);
router.put('/:id/status', protect, updateMessageStatus);
router.delete('/:id', protect, deleteRestaurantMessage);

export default router;
