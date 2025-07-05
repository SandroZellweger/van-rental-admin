/**
 * User Model - MongoDB Schema for Authentication and User Management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'staff'],
        default: 'staff'
    },
    profile: {
        first_name: {
            type: String,
            trim: true,
            maxlength: 50
        },
        last_name: {
            type: String,
            trim: true,
            maxlength: 50
        },
        phone: {
            type: String,
            trim: true
        },
        avatar: String
    },
    permissions: [{
        type: String,
        enum: [
            'vans.read', 'vans.write', 'vans.delete',
            'bookings.read', 'bookings.write', 'bookings.delete',
            'pricing.read', 'pricing.write',
            'media.read', 'media.write', 'media.delete',
            'analytics.read',
            'admin.read', 'admin.write'
        ]
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    last_login: Date,
    login_attempts: {
        type: Number,
        default: 0
    },
    account_locked: {
        type: Boolean,
        default: false
    },
    locked_until: Date,
    password_reset: {
        token: String,
        expires: Date
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.password_reset;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Additional Indexes (email and username already have unique indexes)
userSchema.index({ role: 1 });

// Virtuals
userSchema.virtual('full_name').get(function() {
    if (this.profile.first_name && this.profile.last_name) {
        return `${this.profile.first_name} ${this.profile.last_name}`;
    }
    return this.username;
});

userSchema.virtual('is_locked').get(function() {
    return this.account_locked && this.locked_until > Date.now();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasPermission = function(permission) {
    if (this.role === 'admin') return true;
    return this.permissions.includes(permission);
};

userSchema.methods.lockAccount = function() {
    this.account_locked = true;
    this.locked_until = Date.now() + (30 * 60 * 1000); // Lock for 30 minutes
    return this.save();
};

userSchema.methods.unlockAccount = function() {
    this.account_locked = false;
    this.locked_until = undefined;
    this.login_attempts = 0;
    return this.save();
};

userSchema.methods.recordLoginAttempt = function() {
    this.login_attempts += 1;
    
    // Lock account after 5 failed attempts
    if (this.login_attempts >= 5) {
        return this.lockAccount();
    }
    
    return this.save();
};

userSchema.methods.recordSuccessfulLogin = function() {
    this.last_login = new Date();
    this.login_attempts = 0;
    this.account_locked = false;
    this.locked_until = undefined;
    return this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUsername = function(username) {
    return this.findOne({ username: username });
};

userSchema.statics.findByRole = function(role) {
    return this.find({ role: role, is_active: true });
};

userSchema.statics.createDefaultAdmin = async function() {
    const adminExists = await this.findOne({ role: 'admin' });
    if (adminExists) return adminExists;

    const defaultAdmin = new this({
        username: 'admin',
        email: 'admin@vanlife.com',
        password: 'admin123',
        role: 'admin',
        profile: {
            first_name: 'Admin',
            last_name: 'User'
        },
        permissions: [
            'vans.read', 'vans.write', 'vans.delete',
            'bookings.read', 'bookings.write', 'bookings.delete',
            'pricing.read', 'pricing.write',
            'media.read', 'media.write', 'media.delete',
            'analytics.read',
            'admin.read', 'admin.write'
        ]
    });

    await defaultAdmin.save();
    console.log('✅ Default admin user created');
    return defaultAdmin;
};

module.exports = mongoose.model('User', userSchema);
