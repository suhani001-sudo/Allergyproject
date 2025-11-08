// Migration script to fix email index issue
// This removes the old single email index and keeps only the compound email+role index

import './config/env.js';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

const fixEmailIndex = async () => {
  try {
    console.log('🔧 Starting email index migration...\n');
    
    // Connect to database
    await connectDB();
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Get all existing indexes
    console.log('📋 Current indexes:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key);
    });
    
    console.log('\n🗑️  Dropping old email_1 index...');
    
    try {
      // Try to drop the old single email index
      await usersCollection.dropIndex('email_1');
      console.log('✅ Successfully dropped email_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Index email_1 does not exist (already removed)');
      } else {
        console.log('⚠️  Error dropping index:', error.message);
      }
    }
    
    // Verify the compound index exists
    console.log('\n🔍 Checking for compound index (email_1_role_1)...');
    const newIndexes = await usersCollection.indexes();
    const hasCompoundIndex = newIndexes.some(idx => idx.name === 'email_1_role_1');
    
    if (hasCompoundIndex) {
      console.log('✅ Compound index (email + role) exists');
    } else {
      console.log('⚠️  Compound index not found, creating it...');
      await usersCollection.createIndex(
        { email: 1, role: 1 }, 
        { unique: true, name: 'email_1_role_1' }
      );
      console.log('✅ Compound index created successfully');
    }
    
    console.log('\n📋 Final indexes:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key);
    });
    
    console.log('\n✅ Migration completed successfully!');
    console.log('ℹ️  You can now use the same email for different roles (user, restaurant, admin)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
};

fixEmailIndex();
