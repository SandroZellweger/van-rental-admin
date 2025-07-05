/**
 * Booking Model - MongoDB Schema for Booking Management
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    van_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Van',
        required: true
    },
    customer_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    customer_email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    customer_phone: {
        type: String,
        required: true,
        trim: true
    },
    checkin_date: {
        type: Date,
        required: true
    },
    checkout_date: {
        type: Date,
        required: true
    },
    checkin_time: {
        type: String,
        default: '15:00'
    },
    checkout_time: {
        type: String,
        default: '11:00'
    },
    total_days: {
        type: Number,
        required: true,
        min: 1
    },
    base_price: {
        type: Number,
        required: true,
        min: 0
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    pricing_breakdown: {
        base_total: {
            type: Number,
            required: true
        },
        taxes: {
            type: Number,
            default: 0
        },
        fees: {
            type: Number,
            default: 0
        },
        discounts: {
            type: Number,
            default: 0
        },
        final_total: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded'],
        default: 'pending'
    },
    special_requests: {
        type: String,
        maxlength: 500
    },
    booking_source: {
        type: String,
        enum: ['web', 'phone', 'email', 'walk-in', 'partner'],
        default: 'web'
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    payment_info: {
        payment_method: String,
        transaction_id: String,
        payment_date: Date,
        amount_paid: Number
    },
    cancellation: {
        cancelled_at: Date,
        cancellation_reason: String,
        refund_amount: Number,
        refund_processed: Boolean
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ van_id: 1, checkin_date: 1 });
bookingSchema.index({ customer_email: 1 });
bookingSchema.index({ status: 1, payment_status: 1 });
bookingSchema.index({ checkin_date: 1, checkout_date: 1 });
bookingSchema.index({ created_at: -1 });

// Virtual for booking duration
bookingSchema.virtual('duration_days').get(function() {
    return Math.ceil((this.checkout_date - this.checkin_date) / (1000 * 60 * 60 * 24));
});

// Virtual for booking ID display
bookingSchema.virtual('booking_id').get(function() {
    return `BK${this._id.toString().slice(-6).toUpperCase()}`;
});

// Virtual for is active booking
bookingSchema.virtual('is_active').get(function() {
    const now = new Date();
    return this.checkin_date <= now && this.checkout_date > now && this.status === 'confirmed';
});

// Virtual for is upcoming booking
bookingSchema.virtual('is_upcoming').get(function() {
    return this.checkin_date > new Date() && this.status === 'confirmed';
});

// Pre-save middleware to calculate total days
bookingSchema.pre('save', function(next) {
    if (this.checkin_date && this.checkout_date) {
        this.total_days = Math.ceil((this.checkout_date - this.checkin_date) / (1000 * 60 * 60 * 24));
    }
    next();
});

// Validation to ensure checkout is after checkin
bookingSchema.pre('save', function(next) {
    if (this.checkout_date <= this.checkin_date) {
        next(new Error('Checkout date must be after checkin date'));
    } else {
        next();
    }
});

// Methods
bookingSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    return this.save();
};

bookingSchema.methods.updatePaymentStatus = function(paymentStatus, paymentInfo = {}) {
    this.payment_status = paymentStatus;
    if (Object.keys(paymentInfo).length > 0) {
        this.payment_info = { ...this.payment_info, ...paymentInfo };
    }
    return this.save();
};

bookingSchema.methods.cancel = function(reason, refundAmount = 0) {
    this.status = 'cancelled';
    this.cancellation = {
        cancelled_at: new Date(),
        cancellation_reason: reason,
        refund_amount: refundAmount,
        refund_processed: false
    };
    return this.save();
};

// Static methods
bookingSchema.statics.findByVan = function(vanId) {
    return this.find({ van_id: vanId }).populate('van_id');
};

bookingSchema.statics.findByDateRange = function(startDate, endDate) {
    return this.find({
        $or: [
            { checkin_date: { $gte: startDate, $lte: endDate } },
            { checkout_date: { $gte: startDate, $lte: endDate } },
            { checkin_date: { $lte: startDate }, checkout_date: { $gte: endDate } }
        ]
    });
};

bookingSchema.statics.findByCustomer = function(email) {
    return this.find({ customer_email: email.toLowerCase() });
};

bookingSchema.statics.findActive = function() {
    const now = new Date();
    return this.find({
        checkin_date: { $lte: now },
        checkout_date: { $gt: now },
        status: 'confirmed'
    });
};

bookingSchema.statics.findUpcoming = function() {
    return this.find({
        checkin_date: { $gt: new Date() },
        status: 'confirmed'
    });
};

module.exports = mongoose.model('Booking', bookingSchema);
