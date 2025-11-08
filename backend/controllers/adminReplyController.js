import AdminReply from '../models/AdminReply.js';
import User from '../models/User.js';
import RestaurantMessage from '../models/RestaurantMessage.js';

// Send reply from admin to restaurant
export const sendReplyToRestaurant = async (req, res) => {
  try {
    const { messageId, restaurantEmail, restaurantName, subject, message } = req.body;
    const adminId = req.user.id;

    console.log('Sending reply to restaurant:', {
      messageId,
      restaurantEmail,
      restaurantName,
      subject
    });

    // Validate input
    if (!messageId || !restaurantEmail || !message) {
      return res.status(400).json({
        success: false,
        message: 'Message ID, restaurant email, and message are required'
      });
    }

    // Get the original message to get restaurant ID
    const originalMessage = await RestaurantMessage.findById(messageId);
    
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: 'Original message not found'
      });
    }

    console.log('Original message restaurantId:', originalMessage.restaurantId);
    console.log('Original message email:', originalMessage.email);

    // Get admin details
    const admin = await User.findById(adminId);
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can send replies'
      });
    }

    // Create new reply using restaurant ID for reliable matching
    const newReply = new AdminReply({
      originalMessageId: messageId,
      adminId: adminId,
      adminName: admin.name,
      restaurantId: originalMessage.restaurantId,
      restaurantEmail: originalMessage.email,
      restaurantName: restaurantName || originalMessage.restaurantName,
      subject: subject || 'Re: Your Message',
      message: message.trim(),
      status: 'unread'
    });

    await newReply.save();
    console.log('Reply saved successfully with restaurantId:', originalMessage.restaurantId);

    // Update original message status to 'replied'
    originalMessage.status = 'replied';
    await originalMessage.save();
    console.log('Original message marked as replied');

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: newReply
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending reply'
    });
  }
};

// Get all replies sent by admin
export const getAllAdminReplies = async (req, res) => {
  try {
    const replies = await AdminReply.find()
      .sort({ createdAt: -1 })
      .populate('adminId', 'name email');

    res.status(200).json({
      success: true,
      replies: replies,
      count: replies.length
    });
  } catch (error) {
    console.error('Error fetching admin replies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching replies'
    });
  }
};

// Get replies for a specific restaurant (by ID)
export const getRepliesForRestaurant = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    console.log('=== FETCHING REPLIES ===');
    console.log('Restaurant ID from token:', restaurantId);
    console.log('Restaurant ID type:', typeof restaurantId);
    console.log('User object:', JSON.stringify(req.user, null, 2));

    // Get all replies to see what IDs exist
    const allReplies = await AdminReply.find({});
    console.log('Total replies in database:', allReplies.length);
    
    if (allReplies.length > 0) {
      console.log('Sample reply restaurantId:', allReplies[0].restaurantId);
      console.log('Sample reply restaurantId type:', typeof allReplies[0].restaurantId);
      console.log('All reply restaurant IDs:', allReplies.map(r => ({
        id: r.restaurantId?.toString(),
        match: r.restaurantId?.toString() === restaurantId
      })));
    }

    // Try both string and ObjectId matching
    const replies = await AdminReply.find({ 
      $or: [
        { restaurantId: restaurantId },
        { restaurantId: restaurantId.toString() }
      ]
    }).sort({ createdAt: -1 });

    console.log('Found replies for this restaurant:', replies.length);
    if (replies.length > 0) {
      console.log('Replies data:', JSON.stringify(replies, null, 2));
    } else {
      console.log('❌ NO MATCHES FOUND - Checking why...');
      console.log('Searched ID:', restaurantId);
      console.log('Available IDs:', allReplies.map(r => r.restaurantId?.toString()));
    }

    res.status(200).json({
      success: true,
      replies: replies,
      count: replies.length,
      debug: {
        searchedId: restaurantId,
        searchedIdType: typeof restaurantId,
        allIds: allReplies.map(r => r.restaurantId?.toString()),
        totalRepliesInDb: allReplies.length
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant replies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching replies'
    });
  }
};

// Mark reply as read
export const markReplyAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const reply = await AdminReply.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reply marked as read',
      data: reply
    });
  } catch (error) {
    console.error('Error updating reply status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating reply'
    });
  }
};
