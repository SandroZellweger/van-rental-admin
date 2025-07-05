/**
 * Simple Van Upload Test Server
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3005;

// CORS
app.use(cors());
app.use(express.json());

// Mock data storage
let mockVans = [
  { 
    _id: '1', 
    name: 'Adventure Seeker', 
    type: 'standard', 
    location: 'San Francisco, CA', 
    base_price: 89.00, 
    capacity: 2, 
    status: 'active',
    features: {
      amenities: ['Kitchen', 'Bed', 'Solar Power'],
      specifications: { length: '20ft', height: '8ft', width: '6.5ft' }
    },
    pricing_profile: 'standard',
    description: 'Perfect for couples and small groups seeking adventure.',
    enabled: true
  }
];

let mockBookings = [
  {
    _id: '1',
    van_id: '1',
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    checkin_date: new Date('2025-07-15'),
    checkout_date: new Date('2025-07-20'),
    total_price: 445.00,
    status: 'confirmed',
    total_days: 5
  }
];

let mockPricingProfiles = [
  {
    _id: '1',
    id: 'standard',
    name: 'Standard Pricing',
    description: 'Regular pricing for most vans',
    type: 'standard',
    baseMultiplier: 1.0,
    weekendMultiplier: 1.2,
    is_active: true
  }
];

// Health check
app.get('/api/v1/admin/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple test server running' });
});

// Get vans
app.get('/api/v1/resources/vans', (req, res) => {
  res.json({ data: mockVans, message: 'Vans retrieved successfully' });
});

// Create van
app.post('/api/v1/resources/vans', (req, res) => {
  console.log('🚐 Creating van:', req.body);
  
  const newVan = {
    _id: Date.now().toString(),
    ...req.body,
    status: 'active',
    enabled: true
  };
  
  mockVans.push(newVan);
  
  res.status(201).json({
    data: newVan,
    message: 'Van created successfully'
  });
});

// Get bookings
app.get('/api/v1/bookings', (req, res) => {
  res.json({ data: mockBookings, message: 'Bookings retrieved successfully' });
});

// Create booking
app.post('/api/v1/bookings', (req, res) => {
  console.log('📅 Creating booking:', req.body);
  
  const newBooking = {
    _id: Date.now().toString(),
    ...req.body
  };
  
  mockBookings.push(newBooking);
  
  res.status(201).json({
    data: newBooking,
    message: 'Booking created successfully'
  });
});

// Get pricing profiles
app.get('/api/v1/pricing/profiles', (req, res) => {
  res.json({ data: mockPricingProfiles, message: 'Pricing profiles retrieved successfully' });
});

// Media endpoints (mock)
app.get('/api/v1/media', (req, res) => {
  res.json({ data: [], message: 'No media items' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`🧪 Test at: http://localhost:${PORT}/api/v1/admin/health`);
});
