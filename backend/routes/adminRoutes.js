import { Router } from 'express';
import { getAdminStats, getAllUsers, getAllRestaurants } from '../controllers/adminController.js';

const router = Router();

// Admin statistics endpoint
router.get('/stats', getAdminStats);

// Get all users
router.get('/users', getAllUsers);

// Get all restaurants
router.get('/restaurants', getAllRestaurants);

export default router;
