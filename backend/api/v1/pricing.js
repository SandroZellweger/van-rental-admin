/**
 * Pricing Management API Endpoints
 * Dynamic pricing engine with MongoDB integration
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { Pricing, Van } = require('../../models');

// Utility function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware for pricing profiles
const validatePricingProfile = [
  body('id').trim().notEmpty().withMessage('Profile ID is required'),
  body('name').trim().notEmpty().withMessage('Profile name is required'),
  body('description').trim().notEmpty().withMessage('Profile description is required'),
  body('baseMultiplier').optional().isFloat({ min: 0.1, max: 10 }).withMessage('Base multiplier must be between 0.1 and 10'),
  body('weekendMultiplier').optional().isFloat({ min: 0.1, max: 10 }).withMessage('Weekend multiplier must be between 0.1 and 10'),
  body('weeklyDiscount').optional().isFloat({ min: 0, max: 1 }).withMessage('Weekly discount must be between 0 and 1'),
  body('monthlyDiscount').optional().isFloat({ min: 0, max: 1 }).withMessage('Monthly discount must be between 0 and 1')
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

// GET /api/v1/pricing/profiles - List pricing profiles
router.get('/profiles', [
  query('type').optional().isIn(['standard', 'premium', 'luxury', 'budget', 'seasonal', 'promotional']),
  query('is_active').optional().isBoolean(),
  query('van_type').optional().isString()
], asyncHandler(async (req, res) => {
  try {
    const { type, is_active, van_type } = req.query;
    
    // Build query
    let query = {};
    if (type) query.type = type;
    if (is_active !== undefined) query.is_active = is_active === 'true';
    if (van_type) {
      query.$or = [
        { van_types: van_type },
        { van_types: 'all' }
      ];
    }

    const profiles = await Pricing.find(query).sort({ priority: -1 });

    res.json({
      data: profiles,
      count: profiles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch pricing profiles',
        status: 500,
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

// GET /api/v1/pricing/profiles/:id - Get specific pricing profile
router.get('/profiles/:id', [
  param('id').trim().notEmpty().withMessage('Profile ID is required')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const profile = await Pricing.findOne({ id: req.params.id });
    
    if (!profile) {
      return res.status(404).json({
        error: {
          message: 'Pricing profile not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      data: profile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch pricing profile',
        status: 500,
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

// POST /api/v1/pricing/profiles - Create new pricing profile
router.post('/profiles', validatePricingProfile, handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    // Check if profile with same ID already exists
    const existingProfile = await Pricing.findOne({ id: req.body.id });
    if (existingProfile) {
      return res.status(409).json({
        error: {
          message: 'Pricing profile with this ID already exists',
          status: 409,
          timestamp: new Date().toISOString()
        }
      });
    }

    const profile = new Pricing(req.body);
    await profile.save();

    res.status(201).json({
      data: profile,
      message: 'Pricing profile created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: 'Failed to create pricing profile',
        status: 400,
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

// PUT /api/v1/pricing/profiles/:id - Update pricing profile
router.put('/profiles/:id', [
  param('id').trim().notEmpty().withMessage('Profile ID is required'),
  ...validatePricingProfile.slice(1) // Skip ID validation for updates
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const profile = await Pricing.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        error: {
          message: 'Pricing profile not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      data: profile,
      message: 'Pricing profile updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: 'Failed to update pricing profile',
        status: 400,
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

// DELETE /api/v1/pricing/profiles/:id - Delete pricing profile
router.delete('/profiles/:id', [
  param('id').trim().notEmpty().withMessage('Profile ID is required')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const profile = await Pricing.findOneAndDelete({ id: req.params.id });

    if (!profile) {
      return res.status(404).json({
        error: {
          message: 'Pricing profile not found',
          status: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      data: profile,
      message: 'Pricing profile deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to delete pricing profile',
        status: 500,
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

// POST /api/v1/pricing/calculate - Calculate price for specific booking
router.post('/calculate', [
  body('van_id').optional().isMongoId().withMessage('Valid van ID required if provided'),
  body('van_type').optional().isIn(['compact', 'standard', 'premium', 'luxury', 'eco-friendly']),
  body('checkin_date').isISO8601().withMessage('Valid checkin date is required'),
  body('checkout_date').isISO8601().withMessage('Valid checkout date is required'),
  body('base_price').isFloat({ min: 0 }).withMessage('Base price must be positive'),
  body('profile_id').optional().isString().withMessage('Profile ID must be a string')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { van_id, van_type, checkin_date, checkout_date, base_price, profile_id, customer_type = 'new' } = req.body;
    
    const checkin = new Date(checkin_date);
    const checkout = new Date(checkout_date);
    
    // Validate dates
    if (checkin >= checkout) {
      return res.status(400).json({
        error: {
          message: 'Checkout date must be after checkin date',
          status: 400,
          timestamp: new Date().toISOString()
        }
      });
    }

    const totalDays = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    
    // Get van info if van_id provided
    let van = null;
    if (van_id) {
      van = await Van.findById(van_id);
      if (!van) {
        return res.status(404).json({
          error: {
            message: 'Van not found',
            status: 404,
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Find applicable pricing profiles
    let profiles = [];
    if (profile_id) {
      const specificProfile = await Pricing.findOne({ id: profile_id, is_active: true });
      if (specificProfile) profiles = [specificProfile];
    } else {
      const vanTypeToUse = van ? van.type : van_type;
      if (vanTypeToUse) {
        profiles = await Pricing.findByVanType(vanTypeToUse);
      } else {
        profiles = await Pricing.findActive();
      }
    }

    // Calculate base pricing
    let finalPricePerDay = base_price || (van ? van.base_price : 89.00);
    let appliedRules = ['base_pricing'];
    let adjustments = [];
    let totalAdjustment = 0;

    // Apply pricing profiles
    for (const profile of profiles) {
      if (profile.appliesTo(checkin_date, checkout_date)) {
        const adjustment = profile.calculateAdjustment(finalPricePerDay);
        
        // Apply weekend multipliers for date-range profiles
        if (profile.type !== 'promotional' && profile.type !== 'seasonal') {
          const weekendMultiplier = profile.weekendMultiplier || 1.0;
          if (weekendMultiplier > 1.0) {
            // Calculate weekend days
            let weekendDays = 0;
            const current = new Date(checkin);
            while (current < checkout) {
              if (current.getDay() === 0 || current.getDay() === 6) {
                weekendDays++;
              }
              current.setDate(current.getDate() + 1);
            }
            
            if (weekendDays > 0) {
              const weekendAdjustment = finalPricePerDay * (weekendMultiplier - 1.0) * weekendDays;
              totalAdjustment += weekendAdjustment;
              adjustments.push({
                type: 'weekend_surcharge',
                description: `Weekend surcharge (${weekendDays} days)`,
                amount: weekendAdjustment,
                profile: profile.name
              });
            }
          }

          // Apply weekly/monthly discounts
          if (totalDays >= 28 && profile.monthlyDiscount > 0) {
            const monthlyDiscount = finalPricePerDay * totalDays * profile.monthlyDiscount;
            totalAdjustment -= monthlyDiscount;
            adjustments.push({
              type: 'monthly_discount',
              description: 'Monthly stay discount',
              amount: -monthlyDiscount,
              profile: profile.name
            });
          } else if (totalDays >= 7 && profile.weeklyDiscount > 0) {
            const weeklyDiscount = finalPricePerDay * totalDays * profile.weeklyDiscount;
            totalAdjustment -= weeklyDiscount;
            adjustments.push({
              type: 'weekly_discount',
              description: 'Weekly stay discount',
              amount: -weeklyDiscount,
              profile: profile.name
            });
          }
        } else {
          // For seasonal/promotional profiles, apply the multiplier directly
          totalAdjustment += adjustment.adjustment * totalDays;
          adjustments.push({
            type: profile.type,
            description: profile.name,
            amount: adjustment.adjustment * totalDays,
            profile: profile.name,
            multiplier: adjustment.multiplier
          });
        }
        
        appliedRules.push(profile.name);
      }
    }

    const baseTotalPrice = finalPricePerDay * totalDays;
    const adjustedTotal = baseTotalPrice + totalAdjustment;
    const taxes = adjustedTotal * 0.08; // 8% tax
    const fees = 25.00; // Fixed booking fee
    const finalTotal = adjustedTotal + taxes + fees;

    res.json({
      data: {
        base_price_per_day: finalPricePerDay,
        total_days: totalDays,
        base_total: baseTotalPrice,
        adjustments,
        adjusted_total: adjustedTotal,
        taxes,
        fees,
        final_total: finalTotal,
        applied_rules: appliedRules,
        breakdown: {
          subtotal: adjustedTotal,
          tax_rate: 0.08,
          taxes,
          fees,
          total: finalTotal
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to calculate pricing',
        status: 500,
        details: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

module.exports = router;
