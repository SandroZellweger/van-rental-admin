/**
 * Database Configuration
 * MongoDB connection setup with Mongoose
 */

const mongoose = require('mongoose');

class DatabaseConnection {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanlife_admin';
            
            console.log('🔄 Connecting to MongoDB...');
            
            const options = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            this.connection = await mongoose.connect(mongoUri, options);
            this.isConnected = true;

            console.log('✅ MongoDB connected successfully');
            console.log(`📊 Database: ${this.connection.connection.name}`);
            console.log(`🔗 Host: ${this.connection.connection.host}:${this.connection.connection.port}`);

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('⚠️ MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected');
                this.isConnected = true;
            });

            // Graceful shutdown
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });

            return this.connection;
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            this.isConnected = false;
            
            // In development, continue without database
            if (process.env.NODE_ENV === 'development') {
                console.log('⚠️ Running in development mode without database');
                return null;
            }
            
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.connection) {
                await mongoose.connection.close();
                console.log('🔌 MongoDB connection closed');
                this.isConnected = false;
            }
        } catch (error) {
            console.error('❌ Error closing MongoDB connection:', error);
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            name: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        };
    }

    async healthCheck() {
        try {
            if (!this.isConnected) {
                return { status: 'disconnected', message: 'Not connected to database' };
            }

            await mongoose.connection.db.admin().ping();
            return { 
                status: 'healthy', 
                message: 'Database connection is working',
                database: mongoose.connection.name,
                collections: await mongoose.connection.db.listCollections().toArray()
            };
        } catch (error) {
            return { 
                status: 'error', 
                message: error.message 
            };
        }
    }
}

module.exports = new DatabaseConnection();
