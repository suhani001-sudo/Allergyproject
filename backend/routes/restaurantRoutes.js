import { Router } from 'express';
import { addRestaurant, listRestaurants } from '../controllers/restaurantController.js';

const router = Router();

router.post('/', addRestaurant);
router.get('/', listRestaurants);

export default router;
