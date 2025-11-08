import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // options can be added if needed
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Fix email index issue automatically
    await fixEmailIndex();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Automatically fix the email index to allow same email for different roles
const fixEmailIndex = async () => {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check if old email_1 index exists
    const indexes = await usersCollection.indexes();
    const hasOldIndex = indexes.some(idx => idx.name === 'email_1');
    
    if (hasOldIndex) {
      console.log('🔧 Fixing email index to allow same email for different roles...');
      await usersCollection.dropIndex('email_1');
      console.log('✅ Email index fixed! Same email can now be used for User, Restaurant, and Admin roles.');
    }
    
    // Ensure compound index exists
    const hasCompoundIndex = indexes.some(idx => idx.name === 'email_1_role_1');
    if (!hasCompoundIndex) {
      await usersCollection.createIndex(
        { email: 1, role: 1 }, 
        { unique: true, name: 'email_1_role_1' }
      );
      console.log('✅ Compound index (email + role) created.');
    }
  } catch (error) {
    // Silently handle if index doesn't exist or other minor errors
    if (error.code !== 27 && error.codeName !== 'IndexNotFound') {
      console.log('ℹ️  Index check:', error.message);
    }
  }
};
