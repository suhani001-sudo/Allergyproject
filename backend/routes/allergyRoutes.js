import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAllergy,
  getAllergies,
  getAllergyById,
  updateAllergy,
  deleteAllergy,
} from '../controllers/allergyController.js';

const router = Router();

router.use(protect);
router.post('/', createAllergy);
router.get('/', getAllergies);
router.get('/:id', getAllergyById);
router.put('/:id', updateAllergy);
router.delete('/:id', deleteAllergy);

export default router;
