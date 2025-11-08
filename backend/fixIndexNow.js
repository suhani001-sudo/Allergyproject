// Quick fix script to remove problematic email index
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://princekhatri:princekhatri@cluster0.ny8a1q2.mongodb.net/safebytes?retryWrites=true&w=majority';

async function fixIndex() {
  try {
    console.log('🔧 Connecting to MongoDB...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Show current indexes
    console.log('📋 Current indexes:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });
    
    // Drop the problematic email_1 index
    console.log('\n🗑️  Attempting to drop email_1 index...');
    try {
      await usersCollection.dropIndex('email_1');
      console.log('✅ Successfully dropped email_1 index!');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index email_1 not found (already removed or never existed)');
      } else {
        console.log('⚠️  Error:', error.message);
      }
    }
    
    // Ensure compound index exists
    console.log('\n🔍 Ensuring compound index (email + role) exists...');
    try {
      await usersCollection.createIndex(
        { email: 1, role: 1 }, 
        { unique: true, name: 'email_1_role_1' }
      );
      console.log('✅ Compound index created/verified');
    } catch (error) {
      if (error.code === 85) {
        console.log('ℹ️  Compound index already exists');
      } else {
        console.log('⚠️  Error creating index:', error.message);
      }
    }
    
    // Show final indexes
    console.log('\n📋 Final indexes:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });
    
    console.log('\n✅ Migration completed!');
    console.log('ℹ️  Same email can now be used for different roles\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fixIndex();
