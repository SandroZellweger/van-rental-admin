/**
 * Test Server for Van Upload Debug
 */

const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const { Van } = require('./models');
require('dotenv').config();

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Test van creation endpoint
app.post('/api/v1/resources/vans', async (req, res) => {
    try {
        console.log('Received van creation request:', req.body);
        
        const van = new Van(req.body);
        await van.save();
        
        console.log('Van created successfully:', van);
        
        res.status(201).json({
            data: van,
            message: 'Van created successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error creating van:', error);
        res.status(400).json({
            error: {
                message: error.message,
                status: 400,
                timestamp: new Date().toISOString()
            }
        });
    }
});

// Health check
app.get('/api/v1/admin/health', (req, res) => {
    res.json({
        status: 'ok',
        database: database.isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Start server
async function startTestServer() {
    try {
        await database.connect();
        console.log('✅ Database connected');
    } catch (error) {
        console.log('⚠️ Database connection failed, continuing anyway');
    }
    
    app.listen(PORT, () => {
        console.log(`🔧 Test server running on port ${PORT}`);
        console.log(`🧪 Test van creation: http://localhost:${PORT}/api/v1/resources/vans`);
        console.log(`💚 Health check: http://localhost:${PORT}/api/v1/admin/health`);
    });
}

startTestServer();
