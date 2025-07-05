/**
 * Simple Van Upload Test Server
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3005;

// CORS
app.use(cors());
app.use(express.json());

// Mock van storage
let mockVans = [
  { id: 1, name: 'Test Van', type: 'standard', location: 'Test Location', base_price: 100, capacity: 2, status: 'active' }
];

// Health check
app.get('/api/v1/admin/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple test server running' });
});

// Get vans
app.get('/api/v1/resources/vans', (req, res) => {
  res.json({ data: mockVans, message: 'Vans retrieved successfully' });
});

// Create van
app.post('/api/v1/resources/vans', (req, res) => {
  console.log('🚐 Creating van:', req.body);
  
  const newVan = {
    id: Date.now(),
    ...req.body,
    status: 'active'
  };
  
  mockVans.push(newVan);
  
  res.status(201).json({
    data: newVan,
    message: 'Van created successfully'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`🧪 Test at: http://localhost:${PORT}/api/v1/admin/health`);
});
