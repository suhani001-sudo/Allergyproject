import mongoose from 'mongoose';

const adminReplySchema = new mongoose.Schema({
  // Reference to original message
  originalMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantMessage',
    required: true
  },
  
  // Admin who sent the reply
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  
  // Restaurant receiving the reply
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantEmail: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AdminReply = mongoose.model('AdminReply', adminReplySchema);

export default AdminReply;
