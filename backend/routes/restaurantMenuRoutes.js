import express from 'express';
import {
  getRestaurantMenu,
  getMenuByRestaurantName,
  getMenuByCategory,
} from '../controllers/restaurantMenuController.js';

const router = express.Router();

// Get all restaurant menu items
router.get('/', getRestaurantMenu);

// Get menu by restaurant name
router.get('/:restaurantName', getMenuByRestaurantName);

// Get menu by category
router.get('/category/:category', getMenuByCategory);

export default router;
