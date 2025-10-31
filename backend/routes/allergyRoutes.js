import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAllergy,
  getAllergies,
  getAllergyById,
  updateAllergy,
  deleteAllergy,
} from '../controllers/allergyController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Allergy CRUD routes
router.route('/')
  .post(createAllergy)      // Create new allergy
  .get(getAllergies);       // Get all user's allergies

router.route('/:id')
  .get(getAllergyById)      // Get single allergy
  .put(updateAllergy)       // Update allergy
  .delete(deleteAllergy);   // Delete allergy

export default router;
