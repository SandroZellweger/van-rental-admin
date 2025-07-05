/**
 * Media Management API Endpoints
 * Image upload and processing inspired by booking.bl media handling
 */

const express = require('express');
const router = express.Router();

// Mock media storage
let mediaItems = [
  {
    id: 1,
    filename: 'van1-exterior.jpg',
    original_name: 'adventure-seeker-front.jpg',
    url: '/uploads/van1-exterior.jpg',
    van_id: 1,
    type: 'image',
    size: 245760,
    mime_type: 'image/jpeg',
    created_at: new Date('2025-07-01')
  }
];

// GET /api/v1/media - List media files
router.get('/', (req, res) => {
  res.json({
    data: mediaItems,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/media/upload - Upload new media file
router.post('/upload', (req, res) => {
  // This would handle actual file upload in real implementation
  res.json({
    message: 'Media upload endpoint - implementation pending',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
