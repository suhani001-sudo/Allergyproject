import express from 'express';
import {
  getAllMenus,
  getMenuByRestaurant,
  getMenuByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getAllMenus)           // GET /api/menus - Get all menu items
  .post(createMenuItem);      // POST /api/menus - Create new menu item

router.route('/:id')
  .put(updateMenuItem)        // PUT /api/menus/:id - Update menu item
  .delete(deleteMenuItem);    // DELETE /api/menus/:id - Delete menu item

// Get menu by restaurant name
router.get('/restaurant/:restaurantName', getMenuByRestaurant);

// Get menu by category
router.get('/category/:category', getMenuByCategory);

export default router;
