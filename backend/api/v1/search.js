/**
 * Advanced Search API Endpoints
 * Search engine inspired by booking.bl search functionality
 */

const express = require('express');
const router = express.Router();

// POST /api/v1/search/availability - Advanced availability search
router.post('/availability', (req, res) => {
  const { 
    checkin_date, 
    checkout_date, 
    location, 
    van_type, 
    min_price, 
    max_price, 
    capacity,
    amenities 
  } = req.body;
  
  // Mock search results
  const searchResults = [
    {
      van_id: 1,
      name: 'Adventure Seeker',
      type: 'standard',
      location: 'San Francisco, CA',
      capacity: 2,
      price_per_night: 89.00,
      total_price: 445.00,
      availability_score: 0.95,
      distance_from_search: 0,
      images: ['https://example.com/van1-exterior.jpg'],
      amenities: ['Kitchen', 'Bed', 'Solar Power']
    },
    {
      van_id: 2,
      name: 'Luxury Explorer',
      type: 'premium',
      location: 'Los Angeles, CA',
      capacity: 4,
      price_per_night: 149.00,
      total_price: 745.00,
      availability_score: 0.90,
      distance_from_search: 380,
      images: ['https://example.com/van2-exterior.jpg'],
      amenities: ['Full Kitchen', 'Queen Bed', 'Solar Power', 'Bathroom', 'AC/Heat', 'WiFi']
    }
  ];
  
  res.json({
    data: {
      results: searchResults,
      search_params: req.body,
      total_results: searchResults.length,
      search_id: Date.now().toString()
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/search/filters - Get available search filters
router.get('/filters', (req, res) => {
  res.json({
    data: {
      locations: [
        'San Francisco, CA',
        'Los Angeles, CA',
        'Portland, OR',
        'Seattle, WA',
        'Denver, CO'
      ],
      van_types: [
        'standard',
        'premium',
        'luxury',
        'eco-friendly'
      ],
      amenities: [
        'Kitchen',
        'Bathroom',
        'Solar Power',
        'AC/Heat',
        'WiFi',
        'Pet Friendly'
      ],
      price_ranges: [
        { min: 0, max: 100, label: 'Under $100' },
        { min: 100, max: 150, label: '$100 - $150' },
        { min: 150, max: 200, label: '$150 - $200' },
        { min: 200, max: 999, label: 'Over $200' }
      ]
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
