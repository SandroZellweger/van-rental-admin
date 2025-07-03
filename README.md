# Van Rental Admin Dashboard

A comprehensive, modern admin dashboard for managing van rental operations with Google Sheets integration, real-time booking calendar, and CSV data import capabilities.

## 🚀 Features

### ✅ Core Admin Features
- **Fleet Management**: Complete van inventory management with technical specifications
- **Booking Calendar**: Interactive calendar with 7-day availability preview
- **Pricing Profiles**: Flexible pricing management with seasonal adjustments
- **Data Import**: CSV import functionality for real Swiss van data
- **Google Sheets Integration**: 3-step manual import process with guided setup
- **Real-time Dashboard**: Live updates and notifications system

### 🎨 Modern UI/UX
- **Brand Colors**: Professional #85b545 green theme with white/black accents
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA labels, screen reader support, keyboard navigation
- **Visual Feedback**: Toast notifications, modal dialogs, loading states
- **CSS-based Placeholders**: No external image dependencies

### � Data Management
- **Van Fleet Database**: Complete technical specifications and availability
- **Pricing Configuration**: Multi-tier pricing with seasonal adjustments
- **Booking Management**: Calendar-based booking system with availability tracking
- **Import/Export**: CSV data handling with validation and error reporting
- **Real Data Integration**: Support for authentic Swiss van rental data

### � Technical Features
- **Google Sheets API**: Integration for external data synchronization
- **Local Storage**: Client-side data persistence
- **Error Handling**: Comprehensive validation and user feedback
- **Modular Architecture**: Clean separation of concerns
- **Performance Optimized**: Efficient rendering and data handling

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS with Flexbox/Grid, Custom Properties
- **Data**: Local Storage, CSV Processing, Google Sheets API
- **Icons**: Font Awesome 6.0+
- **Responsive**: Mobile-first design principles

## 📁 Project Structure

```
van-rental-admin/
├── admin.html                 # Main admin dashboard interface
├── admin-styles.css          # Complete styling and responsive design
├── admin-script.js           # Core admin functionality
├── real-van-data.js          # Real Swiss van data integration
├── vehicle-data-mapper.js    # Data mapping utilities
├── google-sheets-setup.md    # Google Sheets integration guide
├── complete-setup-guide.md   # Comprehensive setup instructions
├── real-data-test.html       # Data testing interface
├── test-mapper.html          # Data mapping tester
├── sample-van-data.csv       # Sample van data for testing
├── sample-pricing-data.csv   # Sample pricing configurations
├── test-import-data.csv      # Test data for import validation
├── images/                   # Media assets directory
├── .vscode/                  # VS Code configuration
├── README.md                 # This file
└── .gitignore               # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Basic understanding of HTML/CSS/JavaScript

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/van-rental-admin.git
   cd van-rental-admin
   ```

2. Open `admin.html` in your browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

3. Navigate to `http://localhost:8000/admin.html`

### Configuration
1. **Google Sheets Integration**: Follow the guide in `google-sheets-setup.md`
2. **Data Import**: Use the CSV import feature with `sample-van-data.csv`
3. **Customization**: Modify colors and branding in `admin-styles.css`

## 📊 Data Management

### CSV Import Format
The system supports importing van data with the following structure:
- Vehicle specifications (make, model, year, etc.)
- Pricing information
- Availability calendars
- Technical details and features

### Google Sheets Integration
Three-step process for synchronizing data:
1. **Authentication**: Connect to Google Sheets API
2. **Data Mapping**: Map spreadsheet columns to van properties
3. **Import/Sync**: Transfer data with validation

## 🎯 Planned Features

### 🔄 Coming Soon
- [ ] **Media File Manager**: Upload and manage van images
- [ ] **Image Assignment System**: Associate photos with specific vans
- [ ] **Real Data Storage**: Production-ready data persistence
- [ ] **User Authentication**: Admin login and role management
- [ ] **Advanced Reporting**: Analytics and business intelligence
- [ ] **Mobile App**: Native mobile admin interface

