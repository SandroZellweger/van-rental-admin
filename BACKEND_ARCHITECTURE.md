# VanLife Admin Dashboard - Backend Architecture Plan

## 🎯 Inspired by Booking.bl Professional Architecture

Based on the examination of the `booking.bl.10.12.0b` plugin, I've identified key patterns and structures that we can adapt for a professional backend setup for our VanLife admin dashboard.

## 📁 Proposed Backend Structure

```
📦 VanLife Backend API
├── 🗂️ api/
│   ├── 📂 v1/
│   │   ├── 🚐 resources/      # Van management endpoints
│   │   ├── 📅 bookings/       # Booking management endpoints  
│   │   ├── 💰 pricing/        # Pricing management endpoints
│   │   ├── 🖼️ media/          # Media/image management endpoints
│   │   ├── 📆 availability/   # Calendar/availability endpoints
│   │   ├── 🔍 search/         # Advanced search endpoints
│   │   ├── 🎯 admin/          # Admin-specific endpoints
│   │   └── 📊 analytics/      # Analytics and reporting
│   └── 📂 middleware/
│       ├── auth.js            # Authentication middleware
│       ├── validation.js      # Input validation
│       ├── rateLimit.js       # Rate limiting
│       └── errorHandler.js    # Global error handling
├── 🗄️ database/
│   ├── 📂 models/
│   │   ├── Van.js             # Van data model
│   │   ├── Booking.js         # Booking data model
│   │   ├── PricingProfile.js  # Pricing profile model
│   │   ├── Media.js           # Media file model
│   │   ├── User.js            # User/admin model
│   │   └── Settings.js        # System settings model
│   ├── 📂 migrations/         # Database schema migrations
│   ├── 📂 seeders/           # Sample data seeders
│   └── 📂 config/            # Database configuration
├── 🔧 services/
│   ├── BookingService.js      # Business logic for bookings
│   ├── PricingService.js      # Dynamic pricing calculations
│   ├── AvailabilityService.js # Availability checking logic
│   ├── MediaService.js        # Image processing/compression
│   ├── SearchService.js       # Advanced search functionality
│   ├── NotificationService.js # Email/SMS notifications
│   └── CalendarService.js     # Calendar integration
├── 🛠️ utils/
│   ├── dateHelpers.js         # Date manipulation utilities
│   ├── priceCalculator.js     # Pricing calculation helpers
│   ├── validators.js          # Input validation functions
│   ├── imageProcessor.js      # Image compression/resizing
│   └── csvParser.js           # CSV import/export utilities
├── 📋 config/
│   ├── database.js            # Database configuration
│   ├── redis.js              # Redis caching configuration  
│   ├── email.js              # Email service configuration
│   └── environment.js        # Environment variables
└── 🧪 tests/
    ├── unit/                  # Unit tests for individual components
    ├── integration/           # Integration tests for API endpoints
    └── e2e/                   # End-to-end tests
```

## 🔧 Core Backend Components

### 1. **API Layer Structure** (Inspired by booking.bl modular design)

#### Van Management API (`/api/v1/resources/`)
```javascript
// GET    /api/v1/resources/vans           - List all vans
// GET    /api/v1/resources/vans/:id       - Get specific van
// POST   /api/v1/resources/vans           - Create new van
// PUT    /api/v1/resources/vans/:id       - Update van
// DELETE /api/v1/resources/vans/:id       - Delete van
// PATCH  /api/v1/resources/vans/:id/status - Toggle van status
```

#### Booking Management API (`/api/v1/bookings/`)
```javascript
// GET    /api/v1/bookings                 - List bookings with filters
// GET    /api/v1/bookings/:id             - Get specific booking
// POST   /api/v1/bookings                 - Create new booking
// PUT    /api/v1/bookings/:id             - Update booking
// DELETE /api/v1/bookings/:id             - Cancel booking
// GET    /api/v1/bookings/stats           - Get booking statistics
```

#### Advanced Search API (`/api/v1/search/`) - Inspired by booking.bl search engine
```javascript
// POST   /api/v1/search/availability       - Search available vans
// POST   /api/v1/search/filters           - Get available filters
// GET    /api/v1/search/suggestions       - Get search suggestions
```

### 2. **Database Models** (Following booking.bl data patterns)

#### Van Model (Resources)
```javascript
const VanSchema = {
  id: 'PRIMARY KEY',
  name: 'VARCHAR(255)',
  type: 'VARCHAR(100)', // standard, premium, luxury
  location: 'VARCHAR(255)',
  base_price: 'DECIMAL(10,2)',
  capacity: 'INT',
  status: 'ENUM(active, inactive, maintenance)',
  features: 'JSON', // amenities, specifications
  images: 'JSON', // array of image URLs
  availability_calendar: 'JSON', // availability rules
  created_at: 'TIMESTAMP',
  updated_at: 'TIMESTAMP'
}
```

