/**
 * Quick Backend Test Script
 * Tests database connection and starts server
 */

const database = require('./config/database');
const { Van, Booking, User, Pricing } = require('./models');

async function testSystem() {
  try {
    console.log('🔍 Testing VanLife Backend System...');
    console.log('================================\n');
    
    // Test database connection
    console.log('1. Testing database connection...');
    await database.connect();
    console.log('✅ Database connected successfully\n');
    
    // Test models
    console.log('2. Testing data models...');
    const vanCount = await Van.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const pricingCount = await Pricing.countDocuments();
    
    console.log(`📊 Database Summary:`);
    console.log(`   • Vans: ${vanCount}`);
    console.log(`   • Bookings: ${bookingCount}`);
    console.log(`   • Pricing Profiles: ${pricingCount}`);
    
    if (vanCount === 0) {
      console.log('\n⚠️  No data found. Run: npm run seed');
    }
    
    console.log('\n3. Starting server...');
    
    // Start the server
    require('./server.js');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('MongoNetworkError')) {
      console.log('\n💡 MongoDB might not be running. Please:');
      console.log('   1. Install MongoDB locally, OR');
      console.log('   2. Update MONGODB_URI in .env to use MongoDB Atlas');
    }
    
    process.exit(1);
  }
}

testSystem();