### 🔧 Technical Improvements
- [ ] **API Integration**: RESTful API for data management
- [ ] **Database Backend**: PostgreSQL or MongoDB integration
- [ ] **Cloud Storage**: AWS S3 or Google Cloud for media files
- [ ] **Real-time Updates**: WebSocket integration for live data
- [ ] **Testing Suite**: Unit and integration tests
- [ ] **CI/CD Pipeline**: Automated deployment and testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Swiss van rental industry data providers
- Google Sheets API documentation
- Modern web development best practices
- Accessibility guidelines and standards

---

**Status**: Active Development | **Version**: 1.0.0 | **Last Updated**: July 2025
├── script.js           # JavaScript functionality
├── images/             # Image assets directory
│   ├── hero-van.jpg    # Hero section images
│   ├── *-van-exterior.jpg  # Van exterior images
│   ├── *-van-interior.jpg  # Van interior images
│   └── *-van-360.jpg   # 360-degree view images
└── README.md           # This file
```

## Setup Instructions

1. **Add Images**: Place van images in the `images/` directory:
   - `hero-van.jpg`, `hero-van-2.jpg`, `hero-van-3.jpg`
   - `compact-van-exterior.jpg`, `compact-van-interior.jpg`, `compact-van-360.jpg`
   - `standard-van-exterior.jpg`, `standard-van-interior.jpg`, `standard-van-360.jpg`
   - `luxury-van-exterior.jpg`, `luxury-van-interior.jpg`, `luxury-van-360.jpg`
   - `family-van-exterior.jpg`, `family-van-interior.jpg`, `family-van-360.jpg`

2. **Stripe Setup**: Replace the test key in `script.js`:
   ```javascript
   const stripe = Stripe('pk_test_your_actual_stripe_publishable_key_here');
   ```

3. **Open Website**: Open `index.html` in a web browser to view the site.

## Future Development Plans

### 🔐 Admin Panel
- [ ] Admin login system
- [ ] Dashboard for booking management
- [ ] Van inventory management
- [ ] Customer database
- [ ] Revenue analytics

### 📅 WordPress Booking Calendar Integration
- [ ] Install WordPress booking calendar plugin
- [ ] API integration for availability checking
- [ ] Real-time calendar synchronization
- [ ] Booking conflict prevention
- [ ] Multi-location calendar support

### 📊 Booking Management
- [ ] Booking tracking system
- [ ] Customer booking history
- [ ] Email confirmations
- [ ] SMS notifications
- [ ] Booking modification/cancellation

### 🎫 Request Features
- [ ] Special request forms
- [ ] Add-on services (GPS, insurance, etc.)
- [ ] Custom pickup/drop-off locations
- [ ] Extended rental periods
- [ ] Group booking discounts

### 💬 Live Chat
- [ ] Real-time customer support
- [ ] Chat widget integration
- [ ] FAQ chatbot
- [ ] Multi-language support
- [ ] Offline message handling

### 💳 Enhanced Payment Features
- [ ] Multiple payment methods
- [ ] Subscription-based rentals
- [ ] Security deposit handling
- [ ] Refund processing
- [ ] Invoice generation

### 🔧 Technical Enhancements
- [ ] Backend API development
- [ ] Database integration
- [ ] User authentication
- [ ] SSL certificate installation
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics integration

## WordPress Integration Plan

### Booking Calendar Plugin Options
1. **WP Booking Calendar** - Popular choice with good API
2. **Booking Ultra Pro** - Advanced features and customization
3. **WooCommerce Bookings** - E-commerce integration
4. **Bookly** - Professional booking system

### Integration Steps
1. Install chosen WordPress booking plugin
2. Set up van inventory in WordPress
3. Configure availability calendars
4. Create API endpoints for calendar data
5. Integrate frontend booking form with WordPress backend
6. Sync booking confirmations and customer data

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Lazy loading images
- Optimized CSS and JavaScript
- Smooth animations and transitions
- Mobile-first responsive design
- Compressed assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

## License

© 2025 VanLife Rentals. All rights reserved.

## Contact

For development questions or feature requests, please contact the development team.

---

**Note**: This is the frontend foundation. Backend integration with WordPress booking calendar plugin and Stripe payments will be implemented in the next development phase.
