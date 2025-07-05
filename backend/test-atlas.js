/**
 * Quick MongoDB Atlas Connection Test
 * Tests the connection with your new credentials
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...');
  console.log('=====================================');
  console.log('');

  const mongoUri = process.env.MONGODB_URI;
  console.log('🔗 Connection URI:', mongoUri.replace(/:[^:]*@/, ':****@')); // Hide password
  console.log('');

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connected successfully to MongoDB Atlas!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log('');

    // Test a simple query
    console.log('🧪 Testing database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Available collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    } else {
      console.log('   No collections yet (database is empty - ready for seeding!)');
    }
    
    console.log('');
    console.log('🎉 SUCCESS! MongoDB Atlas is working perfectly!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. npm run seed    # Populate with sample data');
    console.log('   2. npm run dev     # Start the server');
    console.log('   3. Test frontend at: http://localhost:8000/admin.html');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if your IP is whitelisted in Atlas Network Access');
    console.log('   2. Verify username and password are correct');
    console.log('   3. Ensure cluster is running (not paused)');
    console.log('   4. Check internet connection');
    console.log('');
    console.log('🧪 Alternative: Use mock mode while fixing:');
    console.log('   npm run mock');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connection closed');
  }
}

testAtlasConnection();