#### Booking Model
```javascript
const BookingSchema = {
  id: 'PRIMARY KEY',
  van_id: 'FOREIGN KEY',
  customer_name: 'VARCHAR(255)',
  customer_email: 'VARCHAR(255)',
  customer_phone: 'VARCHAR(50)',
  checkin_date: 'DATE',
  checkout_date: 'DATE',
  checkin_time: 'TIME',
  checkout_time: 'TIME',
  total_days: 'INT',
  base_price: 'DECIMAL(10,2)',
  total_price: 'DECIMAL(10,2)',
  pricing_breakdown: 'JSON', // detailed cost calculation
  status: 'ENUM(pending, confirmed, cancelled, completed)',
  payment_status: 'ENUM(pending, paid, refunded)',
  special_requests: 'TEXT',
  booking_source: 'VARCHAR(100)', // web, phone, partner
  created_at: 'TIMESTAMP',
  updated_at: 'TIMESTAMP'
}
```

#### Pricing Profile Model (Inspired by booking.bl seasons/pricing)
```javascript
const PricingProfileSchema = {
  id: 'PRIMARY KEY',
  name: 'VARCHAR(255)',
  type: 'ENUM(seasonal, promotional, special_event)',
  van_types: 'JSON', // applicable van types
  date_ranges: 'JSON', // applicable date ranges
  pricing_rules: 'JSON', // complex pricing logic
  multiplier: 'DECIMAL(3,2)',
  fixed_adjustment: 'DECIMAL(10,2)',
  min_nights: 'INT',
  max_nights: 'INT',
  advance_booking_required: 'INT', // days
  is_active: 'BOOLEAN',
  priority: 'INT', // rule application priority
  created_at: 'TIMESTAMP',
  updated_at: 'TIMESTAMP'
}
```

### 3. **Service Layer Architecture** (Following booking.bl business logic separation)

#### Booking Service (Inspired by booking.bl booking management)
```javascript
class BookingService {
    async createBooking(bookingData) {
        // 1. Validate input data
        // 2. Check van availability
        // 3. Calculate pricing with all rules
        // 4. Reserve dates
        // 5. Send confirmation notifications
        // 6. Return booking confirmation
    }
    
    async checkAvailability(vanId, checkinDate, checkoutDate) {
        // Complex availability checking with capacity, maintenance, etc.
    }
    
    async calculatePricing(vanId, dates, guestCount) {
        // Apply all pricing rules, seasonal adjustments, discounts
    }
    
    async sendBookingNotifications(bookingId, type) {
        // Email confirmations, SMS reminders, etc.
    }
}
```

#### Advanced Search Service (Inspired by booking.bl search engine)
```javascript
class SearchService {
    async searchAvailableVans(searchParams) {
        // 1. Parse and validate search parameters
        // 2. Apply date/location/capacity filters
        // 3. Check real-time availability
        // 4. Calculate pricing for each result
        // 5. Sort and rank results
        // 6. Return formatted search results
    }
    
    async getSearchFilters(location) {
        // Return available filters for UI (locations, price ranges, features)
    }
    
    async getSearchSuggestions(query) {
        // Autocomplete suggestions for locations, van names, etc.
    }
}
```

### 4. **Advanced Features** (Inspired by booking.bl professional features)

#### Dynamic Pricing Engine
```javascript
class PricingEngine {
    calculateDynamicPrice(basePrice, dates, vanType, demandLevel) {
        // 1. Apply seasonal adjustments
        // 2. Apply demand-based pricing
        // 3. Apply promotional discounts
        // 4. Apply minimum/maximum price limits
        // 5. Return detailed pricing breakdown
    }
    
    getAvailableCoupons(bookingData) {
        // Check applicable coupon codes
    }
    
    applyPricingRules(price, rules) {
        // Apply complex pricing business logic
    }
}
```

#### Calendar Management (Inspired by booking.bl calendar system)
```javascript
class CalendarService {
    async getAvailabilityCalendar(vanId, year, month) {
        // Return detailed calendar with availability, pricing, restrictions
    }
    
    async updateVanAvailability(vanId, dates, status) {
        // Block/unblock dates, set maintenance periods
    }
    
    async syncExternalCalendars(vanId, icalUrls) {
        // Sync with external calendar services (Airbnb, etc.)
    }
}
```

## 🚀 Implementation Plan

### Phase 1: Core API Setup
1. **Set up Node.js/Express backend** with professional structure
2. **Database setup** with PostgreSQL/MySQL + Redis caching
3. **Basic CRUD operations** for vans, bookings, pricing
4. **Authentication system** with JWT tokens
5. **Input validation** and error handling middleware

### Phase 2: Advanced Features  
1. **Search engine** with complex filtering and availability checking
2. **Dynamic pricing system** with multiple rule types
3. **Calendar management** with real-time availability
4. **File upload/processing** for images with compression
5. **Notification system** for emails and SMS

### Phase 3: Integration & Testing
1. **Frontend-backend integration** with our modular dashboard
2. **Comprehensive testing suite** (unit, integration, e2e)
3. **Performance optimization** with caching and database indexing
4. **API documentation** with Swagger/OpenAPI
5. **Deployment setup** with Docker and CI/CD

### Phase 4: Production Features
1. **Advanced analytics** and reporting
2. **Multi-location support** for van fleet expansion
3. **Partner integrations** (payment gateways, external platforms)
4. **Mobile API** for companion mobile app
5. **Advanced security** features and monitoring

This backend architecture would provide a professional, scalable foundation that matches enterprise-level booking systems while being specifically tailored for van rental management.
