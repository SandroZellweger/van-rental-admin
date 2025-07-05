/**
 * Bookings API Endpoints
 * Professional booking management inspired by booking.bl architecture
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');

// Mock bookings data store
let bookings = [
  {
    id: 1,
    van_id: 1,
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    customer_phone: '+1-555-0123',
    checkin_date: '2025-07-15',
    checkout_date: '2025-07-20',
    checkin_time: '15:00',
    checkout_time: '11:00',
    total_days: 5,
    base_price: 89.00,
    total_price: 445.00,
    pricing_breakdown: {
      base_total: 445.00,
      taxes: 35.60,
      fees: 25.00,
      discounts: 0,
      final_total: 505.60
    },
    status: 'confirmed',
    payment_status: 'paid',
    special_requests: 'Early check-in if possible',
    booking_source: 'web',
    created_at: new Date('2025-07-01'),
    updated_at: new Date('2025-07-05')
  },
  {
    id: 2,
    van_id: 2,
    customer_name: 'Jane Smith',
    customer_email: 'jane.smith@example.com',
    customer_phone: '+1-555-0456',
    checkin_date: '2025-08-01',
    checkout_date: '2025-08-07',
    checkin_time: '15:00',
    checkout_time: '11:00',
    total_days: 6,
    base_price: 149.00,
    total_price: 894.00,
    pricing_breakdown: {
      base_total: 894.00,
      taxes: 71.52,
      fees: 35.00,
      discounts: 50.00,
      final_total: 950.52
    },
    status: 'pending',
    payment_status: 'pending',
    special_requests: '',
    booking_source: 'phone',
    created_at: new Date('2025-07-03'),
    updated_at: new Date('2025-07-03')
  }
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: errors.array(),
        status: 400,
        timestamp: new Date().toISOString()
      }
    });
  }
  next();
};

// Helper function to check date availability (simplified)
const isVanAvailable = (vanId, checkinDate, checkoutDate, excludeBookingId = null) => {
  const overlappingBookings = bookings.filter(booking => {
    if (excludeBookingId && booking.id === excludeBookingId) return false;
    if (booking.van_id !== vanId) return false;
    if (booking.status === 'cancelled') return false;
    
    const bookingCheckin = new Date(booking.checkin_date);
    const bookingCheckout = new Date(booking.checkout_date);
    const requestCheckin = new Date(checkinDate);
    const requestCheckout = new Date(checkoutDate);
    
    // Check for date overlap
    return (requestCheckin < bookingCheckout && requestCheckout > bookingCheckin);
  });
  
  return overlappingBookings.length === 0;
};

// GET /api/v1/bookings - List all bookings with filtering
router.get('/', [
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  query('payment_status').optional().isIn(['pending', 'paid', 'refunded']),
  query('van_id').optional().isInt({ min: 1 }),
  query('customer_email').optional().isEmail(),
  query('date_from').optional().isISO8601(),
  query('date_to').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort_by').optional().isIn(['id', 'customer_name', 'checkin_date', 'total_price', 'created_at']),
  query('sort_order').optional().isIn(['asc', 'desc'])
], handleValidationErrors, (req, res) => {
  try {
    let filteredBookings = [...bookings];
    
    // Apply filters
    if (req.query.status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === req.query.status);
    }
    if (req.query.payment_status) {
      filteredBookings = filteredBookings.filter(booking => booking.payment_status === req.query.payment_status);
    }
    if (req.query.van_id) {
      filteredBookings = filteredBookings.filter(booking => booking.van_id === parseInt(req.query.van_id));
    }
    if (req.query.customer_email) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.customer_email.toLowerCase().includes(req.query.customer_email.toLowerCase())
      );
    }
    if (req.query.date_from) {
      const fromDate = new Date(req.query.date_from);
      filteredBookings = filteredBookings.filter(booking => 
        new Date(booking.checkin_date) >= fromDate
      );
    }
    if (req.query.date_to) {
      const toDate = new Date(req.query.date_to);
      filteredBookings = filteredBookings.filter(booking => 
        new Date(booking.checkout_date) <= toDate
      );
    }
    
    // Sorting
    const sortBy = req.query.sort_by || 'created_at';
    const sortOrder = req.query.sort_order || 'desc';
    
    filteredBookings.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy.includes('date') || sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedBookings,
      meta: {
        total: filteredBookings.length,
        page,
        limit,
        total_pages: Math.ceil(filteredBookings.length / limit),
        has_next: endIndex < filteredBookings.length,
        has_prev: page > 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to retrieve bookings',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/v1/bookings/:id - Get specific booking
router.get('/:id', [
  param('id').isInt({ min: 1 })
], handleValidationErrors, (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return res.status(404).json({
        error: {
          message: 'Booking not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    res.json({
      data: booking,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to retrieve booking',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// POST /api/v1/bookings - Create new booking
router.post('/', [
  body('van_id').isInt({ min: 1 }),
  body('customer_name').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('customer_email').isEmail().normalizeEmail(),
  body('customer_phone').notEmpty().trim(),
  body('checkin_date').isISO8601(),
  body('checkout_date').isISO8601(),
  body('checkin_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('checkout_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('special_requests').optional().trim().isLength({ max: 1000 })
], handleValidationErrors, (req, res) => {
  try {
    const { van_id, customer_name, customer_email, customer_phone, 
            checkin_date, checkout_date, checkin_time, checkout_time, special_requests } = req.body;
    
    // Validate dates
    const checkin = new Date(checkin_date);
    const checkout = new Date(checkout_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkin < today) {
      return res.status(400).json({
        error: {
          message: 'Check-in date cannot be in the past',
          status: 400,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    if (checkout <= checkin) {
      return res.status(400).json({
        error: {
          message: 'Check-out date must be after check-in date',
          status: 400,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Check van availability
    if (!isVanAvailable(van_id, checkin_date, checkout_date)) {
      return res.status(409).json({
        error: {
          message: 'Van is not available for the selected dates',
          status: 409,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Calculate booking details
    const totalDays = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const basePrice = 89.00; // This would come from van data in real implementation
    const baseTotalPrice = basePrice * totalDays;
    
    const newBooking = {
      id: Math.max(...bookings.map(b => b.id)) + 1,
      van_id: parseInt(van_id),
      customer_name,
      customer_email,
      customer_phone,
      checkin_date,
      checkout_date,
      checkin_time: checkin_time || '15:00',
      checkout_time: checkout_time || '11:00',
      total_days: totalDays,
      base_price: basePrice,
      total_price: baseTotalPrice,
      pricing_breakdown: {
        base_total: baseTotalPrice,
        taxes: baseTotalPrice * 0.08,
        fees: 25.00,
        discounts: 0,
        final_total: baseTotalPrice + (baseTotalPrice * 0.08) + 25.00
      },
      status: 'pending',
      payment_status: 'pending',
      special_requests: special_requests || '',
      booking_source: 'web',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    bookings.push(newBooking);
    
    res.status(201).json({
      data: newBooking,
      message: 'Booking created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to create booking',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// PUT /api/v1/bookings/:id - Update booking
router.put('/:id', [
  param('id').isInt({ min: 1 }),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  body('payment_status').optional().isIn(['pending', 'paid', 'refunded']),
  body('special_requests').optional().trim().isLength({ max: 1000 })
], handleValidationErrors, (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Booking not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Update booking with provided fields
    const updatedBooking = {
      ...bookings[bookingIndex],
      ...req.body,
      id: bookingId,
      updated_at: new Date()
    };
    
    bookings[bookingIndex] = updatedBooking;
    
    res.json({
      data: updatedBooking,
      message: 'Booking updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to update booking',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// DELETE /api/v1/bookings/:id - Cancel booking
router.delete('/:id', [
  param('id').isInt({ min: 1 })
], handleValidationErrors, (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Booking not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Update status to cancelled instead of deleting
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].updated_at = new Date();
    
    res.json({
      data: bookings[bookingIndex],
      message: 'Booking cancelled successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to cancel booking',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/v1/bookings/stats - Get booking statistics
router.get('/stats', (req, res) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);
    
    const stats = {
      total_bookings: bookings.length,
      confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
      pending_bookings: bookings.filter(b => b.status === 'pending').length,
      cancelled_bookings: bookings.filter(b => b.status === 'cancelled').length,
      completed_bookings: bookings.filter(b => b.status === 'completed').length,
      
      this_month_bookings: bookings.filter(b => new Date(b.created_at) >= thisMonth).length,
      this_year_bookings: bookings.filter(b => new Date(b.created_at) >= thisYear).length,
      
      total_revenue: bookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + b.pricing_breakdown.final_total, 0),
      
      pending_revenue: bookings
        .filter(b => b.payment_status === 'pending' && b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.pricing_breakdown.final_total, 0),
      
      average_booking_value: bookings.length > 0 
        ? bookings.reduce((sum, b) => sum + b.pricing_breakdown.final_total, 0) / bookings.length 
        : 0,
      
      occupancy_rate: 85.2, // This would be calculated based on actual availability data
      
      top_van_types: [
        { type: 'premium', bookings: 15, revenue: 7500 },
        { type: 'standard', bookings: 12, revenue: 4800 },
        { type: 'luxury', bookings: 8, revenue: 6400 }
      ]
    };
    
    res.json({
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to generate booking statistics',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;
