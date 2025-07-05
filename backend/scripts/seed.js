/**
 * Database Seeding Script
 * Populates the database with initial data for development and testing
 */

const mongoose = require('mongoose');
const database = require('../config/database');
const { Van, Booking, User, Pricing } = require('../models');
require('dotenv').config();

// Sample van data
const vansData = [
  {
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
        height: '8ft',
        width: '6.5ft',
        engine: 'V6',
        transmission: 'Automatic',
        fuel_type: 'Gasoline'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        caption: 'Exterior view',
        type: 'exterior',
        order: 1
      }
    ],
    pricing_profile: 'standard',
    calendar_id: 'adventure-seeker@vanlife.com',
    description: 'Perfect for couples and small groups seeking adventure.',
    enabled: true
  },
  {
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
        height: '8.5ft',
        width: '7ft',
        engine: 'V8',
        transmission: 'Automatic',
        fuel_type: 'Gasoline'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
        caption: 'Luxury interior',
        type: 'interior',
        order: 1
      }
    ],
    pricing_profile: 'premium',
    calendar_id: 'luxury-explorer@vanlife.com',
    description: 'Ultimate luxury experience for discerning travelers.',
    enabled: true
  },
  {
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
        height: '7.5ft',
        width: '6ft',
        engine: 'Electric',
        transmission: 'Automatic',
        fuel_type: 'Electric'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        caption: 'Eco-friendly design',
        type: 'exterior',
        order: 1
      }
    ],
    pricing_profile: 'premium',
    calendar_id: 'eco-wanderer@vanlife.com',
    description: 'Sustainable travel with zero emissions.',
    enabled: true
  },
  {
    name: 'Urban Nomad',
    type: 'compact',
    location: 'Seattle, WA',
    base_price: 69.00,
    capacity: 2,
    status: 'active',
    features: {
      amenities: ['Basic Kitchen', 'Fold-out Bed', 'USB Charging'],
      specifications: {
        length: '16ft',
        height: '7ft',
        width: '6ft',
        engine: '4-Cylinder',
        transmission: 'Manual',
        fuel_type: 'Gasoline'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1527786356000-7da30ac193c1?w=800',
        caption: 'Compact and efficient',
        type: 'exterior',
        order: 1
      }
    ],
    pricing_profile: 'standard',
    calendar_id: 'urban-nomad@vanlife.com',
    description: 'Perfect for city explorers and budget-conscious travelers.',
    enabled: true
  },
  {
    name: 'Family Adventure',
    type: 'luxury',
    location: 'Denver, CO',
    base_price: 199.00,
    capacity: 6,
    status: 'active',
    features: {
      amenities: ['Full Kitchen', 'Bunk Beds', 'Queen Bed', 'Bathroom', 'Shower', 'Solar Power', 'WiFi', 'Entertainment System'],
      specifications: {
        length: '28ft',
        height: '9ft',
        width: '8ft',
        engine: 'V8 Turbo',
        transmission: 'Automatic',
        fuel_type: 'Gasoline'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464822759844-d150baec3e5c?w=800',
        caption: 'Spacious family interior',
        type: 'interior',
        order: 1
      }
    ],
    pricing_profile: 'luxury',
    calendar_id: 'family-adventure@vanlife.com',
    description: 'Spacious luxury van perfect for families and large groups.',
    enabled: true
  }
];

// Sample booking data (will be created after vans are inserted)
const createBookingsData = (vans) => [
  {
    van_id: vans[0]._id,
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    customer_phone: '+1-555-0123',
    checkin_date: new Date('2025-07-15'),
    checkout_date: new Date('2025-07-20'),
    total_days: 5,
    checkin_time: '15:00',
    checkout_time: '11:00',
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
    booking_source: 'web'
  },
  {
    van_id: vans[1]._id,
    customer_name: 'Jane Smith',
    customer_email: 'jane.smith@example.com',
    customer_phone: '+1-555-0456',
    checkin_date: new Date('2025-08-01'),
    checkout_date: new Date('2025-08-07'),
    total_days: 6,
    checkin_time: '15:00',
    checkout_time: '11:00',
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
    booking_source: 'phone'
  },
  {
    van_id: vans[3]._id,
    customer_name: 'Mike Davis',
    customer_email: 'mike.davis@example.com',
    customer_phone: '+1-555-0789',
    checkin_date: new Date('2025-07-22'),
    checkout_date: new Date('2025-07-24'),
    total_days: 2,
    checkin_time: '15:00',
    checkout_time: '11:00',
    base_price: 69.00,
    total_price: 138.00,
    pricing_breakdown: {
      base_total: 138.00,
      taxes: 11.04,
      fees: 15.00,
      discounts: 0,
      final_total: 164.04
    },
    status: 'confirmed',
    payment_status: 'paid',
    special_requests: 'Parking instructions needed',
    booking_source: 'web'
  }
];

