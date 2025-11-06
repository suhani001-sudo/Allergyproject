import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;

    // Validate required fields
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both name and message'
      });
    }

    // Validate field lengths
    if (name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    // Create new feedback entry
    const feedback = new Feedback({
      name: name.trim(),
      message: message.trim()
    });

    // Save to database
    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.',
      error: error.message
    });
  }
});

// GET /api/feedback - Get all feedback (for admin use)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ date: -1 }) // Sort by newest first
      .lean();

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// GET /api/feedback/:id - Get single feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

export default router;
