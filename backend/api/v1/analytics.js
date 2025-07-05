/**
 * Analytics API Endpoints
 * Reporting and analytics inspired by booking.bl analytics system
 */

const express = require('express');
const router = express.Router();

// GET /api/v1/analytics/revenue - Revenue analytics
router.get('/revenue', (req, res) => {
  const { period = 'month', year = new Date().getFullYear() } = req.query;
  
  const revenueData = {
    period,
    year: parseInt(year),
    data: [
      { period: 'Jan', revenue: 5400, bookings: 12 },
      { period: 'Feb', revenue: 6200, bookings: 14 },
      { period: 'Mar', revenue: 7100, bookings: 16 },
      { period: 'Apr', revenue: 6800, bookings: 15 },
      { period: 'May', revenue: 8200, bookings: 18 },
      { period: 'Jun', revenue: 9100, bookings: 20 },
      { period: 'Jul', revenue: 7600, bookings: 17 }
    ],
    totals: {
      total_revenue: 50400,
      total_bookings: 112,
      average_booking_value: 450
    }
  };
  
  res.json({
    data: revenueData,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/analytics/occupancy - Occupancy analytics
router.get('/occupancy', (req, res) => {
  const occupancyData = {
    overall_occupancy_rate: 85.2,
    by_van_type: [
      { type: 'standard', occupancy_rate: 78.5, total_days: 180 },
      { type: 'premium', occupancy_rate: 92.1, total_days: 210 },
      { type: 'luxury', occupancy_rate: 89.3, total_days: 165 }
    ],
    by_month: [
      { month: 'Jan', occupancy_rate: 72.5 },
      { month: 'Feb', occupancy_rate: 78.2 },
      { month: 'Mar', occupancy_rate: 85.1 },
      { month: 'Apr', occupancy_rate: 91.3 },
      { month: 'May', occupancy_rate: 94.7 },
      { month: 'Jun', occupancy_rate: 96.2 },
      { month: 'Jul', occupancy_rate: 88.9 }
    ]
  };
  
  res.json({
    data: occupancyData,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
