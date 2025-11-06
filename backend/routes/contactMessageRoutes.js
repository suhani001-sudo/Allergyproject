import express from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateMessageStatus,
  deleteContactMessage,
  getMessageStats
} from '../controllers/contactMessageController.js';

const router = express.Router();

// Public routes
router.post('/', createContactMessage);

// Get message statistics (should be before /:id route)
router.get('/stats', getMessageStats);

// Private routes (for restaurants)
router.get('/', getAllContactMessages);
router.get('/:id', getContactMessageById);
router.put('/:id/status', updateMessageStatus);
router.delete('/:id', deleteContactMessage);

export default router;
