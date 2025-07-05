# 🚐 VanLife Admin Backend API

Professional backend system for VanLife Admin Dashboard, inspired by the booking.bl architecture patterns.

## 🎯 Features

- **RESTful API** with comprehensive van rental management
- **Professional Architecture** inspired by enterprise booking systems
- **Modular Design** with clean separation of concerns
- **Input Validation** with express-validator
- **Error Handling** with consistent error responses
- **Rate Limiting** for API protection
- **CORS Support** for frontend integration
- **Mock Data** for immediate testing and development

## 📁 API Endpoints

### 🚐 Van Resources (`/api/v1/resources/`)
- `GET /vans` - List all vans with filtering and pagination
- `GET /vans/:id` - Get specific van details
- `POST /vans` - Create new van
- `PUT /vans/:id` - Update van information
- `PATCH /vans/:id/status` - Update van status
- `DELETE /vans/:id` - Remove van

### 📅 Bookings (`/api/v1/bookings/`)
- `GET /` - List bookings with advanced filtering
- `GET /:id` - Get specific booking details
- `POST /` - Create new booking with availability check
- `PUT /:id` - Update booking information
- `DELETE /:id` - Cancel booking
- `GET /stats` - Get booking statistics and analytics

### 💰 Pricing (`/api/v1/pricing/`)
- `GET /profiles` - List pricing profiles
- `POST /calculate` - Calculate dynamic pricing

### 🖼️ Media (`/api/v1/media/`)
- `GET /` - List media files
- `POST /upload` - Upload new media files

### 📆 Availability (`/api/v1/availability/`)
- `GET /calendar/:van_id` - Get availability calendar
- `POST /check` - Check availability for dates

### 🔍 Search (`/api/v1/search/`)
- `POST /availability` - Advanced availability search
- `GET /filters` - Get available search filters

### 🎯 Admin (`/api/v1/admin/`)
- `GET /dashboard` - Admin dashboard data
- `GET /settings` - System settings

### 📊 Analytics (`/api/v1/analytics/`)
- `GET /revenue` - Revenue analytics
- `GET /occupancy` - Occupancy analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   ```

### Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-reload
npm test        # Run test suite
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
```

## 📊 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Response Format
All API responses follow this structure:

```json
{
  "data": { /* response data */ },
  "meta": { /* pagination, etc. */ },
  "timestamp": "2025-07-05T12:00:00.000Z"
}
```

### Error Format
```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "timestamp": "2025-07-05T12:00:00.000Z",
    "details": [ /* validation errors */ ]
  }
}
```

## 🔧 Architecture Patterns (Inspired by booking.bl)

### 1. **Modular Endpoint Structure**
Each API module handles a specific domain (resources, bookings, pricing, etc.)

### 2. **Comprehensive Validation**
All inputs validated with express-validator following booking system standards

### 3. **Professional Error Handling**
Consistent error responses with proper HTTP status codes

### 4. **Advanced Filtering & Pagination**
Complex query capabilities for enterprise-level data management

### 5. **Business Logic Separation**
Clear separation between API layer and business logic (ready for service layer)

## 🔄 Integration with Frontend

The backend is designed to integrate seamlessly with the modular frontend dashboard:

```javascript
// Example frontend integration
const response = await fetch('http://localhost:3000/api/v1/resources/vans');
const { data } = await response.json();
```

## 🗄️ Data Models

### Van Model
```javascript
{
  id: 1,
  name: 'Adventure Seeker',
  type: 'standard',
  location: 'San Francisco, CA',
  base_price: 89.00,
  capacity: 2,
  status: 'active',
  features: { amenities: [], specifications: {} },
  images: [],
  availability_calendar: {},
  created_at: '2025-07-05T12:00:00Z',
  updated_at: '2025-07-05T12:00:00Z'
}
```

### Booking Model
```javascript
{
  id: 1,
  van_id: 1,
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  checkin_date: '2025-07-15',
  checkout_date: '2025-07-20',
  total_days: 5,
  total_price: 445.00,
  pricing_breakdown: { /* detailed costs */ },
  status: 'confirmed',
  payment_status: 'paid'
}
```

## 🔜 Next Steps

### Phase 1: Database Integration
- Add PostgreSQL/MySQL with Sequelize ORM
- Implement proper data persistence
- Add database migrations and seeders

### Phase 2: Authentication & Security
- JWT authentication system
- Role-based access control
- API key management

### Phase 3: Advanced Features
- Real-time availability checking
- Advanced search with Elasticsearch
- File upload with cloud storage
- Email/SMS notifications

### Phase 4: Production Deployment
- Docker containerization
- CI/CD pipeline
- Monitoring and logging
- Performance optimization

## 🤝 Contributing

1. Follow the established API patterns
2. Add proper validation for all endpoints
3. Include error handling for all operations
4. Write tests for new functionality
5. Update documentation for changes

## 📞 Support

- Check `/api` endpoint for available routes
- Use `/health` for system status
- Review error responses for debugging
- Refer to booking.bl patterns for advanced features

---

**Status:** ✅ Development Ready  
**Architecture:** Professional booking system inspired  
**Integration:** Frontend modular dashboard compatible
