import MessageReply from '../models/MessageReply.js';
import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';

// @desc    Create a reply to a user message
// @route   POST /api/message-replies
// @access  Private (Restaurant only)
export const createReply = async (req, res) => {
    try {
        const { originalMessageId, replyMessage } = req.body;
        const restaurantId = req.user.id;

        // Validate input
        if (!originalMessageId || !replyMessage) {
            return res.status(400).json({
                success: false,
                message: 'Original message ID and reply message are required'
            });
        }

        // Get the original message
        const originalMessage = await ContactMessage.findById(originalMessageId);
        if (!originalMessage) {
            return res.status(404).json({
                success: false,
                message: 'Original message not found'
            });
        }

        // Check if message has userId
        if (!originalMessage.userId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot reply to messages without user ID. This message was sent anonymously.'
            });
        }

        // Get restaurant info
        const restaurant = await User.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        // Create the reply
        const reply = await MessageReply.create({
            userId: originalMessage.userId,
            restaurantId,
            originalMessageId,
            originalMessage: originalMessage.message,
            replyMessage,
            restaurantName: restaurant.restaurantName || restaurant.name
        });

        // Update original message status to 'replied'
        originalMessage.status = 'replied';
        await originalMessage.save();

        res.status(201).json({
            success: true,
            message: 'Reply sent successfully',
            data: reply
        });
    } catch (error) {
        console.error('Create reply error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating reply',
            error: error.message
        });
    }
};

// @desc    Get all replies for a user
// @route   GET /api/message-replies/user
// @access  Private (User only)
export const getUserReplies = async (req, res) => {
    try {
        const userId = req.user.id;

        const replies = await MessageReply.find({ userId })
            .sort({ replyDate: -1 })
            .populate('restaurantId', 'name restaurantName email');

        res.status(200).json({
            success: true,
            count: replies.length,
            data: replies
        });
    } catch (error) {
        console.error('Get user replies error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching replies',
            error: error.message
        });
    }
};

// @desc    Get all replies sent by a restaurant
// @route   GET /api/message-replies/restaurant
// @access  Private (Restaurant only)
export const getRestaurantReplies = async (req, res) => {
    try {
        const restaurantId = req.user.id;

        const replies = await MessageReply.find({ restaurantId })
            .sort({ replyDate: -1 })
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: replies.length,
            data: replies
        });
    } catch (error) {
        console.error('Get restaurant replies error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching replies',
            error: error.message
        });
    }
};

// @desc    Mark reply as read
// @route   PUT /api/message-replies/:id/read
// @access  Private (User only)
export const markReplyAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const reply = await MessageReply.findOne({ _id: id, userId });

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        reply.isRead = true;
        await reply.save();

        res.status(200).json({
            success: true,
            message: 'Reply marked as read',
            data: reply
        });
    } catch (error) {
        console.error('Mark reply as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating reply',
            error: error.message
        });
    }
};
