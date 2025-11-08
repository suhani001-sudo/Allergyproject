import RestaurantMessage from '../models/RestaurantMessage.js';
import User from '../models/User.js';

// Create a new message from restaurant to admin
export const createRestaurantMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Get user details (restaurant owner)
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify user is a restaurant
    if (user.role !== 'restaurant') {
      return res.status(403).json({
        success: false,
        message: 'Only restaurant accounts can send messages to admin'
      });
    }

    // Create new message
    const newMessage = new RestaurantMessage({
      restaurantId: userId,
      restaurantName: user.name,
      email: user.email,
      subject: subject.trim(),
      message: message.trim(),
      status: 'unread'
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully to admin',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating restaurant message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message',
      error: error.message
    });
  }
};

// Get all restaurant messages (for admin)
export const getAllRestaurantMessages = async (req, res) => {
  try {
    const messages = await RestaurantMessage.find()
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'name email');

    res.status(200).json({
      success: true,
      messages: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching restaurant messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
};

// Get messages for a specific restaurant
export const getRestaurantOwnMessages = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const messages = await RestaurantMessage.find({ restaurantId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching restaurant own messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
};

// Update message status
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await RestaurantMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message'
    });
  }
};

// Delete a message
export const deleteRestaurantMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await RestaurantMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message'
    });
  }
};
