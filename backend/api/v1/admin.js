/**
 * Admin Management API Endpoints
 * Admin-specific functionality inspired by booking.bl admin system
 */

const express = require('express');
const router = express.Router();

// GET /api/v1/admin/dashboard - Admin dashboard data
router.get('/dashboard', (req, res) => {
  const dashboardData = {
    overview: {
      total_vans: 3,
      active_vans: 2,
      total_bookings: 2,
      revenue_this_month: 1455.52,
      occupancy_rate: 85.2
    },
    recent_bookings: [
      {
        id: 2,
        customer_name: 'Jane Smith',
        van_name: 'Luxury Explorer',
        checkin_date: '2025-08-01',
        status: 'pending',
        total_price: 950.52
      },
      {
        id: 1,
        customer_name: 'John Doe', 
        van_name: 'Adventure Seeker',
        checkin_date: '2025-07-15',
        status: 'confirmed',
        total_price: 505.60
      }
    ],
    van_status: [
      { van_id: 1, name: 'Adventure Seeker', status: 'active', utilization: 78 },
      { van_id: 2, name: 'Luxury Explorer', status: 'active', utilization: 92 },
      { van_id: 3, name: 'Eco Wanderer', status: 'maintenance', utilization: 0 }
    ],
    revenue_chart: [
      { month: 'Jan', revenue: 5400 },
      { month: 'Feb', revenue: 6200 },
      { month: 'Mar', revenue: 7100 },
      { month: 'Apr', revenue: 6800 },
      { month: 'May', revenue: 8200 },
      { month: 'Jun', revenue: 9100 },
      { month: 'Jul', revenue: 7600 }
    ]
  };
  
  res.json({
    data: dashboardData,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/admin/settings - Get system settings
router.get('/settings', (req, res) => {
  res.json({
    data: {
      business_name: 'VanLife Adventures',
      contact_email: 'admin@vanlife.com',
      booking_settings: {
        min_booking_days: 1,
        max_booking_days: 30,
        check_in_time: '15:00',
        check_out_time: '11:00'
      },
      pricing_settings: {
        tax_rate: 0.08,
        booking_fee: 25.00,
        currency: 'USD'
      }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
