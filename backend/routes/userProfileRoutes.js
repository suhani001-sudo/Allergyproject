import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    addAllergy,
    removeAllergy,
    addFavoriteFood,
    removeFavoriteFood,
    deleteUserProfile
} from '../controllers/userProfileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Main profile routes
router.route('/')
    .get(getUserProfile)
    .put(updateUserProfile)
    .delete(deleteUserProfile);

// Allergy management routes
router.route('/allergies')
    .post(addAllergy);

router.route('/allergies/:allergyId')
    .delete(removeAllergy);

// Favorite foods management routes
router.route('/favorite-foods')
    .post(addFavoriteFood);

router.route('/favorite-foods/:foodId')
    .delete(removeFavoriteFood);

export default router;
