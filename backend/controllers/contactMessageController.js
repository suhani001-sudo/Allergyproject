import ContactMessage from '../models/ContactMessage.js';

// @desc    Create new contact message
// @route   POST /api/contact-messages
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, userType, userId } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, message'
      });
    }

    // Create contact message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      userType: userType || 'user',
      userId,
      status: 'unread'
    });

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending contact message'
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact-messages
// @access  Private (Restaurant)
export const getAllContactMessages = async (req, res) => {
  try {
    const { status, userType, limit = 50 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (userType) query.userType = userType;

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact messages'
    });
  }
};

// @desc    Get single contact message by ID
// @route   GET /api/contact-messages/:id
// @access  Private (Restaurant)
export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findById(id).populate('userId', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact message'
    });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contact-messages/:id/status
// @access  Private (Restaurant)
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: unread, read, or replied'
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message status'
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact-messages/:id
// @access  Private (Restaurant)
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting contact message'
    });
  }
};

// @desc    Get message statistics
// @route   GET /api/contact-messages/stats
// @access  Private (Restaurant)
export const getMessageStats = async (req, res) => {
  try {
    const totalMessages = await ContactMessage.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });
    const readMessages = await ContactMessage.countDocuments({ status: 'read' });
    const repliedMessages = await ContactMessage.countDocuments({ status: 'replied' });

    res.status(200).json({
      success: true,
      data: {
        total: totalMessages,
        unread: unreadMessages,
        read: readMessages,
        replied: repliedMessages
      }
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message statistics'
    });
  }
};
