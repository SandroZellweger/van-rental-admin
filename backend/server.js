/**
 * VanLife Admin Backend Server
 * Professional booking system inspired by booking.bl architecture
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const database = require('./config/database');
const { Van, Booking, User, Pricing } = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/v1/resources', require('./api/v1/resources'));
app.use('/api/v1/bookings', require('./api/v1/bookings'));
app.use('/api/v1/pricing', require('./api/v1/pricing'));
app.use('/api/v1/media', require('./api/v1/media'));
app.use('/api/v1/availability', require('./api/v1/availability'));
app.use('/api/v1/search', require('./api/v1/search'));
app.use('/api/v1/admin', require('./api/v1/admin'));
app.use('/api/v1/analytics', require('./api/v1/analytics'));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await database.healthCheck();
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'VanLife Admin API - Professional Booking System',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      resources: '/api/v1/resources',
      bookings: '/api/v1/bookings',
      pricing: '/api/v1/pricing',
      media: '/api/v1/media',
      availability: '/api/v1/availability',
      search: '/api/v1/search',
      admin: '/api/v1/admin',
      analytics: '/api/v1/analytics'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404,
      timestamp: new Date().toISOString(),
      availableEndpoints: '/api'
    }
  });
});

// Database connection and server startup
async function startServer() {
  try {
    // Try to connect to database
    await database.connect();
    
    // Create default admin user if database is connected
    if (database.isConnected) {
      await User.createDefaultAdmin();
    }
    
    // Start server regardless of database connection
    app.listen(PORT, () => {
      console.log(`
🚐 VanLife Admin Backend Server
================================
🌐 Server running on port ${PORT}
🔗 API Base URL: http://localhost:${PORT}/api/v1
📚 API Docs: http://localhost:${PORT}/api
💚 Health Check: http://localhost:${PORT}/health
🏠 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8000'}
📊 Environment: ${process.env.NODE_ENV || 'development'}
🗄️ Database: ${database.isConnected ? 'Connected ✅' : 'Mock Mode ⚠️'}

${!database.isConnected ? `
⚠️  RUNNING WITH MOCK DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 To use real database:
   1. Install MongoDB: https://www.mongodb.com/try/download/community
   2. Start MongoDB service
   3. Restart this server
   
🔄 OR use MongoDB Atlas:
   1. Update MONGODB_URI in .env file
   2. Restart this server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}
================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    
    // Try to start server without database in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Attempting to start server without database...');
      app.listen(PORT, () => {
        console.log(`
🚐 VanLife Admin Backend Server (Mock Mode)
================================
🌐 Server running on port ${PORT}
⚠️  Database: Mock data only
🔗 API Base URL: http://localhost:${PORT}/api/v1
================================
        `);
      });
    } else {
      process.exit(1);
    }
  }
}

// Start the server
startServer();

module.exports = app;
