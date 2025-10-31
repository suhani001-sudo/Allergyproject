import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';

const router = express.Router();

// Restaurant CRUD routes (public access)
router.route('/')
  .post(createRestaurant)       // Create new restaurant
  .get(getAllRestaurants);      // Get all restaurants (with filters)

router.route('/:id')
  .get(getRestaurantById)       // Get single restaurant
  .put(updateRestaurant)        // Update restaurant
  .delete(deleteRestaurant);    // Delete restaurant

export default router;
