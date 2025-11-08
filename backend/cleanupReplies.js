import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdminReply from './models/AdminReply.js';

dotenv.config();

const cleanupOldReplies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all replies without restaurantId
    const result = await AdminReply.deleteMany({ 
      restaurantId: { $exists: false } 
    });

    console.log(`🗑️  Deleted ${result.deletedCount} old replies without restaurantId`);

    // Show remaining replies
    const remaining = await AdminReply.find({});
    console.log(`📊 Remaining replies: ${remaining.length}`);
    
    if (remaining.length > 0) {
      console.log('Remaining reply IDs:', remaining.map(r => ({
        id: r._id.toString(),
        restaurantId: r.restaurantId?.toString(),
        hasRestaurantId: !!r.restaurantId
      })));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupOldReplies();
