/**
 * VanLife Backend - No Database Mode
 * Quick start without MongoDB requirement
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data for immediate testing
const mockVans = [
  {
    _id: '60f1b2b3c4e5f6789abcdef0',
    name: 'Adventure Seeker',
    type: 'standard',
    location: 'San Francisco, CA',
    base_price: 89.00,
    capacity: 2,
    status: 'active',
    features: {
      amenities: ['Kitchen', 'Bed', 'Solar Power', 'Toilet'],
      specifications: { length: '20ft', height: '8ft', width: '6.5ft' }
    },
    pricing_profile: 'standard',
    description: 'Perfect for couples and small groups seeking adventure.',
    enabled: true
  },
  {
    _id: '60f1b2b3c4e5f6789abcdef1',
    name: 'Luxury Explorer',
    type: 'premium',
    location: 'Los Angeles, CA',
    base_price: 149.00,
    capacity: 4,
    status: 'active',
    features: {
      amenities: ['Full Kitchen', 'Queen Bed', 'Solar Power', 'Bathroom', 'AC/Heating'],
      specifications: { length: '24ft', height: '9ft', width: '7ft' }
    },
    pricing_profile: 'premium',
    description: 'Premium comfort for discerning travelers.',
    enabled: true
  }
];

const mockBookings = [
  {
    _id: '60f1b2b3c4e5f6789abcdef2',
    van_id: '60f1b2b3c4e5f6789abcdef0',
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    customer_phone: '+1-555-0123',
    checkin_date: '2025-07-15',
    checkout_date: '2025-07-20',
    base_price: 89.00,
    total_price: 445.00,
    status: 'confirmed',
    payment_status: 'paid'
  }
];

const mockPricingProfiles = [
  {
    id: 'standard',
    name: 'Standard Pricing',
    description: 'Regular pricing for most vans',
    type: 'standard',
    baseMultiplier: 1.0,
    weekendMultiplier: 1.2,
    weeklyDiscount: 0.1,
    monthlyDiscount: 0.2,
    is_active: true
  },
  {
    id: 'premium',
    name: 'Premium Pricing',
    description: 'Higher pricing for premium vans',
    type: 'premium',
    baseMultiplier: 1.3,
    weekendMultiplier: 1.4,
    weeklyDiscount: 0.08,
    monthlyDiscount: 0.15,
    is_active: true
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'mock_data',
    database: 'not_connected',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'VanLife Admin API - Mock Mode',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      vans: 'GET /api/v1/resources/vans',
      bookings: 'GET /api/v1/bookings',
      pricing: 'GET /api/v1/pricing/profiles'
    },
    timestamp: new Date().toISOString()
  });
});

// Van endpoints
app.get('/api/v1/resources/vans', (req, res) => {
  res.json({
    data: mockVans,
    meta: {
      total: mockVans.length,
      page: 1,
      limit: mockVans.length,
      total_pages: 1
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/resources/vans/:id', (req, res) => {
  const van = mockVans.find(v => v._id === req.params.id);
  if (!van) {
    return res.status(404).json({
      error: { message: 'Van not found', status: 404 }
    });
  }
  res.json({ data: van, timestamp: new Date().toISOString() });
});

// Booking endpoints
app.get('/api/v1/bookings', (req, res) => {
  res.json({
    data: mockBookings,
    meta: {
      total: mockBookings.length,
      page: 1,
      limit: mockBookings.length,
      total_pages: 1
    },
    timestamp: new Date().toISOString()
  });
});

// Pricing endpoints
app.get('/api/v1/pricing/profiles', (req, res) => {
  res.json({
    data: mockPricingProfiles,
    count: mockPricingProfiles.length,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/v1/pricing/calculate', (req, res) => {
  const { van_type, checkin_date, checkout_date, base_price = 89.00 } = req.body;
  
  const checkin = new Date(checkin_date);
  const checkout = new Date(checkout_date);
  const totalDays = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
  
  const baseTotalPrice = base_price * totalDays;
  const taxes = baseTotalPrice * 0.08;
  const fees = 25.00;
  const finalTotal = baseTotalPrice + taxes + fees;
  
  res.json({
    data: {
      base_price_per_day: base_price,
      total_days: totalDays,
      base_total: baseTotalPrice,
      taxes,
      fees,
      final_total: finalTotal,
      applied_rules: ['base_pricing', 'mock_calculation']
    },
    timestamp: new Date().toISOString()
  });
});

// Media endpoint
app.get('/api/v1/media', (req, res) => {
  res.json({
    data: [],
    message: 'Media endpoint - mock mode',
    timestamp: new Date().toISOString()
  });
});

// Catch-all for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚐 VanLife Admin Backend - MOCK MODE
════════════════════════════════════════════════════════════════
🌐 Server running on port ${PORT}
🔗 API Base URL: http://localhost:${PORT}/api/v1
💚 Health Check: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/api
🏠 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8000'}

⚠️  RUNNING WITH MOCK DATA (No Database Required)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ready for frontend testing!
✅ All API endpoints functional
✅ No MongoDB installation required

🔄 To use real database later:
   1. Install MongoDB or setup MongoDB Atlas
   2. Use 'npm run dev' instead of this script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
════════════════════════════════════════════════════════════════
  `);
});

module.exports = app;
