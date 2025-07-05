/**
 * Van Model - MongoDB Schema for Van Resources
 */

const mongoose = require('mongoose');

const vanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    type: {
        type: String,
        required: true,
        enum: ['compact', 'standard', 'premium', 'luxury', 'eco-friendly'],
        lowercase: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    base_price: {
        type: Number,
        required: true,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'maintenance', 'rented'],
        default: 'active'
    },
    features: {
        amenities: [{
            type: String,
            trim: true
        }],
        specifications: {
            length: String,
            height: String,
            width: String,
            engine: String,
            transmission: String,
            fuel_type: String,
            weight: String
        }
    },
    images: [{
        url: String,
        caption: String,
        type: {
            type: String,
            enum: ['exterior', 'interior', 'feature'],
            default: 'exterior'
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    availability_calendar: {
        type: Map,
        of: {
            status: {
                type: String,
                enum: ['available', 'booked', 'blocked', 'maintenance'],
                default: 'available'
            },
            price_override: Number,
            notes: String
        }
    },
    pricing_profile: {
        type: String,
        enum: ['standard', 'premium', 'luxury'],
        default: 'standard'
    },
    calendar_id: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        maxlength: 1000
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
vanSchema.index({ type: 1, status: 1 });
vanSchema.index({ location: 1 });
vanSchema.index({ base_price: 1 });
vanSchema.index({ enabled: 1, status: 1 });

// Virtual for full name with type
vanSchema.virtual('display_name').get(function() {
    return `${this.name} (${this.type.charAt(0).toUpperCase() + this.type.slice(1)})`;
});

// Virtual for availability status
vanSchema.virtual('is_available').get(function() {
    return this.status === 'active' && this.enabled;
});

// Methods
vanSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    return this.save();
};

vanSchema.methods.setAvailability = function(date, availabilityData) {
    this.availability_calendar.set(date, availabilityData);
    return this.save();
};

vanSchema.methods.getAvailability = function(date) {
    return this.availability_calendar.get(date) || { status: 'available' };
};

// Static methods
vanSchema.statics.findAvailable = function() {
    return this.find({ status: 'active', enabled: true });
};

vanSchema.statics.findByType = function(type) {
    return this.find({ type: type.toLowerCase() });
};

vanSchema.statics.findInPriceRange = function(minPrice, maxPrice) {
    return this.find({ 
        base_price: { $gte: minPrice, $lte: maxPrice } 
    });
};

module.exports = mongoose.model('Van', vanSchema);
