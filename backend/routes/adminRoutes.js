import { Router } from 'express';
import { 
  getAdminStats, 
  getAllUsers, 
  getAllRestaurants,
  deleteUser,
  deleteRestaurant 
} from '../controllers/adminController.js';

const router = Router();

// Admin statistics endpoint
router.get('/stats', getAdminStats);

// Get all users
router.get('/users', getAllUsers);

// Get all restaurants
router.get('/restaurants', getAllRestaurants);

// Delete user
router.delete('/users/:userId', deleteUser);

// Delete restaurant
router.delete('/restaurants/:restaurantId', deleteRestaurant);

export default router;
