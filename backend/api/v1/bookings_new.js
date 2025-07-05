/**
 * Bookings API Endpoints
 * Database-driven booking management with MongoDB
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { Booking, Van } = require('../../models');

// Utility function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateBooking = [
  body('van_id').isMongoId().withMessage('Valid van ID is required'),
  body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer_email').isEmail().withMessage('Valid email is required'),
  body('customer_phone').trim().notEmpty().withMessage('Phone number is required'),
  body('checkin_date').isISO8601().withMessage('Valid checkin date is required'),
  body('checkout_date').isISO8601().withMessage('Valid checkout date is required'),
  body('base_price').isFloat({ min: 0 }).withMessage('Base price must be positive'),
  body('total_price').isFloat({ min: 0 }).withMessage('Total price must be positive')
];

// Helper to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        status: 400,
        details: errors.array(),
        timestamp: new Date().toISOString()
      }
    });
  }
  next();
};

// GET /api/v1/bookings - List all bookings with filtering and pagination
router.get('/', [
  query('status').optional().isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  query('payment_status').optional().isIn(['pending', 'partial', 'paid', 'refunded']),
  query('van_id').optional().isMongoId(),
  query('customer_email').optional().isEmail(),
  query('checkin_date').optional().isISO8601(),
  query('checkout_date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort_by').optional().isIn(['created_at', 'checkin_date', 'total_price', 'customer_name']),
  query('sort_order').optional().isIn(['asc', 'desc'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  // Build query
  const query = {};
  
  // Apply filters
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.payment_status) {
    query.payment_status = req.query.payment_status;
  }
  if (req.query.van_id) {
    query.van_id = req.query.van_id;
  }
  if (req.query.customer_email) {
    query.customer_email = req.query.customer_email.toLowerCase();
  }
  if (req.query.checkin_date || req.query.checkout_date) {
    if (req.query.checkin_date && req.query.checkout_date) {
      // Find bookings that overlap with the specified date range
      query.$or = [
        { checkin_date: { $gte: new Date(req.query.checkin_date), $lte: new Date(req.query.checkout_date) } },
        { checkout_date: { $gte: new Date(req.query.checkin_date), $lte: new Date(req.query.checkout_date) } },
        { 
          checkin_date: { $lte: new Date(req.query.checkin_date) },
          checkout_date: { $gte: new Date(req.query.checkout_date) }
        }
      ];
    }
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Sorting
  const sortBy = req.query.sort_by || 'created_at';
  const sortOrder = req.query.sort_order === 'desc' ? -1 : 1;
  const sort = { [sortBy]: sortOrder };
  
  // Execute query with population
  const [bookings, total] = await Promise.all([
    Booking.find(query).populate('van_id', 'name type location').sort(sort).skip(skip).limit(limit),
    Booking.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    data: bookings,
    meta: {
      total,
      page,
      limit,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1
    },
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/bookings/:id - Get specific booking
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('van_id');
  
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
}));

// POST /api/v1/bookings - Create new booking
router.post('/', validateBooking, handleValidationErrors, asyncHandler(async (req, res) => {
  // Verify van exists
  const van = await Van.findById(req.body.van_id);
  if (!van) {
    return res.status(400).json({
      error: {
        message: 'Van not found',
        status: 400,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Check for overlapping bookings
  const checkinDate = new Date(req.body.checkin_date);
  const checkoutDate = new Date(req.body.checkout_date);
  
  const overlappingBooking = await Booking.findOne({
    van_id: req.body.van_id,
    status: { $in: ['confirmed', 'in_progress'] },
    $or: [
      { checkin_date: { $gte: checkinDate, $lt: checkoutDate } },
      { checkout_date: { $gt: checkinDate, $lte: checkoutDate } },
      { checkin_date: { $lte: checkinDate }, checkout_date: { $gte: checkoutDate } }
    ]
  });
  
  if (overlappingBooking) {
    return res.status(409).json({
      error: {
        message: 'Van is not available for the selected dates',
        status: 409,
        details: { conflicting_booking: overlappingBooking._id },
        timestamp: new Date().toISOString()
      }
    });
  }
  
  const booking = new Booking(req.body);
  await booking.save();
  
  // Populate van info for response
  await booking.populate('van_id', 'name type location');
  
  res.status(201).json({
    data: booking,
    message: 'Booking created successfully',
    timestamp: new Date().toISOString()
  });
}));

// PUT /api/v1/bookings/:id - Update booking
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  ...validateBooking
], handleValidationErrors, asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('van_id', 'name type location');
  
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
    message: 'Booking updated successfully',
    timestamp: new Date().toISOString()
  });
}));

// PATCH /api/v1/bookings/:id/status - Update booking status
router.patch('/:id/status', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('status').isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return res.status(404).json({
      error: {
        message: 'Booking not found',
        status: 404,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  await booking.updateStatus(req.body.status);
  await booking.populate('van_id', 'name type location');
  
  res.json({
    data: booking,
    message: 'Booking status updated successfully',
    timestamp: new Date().toISOString()
  });
}));

// DELETE /api/v1/bookings/:id - Cancel/Delete booking
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('reason').optional().isString().withMessage('Cancellation reason must be a string'),
  body('refund_amount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be positive')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return res.status(404).json({
      error: {
        message: 'Booking not found',
        status: 404,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Cancel the booking instead of hard delete
  await booking.cancel(req.body.reason || 'Cancelled by admin', req.body.refund_amount || 0);
  
  res.json({
    message: 'Booking cancelled successfully',
    data: { id: req.params.id, status: 'cancelled' },
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/bookings/stats - Get booking statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total_revenue: { $sum: '$total_price' }
      }
    }
  ]);
  
  const totalBookings = await Booking.countDocuments();
  const totalRevenue = await Booking.aggregate([
    { $group: { _id: null, total: { $sum: '$total_price' } } }
  ]);
  
  res.json({
    data: {
      by_status: stats,
      total_bookings: totalBookings,
      total_revenue: totalRevenue[0]?.total || 0,
      summary: {
        confirmed: stats.find(s => s._id === 'confirmed')?.count || 0,
        pending: stats.find(s => s._id === 'pending')?.count || 0,
        completed: stats.find(s => s._id === 'completed')?.count || 0,
        cancelled: stats.find(s => s._id === 'cancelled')?.count || 0
      }
    },
    timestamp: new Date().toISOString()
  });
}));

module.exports = router;
