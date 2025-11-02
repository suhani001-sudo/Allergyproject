import express from 'express';
import {
    getRestaurantProfile,
    updateRestaurantProfile,
    updateBusinessHours,
    updateSocialMedia,
    getAllRestaurantProfiles,
    getRestaurantProfileById,
    deleteRestaurantProfile,
    updateAccountStatus
} from '../controllers/restaurantProfileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/all', getAllRestaurantProfiles);
router.get('/:id', getRestaurantProfileById);

// Protected routes (require authentication)
router.use(protect);

// Main profile routes
router.route('/')
    .get(getRestaurantProfile)
    .put(updateRestaurantProfile)
    .delete(deleteRestaurantProfile);

// Business hours route
router.put('/hours', updateBusinessHours);

// Social media route
router.put('/social-media', updateSocialMedia);

// Account status route
router.put('/status', updateAccountStatus);

export default router;
