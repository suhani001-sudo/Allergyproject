import express from 'express';
import {
  getAllCustomMenus,
  createCustomMenuItem,
  updateCustomMenuItem,
  deleteCustomMenuItem,
} from '../controllers/customMenuController.js';

const router = express.Router();

// Custom menu routes
router.route('/')
  .get(getAllCustomMenus)           // GET /api/custom-menus - Get all custom menu items
  .post(createCustomMenuItem);      // POST /api/custom-menus - Create new custom menu item

router.route('/:id')
  .put(updateCustomMenuItem)        // PUT /api/custom-menus/:id - Update custom menu item
  .delete(deleteCustomMenuItem);    // DELETE /api/custom-menus/:id - Delete custom menu item

export default router;
