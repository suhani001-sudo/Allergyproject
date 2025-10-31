import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.route('/profile')
  .get(getUserProfile)      // Get logged-in user's profile
  .put(updateUserProfile);  // Update logged-in user's profile

router.get('/stats', getUserStats);  // Get user dashboard stats

router.delete('/account', deleteUser);  // Delete user account

router.get('/:id', getUserById);  // Get user by ID with allergies

export default router;
