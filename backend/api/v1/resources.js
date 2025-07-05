/**
 * Van Resources API Endpoints
 * Inspired by booking.bl resource management architecture
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');

// Mock data store (will be replaced with database)
let vans = [
  {
    id: 1,
    name: 'Adventure Seeker',
    type: 'standard',
    location: 'San Francisco, CA',
    base_price: 89.00,
    capacity: 2,
    status: 'active',
    features: {
      amenities: ['Kitchen', 'Bed', 'Solar Power', 'Toilet'],
      specifications: {
        length: '20ft',
        engine: 'V6',
        transmission: 'Automatic',
        fuel_type: 'Gasoline'
      }
    },
    images: [
      'https://example.com/van1-exterior.jpg',
      'https://example.com/van1-interior.jpg'
    ],
    availability_calendar: {},
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-07-05')
  },
  {
    id: 2,
    name: 'Luxury Explorer',
    type: 'premium',
    location: 'Los Angeles, CA',
    base_price: 149.00,
    capacity: 4,
    status: 'active',
    features: {
      amenities: ['Full Kitchen', 'Queen Bed', 'Solar Power', 'Bathroom', 'AC/Heat', 'WiFi'],
      specifications: {
        length: '24ft',
        engine: 'V8',
        transmission: 'Automatic',
        fuel_type: 'Gasoline'
      }
    },
    images: [
      'https://example.com/van2-exterior.jpg',
      'https://example.com/van2-interior.jpg'
    ],
    availability_calendar: {},
    created_at: new Date('2025-01-15'),
    updated_at: new Date('2025-07-05')
  },
  {
    id: 3,
    name: 'Eco Wanderer',
    type: 'eco-friendly',
    location: 'Portland, OR',
    base_price: 119.00,
    capacity: 2,
    status: 'maintenance',
    features: {
      amenities: ['Kitchenette', 'Convertible Bed', 'Solar Power', 'Composting Toilet'],
      specifications: {
        length: '18ft',
        engine: 'Electric',
        transmission: 'Automatic',
        fuel_type: 'Electric'
      }
    },
    images: [
      'https://example.com/van3-exterior.jpg',
      'https://example.com/van3-interior.jpg'
    ],
    availability_calendar: {},
    created_at: new Date('2025-02-01'),
    updated_at: new Date('2025-07-05')
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
  query('sort_by').optional().isIn(['name', 'price', 'capacity', 'created_at']),
  query('sort_order').optional().isIn(['asc', 'desc'])
], handleValidationErrors, (req, res) => {
  try {
    let filteredVans = [...vans];
    
    // Apply filters
    if (req.query.status) {
      filteredVans = filteredVans.filter(van => van.status === req.query.status);
    }
    if (req.query.type) {
      filteredVans = filteredVans.filter(van => van.type === req.query.type);
    }
    if (req.query.location) {
      filteredVans = filteredVans.filter(van => 
        van.location.toLowerCase().includes(req.query.location.toLowerCase())
      );
    }
    if (req.query.min_price) {
      filteredVans = filteredVans.filter(van => van.base_price >= parseFloat(req.query.min_price));
    }
    if (req.query.max_price) {
      filteredVans = filteredVans.filter(van => van.base_price <= parseFloat(req.query.max_price));
    }
    if (req.query.capacity) {
      filteredVans = filteredVans.filter(van => van.capacity >= parseInt(req.query.capacity));
    }
    
    // Sorting
    const sortBy = req.query.sort_by || 'name';
    const sortOrder = req.query.sort_order || 'asc';
    
    filteredVans.sort((a, b) => {
      let aValue = a[sortBy === 'price' ? 'base_price' : sortBy];
      let bValue = b[sortBy === 'price' ? 'base_price' : sortBy];
      
      if (typeof aValue === 'string') {
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
    
    const paginatedVans = filteredVans.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedVans,
      meta: {
        total: filteredVans.length,
        page,
        limit,
        total_pages: Math.ceil(filteredVans.length / limit),
        has_next: endIndex < filteredVans.length,
        has_prev: page > 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to retrieve vans',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/v1/resources/vans/:id - Get specific van
router.get('/vans/:id', [
  param('id').isInt({ min: 1 })
], handleValidationErrors, (req, res) => {
  try {
    const vanId = parseInt(req.params.id);
    const van = vans.find(v => v.id === vanId);
    
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
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to retrieve van',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// POST /api/v1/resources/vans - Create new van
router.post('/vans', [
  body('name').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('type').isIn(['standard', 'premium', 'luxury', 'eco-friendly']),
  body('location').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('base_price').isFloat({ min: 0 }),
  body('capacity').isInt({ min: 1, max: 20 }),
  body('features').optional().isObject(),
  body('images').optional().isArray()
], handleValidationErrors, (req, res) => {
  try {
    const newVan = {
      id: Math.max(...vans.map(v => v.id)) + 1,
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      base_price: parseFloat(req.body.base_price),
      capacity: parseInt(req.body.capacity),
      status: 'active',
      features: req.body.features || {},
      images: req.body.images || [],
      availability_calendar: {},
      created_at: new Date(),
      updated_at: new Date()
    };
    
    vans.push(newVan);
    
    res.status(201).json({
      data: newVan,
      message: 'Van created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to create van',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// PUT /api/v1/resources/vans/:id - Update van
router.put('/vans/:id', [
  param('id').isInt({ min: 1 }),
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('type').optional().isIn(['standard', 'premium', 'luxury', 'eco-friendly']),
  body('location').optional().trim().isLength({ min: 1, max: 255 }),
  body('base_price').optional().isFloat({ min: 0 }),
  body('capacity').optional().isInt({ min: 1, max: 20 }),
  body('features').optional().isObject(),
  body('images').optional().isArray()
], handleValidationErrors, (req, res) => {
  try {
    const vanId = parseInt(req.params.id);
    const vanIndex = vans.findIndex(v => v.id === vanId);
    
    if (vanIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Van not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Update van with provided fields
    const updatedVan = {
      ...vans[vanIndex],
      ...req.body,
      id: vanId, // Ensure ID doesn't change
      updated_at: new Date()
    };
    
    vans[vanIndex] = updatedVan;
    
    res.json({
      data: updatedVan,
      message: 'Van updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to update van',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// PATCH /api/v1/resources/vans/:id/status - Toggle van status
router.patch('/vans/:id/status', [
  param('id').isInt({ min: 1 }),
  body('status').isIn(['active', 'inactive', 'maintenance'])
], handleValidationErrors, (req, res) => {
  try {
    const vanId = parseInt(req.params.id);
    const vanIndex = vans.findIndex(v => v.id === vanId);
    
    if (vanIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Van not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    vans[vanIndex].status = req.body.status;
    vans[vanIndex].updated_at = new Date();
    
    res.json({
      data: vans[vanIndex],
      message: `Van status updated to ${req.body.status}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to update van status',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// DELETE /api/v1/resources/vans/:id - Delete van
router.delete('/vans/:id', [
  param('id').isInt({ min: 1 })
], handleValidationErrors, (req, res) => {
  try {
    const vanId = parseInt(req.params.id);
    const vanIndex = vans.findIndex(v => v.id === vanId);
    
    if (vanIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Van not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    const deletedVan = vans.splice(vanIndex, 1)[0];
    
    res.json({
      data: deletedVan,
      message: 'Van deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to delete van',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;