// Sample pricing profiles data
const pricingProfilesData = [
  {
    id: 'standard',
    name: 'Standard Pricing',
    description: 'Regular pricing for most vans',
    type: 'standard',
    van_types: ['standard', 'compact'],
    baseMultiplier: 1.0,
    weekendMultiplier: 1.2,
    weeklyDiscount: 0.1,
    monthlyDiscount: 0.2,
    seasonalAdjustments: true,
    minimumDays: 1,
    maximumDays: 365,
    advanceBookingDiscount: [
      { days: 30, discount: 0.05 },
      { days: 60, discount: 0.1 },
      { days: 90, discount: 0.15 }
    ],
    is_active: true,
    priority: 0
  },
  {
    id: 'premium',
    name: 'Premium Pricing',
    description: 'Higher pricing for premium vans',
    type: 'premium',
    van_types: ['premium'],
    baseMultiplier: 1.3,
    weekendMultiplier: 1.4,
    weeklyDiscount: 0.08,
    monthlyDiscount: 0.15,
    seasonalAdjustments: true,
    minimumDays: 2,
    maximumDays: 365,
    advanceBookingDiscount: [
      { days: 30, discount: 0.03 },
      { days: 60, discount: 0.07 },
      { days: 90, discount: 0.12 }
    ],
    is_active: true,
    priority: 1
  },
  {
    id: 'luxury',
    name: 'Luxury Pricing',
    description: 'Premium pricing for luxury vans',
    type: 'luxury',
    van_types: ['luxury'],
    baseMultiplier: 1.8,
    weekendMultiplier: 2.0,
    weeklyDiscount: 0.05,
    monthlyDiscount: 0.12,
    seasonalAdjustments: true,
    minimumDays: 3,
    maximumDays: 365,
    advanceBookingDiscount: [
      { days: 30, discount: 0.02 },
      { days: 60, discount: 0.05 },
      { days: 90, discount: 0.08 }
    ],
    is_active: true,
    priority: 2
  },
  {
    id: 'summer_peak',
    name: 'Summer Peak Season',
    description: 'Peak season pricing for summer months',
    type: 'seasonal',
    van_types: ['all'],
    dateRanges: [
      { start: '2025-06-15', end: '2025-08-31' }
    ],
    multiplier: 1.5,
    is_active: true,
    priority: 10
  },
  {
    id: 'holiday_special',
    name: 'Holiday Special',
    description: 'Special pricing during holidays',
    type: 'promotional',
    van_types: ['premium', 'luxury'],
    dateRanges: [
      { start: '2025-12-20', end: '2025-01-05' }
    ],
    multiplier: 0.9,
    is_active: true,
    priority: 5
  },
  {
    id: 'budget',
    name: 'Budget Pricing',
    description: 'Competitive pricing for budget-conscious customers',
    type: 'budget',
    van_types: ['compact', 'eco-friendly'],
    baseMultiplier: 0.8,
    weekendMultiplier: 1.0,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.25,
    seasonalAdjustments: false,
    minimumDays: 1,
    maximumDays: 365,
    advanceBookingDiscount: [
      { days: 30, discount: 0.08 },
      { days: 60, discount: 0.15 },
      { days: 90, discount: 0.20 }
    ],
    is_active: true,
    priority: 0
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await database.connect();
    
    // Clear existing data (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🗑️ Clearing existing data...');
      await Van.deleteMany({});
      await Booking.deleteMany({});
      await Pricing.deleteMany({});
      console.log('✅ Existing data cleared');
    }
    
    // Seed pricing profiles first
    console.log('💰 Seeding pricing profiles...');
    const pricingProfiles = await Pricing.insertMany(pricingProfilesData);
    console.log(`✅ Created ${pricingProfiles.length} pricing profiles`);
    
    // Seed vans
    console.log('🚐 Seeding vans...');
    const vans = await Van.insertMany(vansData);
    console.log(`✅ Created ${vans.length} vans`);
    
    // Seed bookings
    console.log('📅 Seeding bookings...');
    const bookingsData = createBookingsData(vans);
    const bookings = await Booking.insertMany(bookingsData);
    console.log(`✅ Created ${bookings.length} bookings`);
    
    // Create default admin user
    console.log('👤 Creating default admin user...');
    await User.createDefaultAdmin();
    console.log('✅ Default admin user created');
    
    console.log(`
🎉 Database seeding completed successfully!
================================
📊 Summary:
  • ${vans.length} vans created
  • ${bookings.length} bookings created
  • ${pricingProfiles.length} pricing profiles created
  • 1 admin user created
  
🔐 Default Admin Credentials:
  • Username: admin
  • Email: admin@vanlife.com
  • Password: admin123
  
⚠️ Please change the default admin password in production!
================================
    `);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await database.disconnect();
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
