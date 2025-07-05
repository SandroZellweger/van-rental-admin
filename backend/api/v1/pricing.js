/**
 * Pricing Management API Endpoints
 * Dynamic pricing engine inspired by booking.bl pricing system
 */

const express = require('express');
const router = express.Router();

// Mock pricing profiles
let pricingProfiles = [
  {
    id: 1,
    name: 'Summer Peak Season',
    type: 'seasonal',
    van_types: ['all'],
    date_ranges: [
      { start: '2025-06-01', end: '2025-08-31' }
    ],
    multiplier: 1.5,
    is_active: true,
    priority: 1
  },
  {
    id: 2,
    name: 'Holiday Special',
    type: 'promotional',
    van_types: ['premium', 'luxury'],
    date_ranges: [
      { start: '2025-12-20', end: '2025-01-05' }
    ],
    multiplier: 0.9,
    is_active: true,
    priority: 2
  }
];

// GET /api/v1/pricing/profiles - List pricing profiles
router.get('/profiles', (req, res) => {
  res.json({
    data: pricingProfiles,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/pricing/calculate - Calculate price for specific booking
router.post('/calculate', (req, res) => {
  const { van_id, van_type, checkin_date, checkout_date, base_price } = req.body;
  
  // Simple pricing calculation (would be more complex in real implementation)
  let finalPrice = base_price || 89.00;
  const totalDays = Math.ceil((new Date(checkout_date) - new Date(checkin_date)) / (1000 * 60 * 60 * 24));
  
  const baseTotalPrice = finalPrice * totalDays;
  const taxes = baseTotalPrice * 0.08;
  const fees = 25.00;
  
  res.json({
    data: {
      base_price_per_day: finalPrice,
      total_days: totalDays,
      base_total: baseTotalPrice,
      taxes,
      fees,
      final_total: baseTotalPrice + taxes + fees,
      applied_rules: ['base_pricing']
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
