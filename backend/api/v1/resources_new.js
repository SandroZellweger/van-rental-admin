/**
 * Van Resources API Endpoints
 * Database-driven van management with MongoDB
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { Van } = require('../../models');

// Utility function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateVan = [
  body('name').trim().notEmpty().withMessage('Van name is required'),
  body('type').isIn(['compact', 'standard', 'premium', 'luxury', 'eco-friendly']).withMessage('Invalid van type'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('base_price').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('capacity').isInt({ min: 1, max: 10 }).withMessage('Capacity must be between 1 and 10')
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

// GET /api/v1/resources/vans - List all vans with filtering and pagination
router.get('/vans', [
  query('status').optional().isIn(['active', 'inactive', 'maintenance']),
  query('type').optional().isString(),
  query('location').optional().isString(),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('capacity').optional().isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort_by').optional().isIn(['name', 'base_price', 'capacity', 'created_at']),
  query('sort_order').optional().isIn(['asc', 'desc'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  // Build query
  const query = {};
  
  // Apply filters
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: 'i' };
  }
  if (req.query.min_price || req.query.max_price) {
    query.base_price = {};
    if (req.query.min_price) query.base_price.$gte = parseFloat(req.query.min_price);
    if (req.query.max_price) query.base_price.$lte = parseFloat(req.query.max_price);
  }
  if (req.query.capacity) {
    query.capacity = { $gte: parseInt(req.query.capacity) };
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Sorting
  const sortBy = req.query.sort_by || 'name';
  const sortOrder = req.query.sort_order === 'desc' ? -1 : 1;
  const sort = { [sortBy]: sortOrder };
  
  // Execute query
  const [vans, total] = await Promise.all([
    Van.find(query).sort(sort).skip(skip).limit(limit),
    Van.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    data: vans,
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

// GET /api/v1/resources/vans/:id - Get specific van
router.get('/vans/:id', [
  param('id').isMongoId().withMessage('Invalid van ID')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const van = await Van.findById(req.params.id);
  
  if (!van) {
    return res.status(404).json({
      error: {
        message: 'Van not found',
        status: 404,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  res.json({
    data: van,
    timestamp: new Date().toISOString()
  });
}));

// POST /api/v1/resources/vans - Create new van
router.post('/vans', validateVan, handleValidationErrors, asyncHandler(async (req, res) => {
  const van = new Van(req.body);
  await van.save();
  
  res.status(201).json({
    data: van,
    message: 'Van created successfully',
    timestamp: new Date().toISOString()
  });
}));

// PUT /api/v1/resources/vans/:id - Update van
router.put('/vans/:id', [
  param('id').isMongoId().withMessage('Invalid van ID'),
  ...validateVan
], handleValidationErrors, asyncHandler(async (req, res) => {
  const van = await Van.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!van) {
    return res.status(404).json({
      error: {
        message: 'Van not found',
        status: 404,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  res.json({
    data: van,
    message: 'Van updated successfully',
    timestamp: new Date().toISOString()
  });
}));

// PATCH /api/v1/resources/vans/:id/status - Update van status
router.patch('/vans/:id/status', [
  param('id').isMongoId().withMessage('Invalid van ID'),
  body('status').isIn(['active', 'inactive', 'maintenance', 'rented']).withMessage('Invalid status')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const van = await Van.findById(req.params.id);
  
  if (!van) {
    return res.status(404).json({
      error: {
        message: 'Van not found',
        status: 404,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  await van.updateStatus(req.body.status);
  
  res.json({
    data: van,
    message: 'Van status updated successfully',
    timestamp: new Date().toISOString()
  });
}));

// DELETE /api/v1/resources/vans/:id - Delete van
router.delete('/vans/:id', [
  param('id').isMongoId().withMessage('Invalid van ID')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const van = await Van.findByIdAndDelete(req.params.id);
  
  if (!van) {
    return res.status(404).json({
      error: {
        message: 'Van not found',
        status: 404,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  res.json({
    message: 'Van deleted successfully',
    data: { id: req.params.id },
    timestamp: new Date().toISOString()
  });
}));

module.exports = router;
