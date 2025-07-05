/**
 * Pricing Profile Model
 * Manages dynamic pricing profiles and seasonal adjustments
 */

const mongoose = require('mongoose');

const dateRangeSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  end: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  }
});

const advanceBookingDiscountSchema = new mongoose.Schema({
  days: {
    type: Number,
    required: true,
    min: 1
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
}, { _id: false });

const pricingProfileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['standard', 'premium', 'luxury', 'budget', 'seasonal', 'promotional'],
    default: 'standard'
  },
  van_types: [{
    type: String,
    enum: ['compact', 'standard', 'premium', 'luxury', 'eco-friendly', 'all'],
    default: 'all'
  }],
  baseMultiplier: {
    type: Number,
    required: true,
    min: 0.1,
    max: 10,
    default: 1.0
  },
  weekendMultiplier: {
    type: Number,
    required: true,
    min: 0.1,
    max: 10,
    default: 1.0
  },
  weeklyDiscount: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  monthlyDiscount: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  seasonalAdjustments: {
    type: Boolean,
    default: true
  },
  minimumDays: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  maximumDays: {
    type: Number,
    required: true,
    min: 1,
    default: 365
  },
  advanceBookingDiscount: [advanceBookingDiscountSchema],
  dateRanges: [dateRangeSchema],
  multiplier: {
    type: Number,
    min: 0.1,
    max: 10,
    default: 1.0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  locations: [{
    type: String,
    trim: true
  }],
  excludeDates: [dateRangeSchema],
  conditions: {
    minBookingValue: {
      type: Number,
      min: 0
    },
    maxBookingValue: {
      type: Number,
      min: 0
    },
    customerType: {
      type: String,
      enum: ['new', 'returning', 'vip', 'all'],
      default: 'all'
    }
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toJSON: {
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
pricingProfileSchema.index({ type: 1, is_active: 1 });
pricingProfileSchema.index({ priority: -1 });
pricingProfileSchema.index({ van_types: 1 });
pricingProfileSchema.index({ 'dateRanges.start': 1, 'dateRanges.end': 1 });

// Static method to find active profiles
pricingProfileSchema.statics.findActive = function() {
  return this.find({ is_active: true }).sort({ priority: -1 });
};

// Static method to find profiles by van type
pricingProfileSchema.statics.findByVanType = function(vanType) {
  return this.find({
    $and: [
      { is_active: true },
      {
        $or: [
          { van_types: vanType },
          { van_types: 'all' }
        ]
      }
    ]
  }).sort({ priority: -1 });
};

// Instance method to check if profile applies to a date range
pricingProfileSchema.methods.appliesTo = function(startDate, endDate) {
  if (this.dateRanges.length === 0) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return this.dateRanges.some(range => {
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);
    
    // Check if the booking period overlaps with the pricing range
    return start <= rangeEnd && end >= rangeStart;
  });
};

// Instance method to calculate price adjustment
pricingProfileSchema.methods.calculateAdjustment = function(basePrice, bookingData = {}) {
  let adjustedPrice = basePrice * this.baseMultiplier;
  
  if (this.type === 'promotional' || this.type === 'seasonal') {
    adjustedPrice = basePrice * this.multiplier;
  }
  
  return {
    originalPrice: basePrice,
    adjustedPrice,
    adjustment: adjustedPrice - basePrice,
    multiplier: this.type === 'promotional' || this.type === 'seasonal' ? this.multiplier : this.baseMultiplier,
    profile: this.name
  };
};

// Pre-save middleware
pricingProfileSchema.pre('save', function(next) {
  // Ensure advance booking discounts are sorted by days
  if (this.advanceBookingDiscount) {
    this.advanceBookingDiscount.sort((a, b) => a.days - b.days);
  }
  
  // Validate date ranges
  if (this.dateRanges) {
    for (const range of this.dateRanges) {
      if (new Date(range.start) >= new Date(range.end)) {
        const error = new Error('Start date must be before end date');
        return next(error);
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('PricingProfile', pricingProfileSchema);
