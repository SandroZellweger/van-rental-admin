/**
 * Availability Calendar API Endpoints
 * Calendar management inspired by booking.bl availability system
 */

const express = require('express');
const router = express.Router();

// GET /api/v1/availability/calendar/:van_id - Get availability calendar for van
router.get('/calendar/:van_id', (req, res) => {
  const vanId = parseInt(req.params.van_id);
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month || new Date().getMonth() + 1;
  
  // Mock calendar data
  const calendar = {
    van_id: vanId,
    year: parseInt(year),
    month: parseInt(month),
    availability: {
      '2025-07-15': { status: 'booked', booking_id: 1 },
      '2025-07-16': { status: 'booked', booking_id: 1 },
      '2025-07-17': { status: 'booked', booking_id: 1 },
      '2025-07-18': { status: 'booked', booking_id: 1 },
      '2025-07-19': { status: 'booked', booking_id: 1 },
      '2025-07-20': { status: 'available', price: 89.00 },
      '2025-07-21': { status: 'available', price: 89.00 }
    }
  };
  
  res.json({
    data: calendar,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/availability/check - Check availability for specific dates
router.post('/check', (req, res) => {
  const { van_id, checkin_date, checkout_date } = req.body;
  
  // Simple availability check
  const isAvailable = true; // Would check against real bookings
  
  res.json({
    data: {
      van_id: parseInt(van_id),
      checkin_date,
      checkout_date,
      is_available: isAvailable,
      price_per_night: 89.00,
      total_nights: Math.ceil((new Date(checkout_date) - new Date(checkin_date)) / (1000 * 60 * 60 * 24))
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
