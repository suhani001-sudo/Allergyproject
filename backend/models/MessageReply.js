import mongoose from 'mongoose';

const messageReplySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContactMessage',
      required: true
    },
    originalMessage: {
      type: String,
      required: true
    },
    replyMessage: {
      type: String,
      required: true,
      trim: true
    },
    replyDate: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    restaurantName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const MessageReply = mongoose.model('MessageReply', messageReplySchema);
export default MessageReply;
