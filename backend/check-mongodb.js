/**
 * MongoDB Installation Checker
 * Checks if MongoDB is available and provides setup guidance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkMongoInstallation() {
  console.log('🔍 Checking MongoDB Installation...');
  console.log('=====================================\n');

  // Check if mongod is available
  try {
    const version = execSync('mongod --version', { encoding: 'utf8', timeout: 5000 });
    console.log('✅ MongoDB is installed locally!');
    console.log(`📊 Version info:\n${version}`);
    
    // Try to connect to local MongoDB
    try {
      execSync('mongo --eval "db.adminCommand(\'ping\')" --quiet', { timeout: 5000 });
      console.log('✅ MongoDB service is running!');
      console.log('🔗 Available at: mongodb://localhost:27017');
      return 'local_running';
    } catch (error) {
      console.log('⚠️  MongoDB is installed but not running');
      console.log('💡 Start with: net start MongoDB');
      return 'local_stopped';
    }
  } catch (error) {
    console.log('❌ MongoDB is not installed locally');
  }

  // Check if .env has Atlas connection
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const mongoUri = envContent.match(/MONGODB_URI=(.+)/);
    
    if (mongoUri && mongoUri[1].includes('mongodb+srv://')) {
      console.log('✅ MongoDB Atlas connection string found!');
      console.log('🌐 Using cloud database');
      return 'atlas_configured';
    }
  }

  console.log('\n🔧 SETUP OPTIONS:');
  console.log('==================');
  console.log('');
  console.log('1. 🌐 MongoDB Atlas (Cloud) - RECOMMENDED');
  console.log('   • 5-minute setup');
  console.log('   • No local installation');
  console.log('   • Free tier available');
  console.log('   • Guide: MONGODB_INSTALLATION_GUIDE.md');
  console.log('');
  console.log('2. 🖥️  Local MongoDB Installation');
  console.log('   • Download: https://www.mongodb.com/try/download/community');
  console.log('   • Follow installation wizard');
  console.log('   • Start service: net start MongoDB');
  console.log('');
  console.log('3. 🧪 Continue with Mock Mode');
  console.log('   • npm run mock');
  console.log('   • No database required');
  console.log('   • Perfect for testing');

  return 'not_configured';
}

function provideSolution(status) {
  console.log('\n🚀 NEXT STEPS:');
  console.log('===============');
  
  switch (status) {
    case 'local_running':
      console.log('✅ Your MongoDB is ready! Run:');
      console.log('   npm run seed    # Populate database');
      console.log('   npm run dev     # Start server');
      break;
      
    case 'local_stopped':
      console.log('🔄 Start MongoDB service:');
      console.log('   net start MongoDB');
      console.log('   npm run seed');
      console.log('   npm run dev');
      break;
      
    case 'atlas_configured':
      console.log('🌐 Test your Atlas connection:');
      console.log('   npm run seed    # Should connect to Atlas');
      console.log('   npm run dev     # Start with cloud database');
      break;
      
    case 'not_configured':
      console.log('🎯 RECOMMENDED: Setup MongoDB Atlas');
      console.log('   1. Go to: https://www.mongodb.com/atlas');
      console.log('   2. Create free account and cluster');
      console.log('   3. Run: setup-atlas.bat');
      console.log('');
      console.log('🧪 OR use mock mode immediately:');
      console.log('   npm run mock');
      break;
  }
}

// Run the check
const status = checkMongoInstallation();
provideSolution(status);

console.log('\n📚 For detailed setup instructions:');
console.log('   • MONGODB_INSTALLATION_GUIDE.md');
console.log('   • QUICK_START_NO_DATABASE.md (mock mode)');
console.log('');
