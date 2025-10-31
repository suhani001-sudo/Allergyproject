// Load environment variables FIRST before any other imports
import './config/env.js';

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import allergyRoutes from './routes/allergyRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import userRoutes from './routes/userRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import restaurantMenuRoutes from './routes/restaurantMenuRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Food Allergy Management API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      allergies: '/api/allergies',
      restaurants: '/api/restaurants',
      users: '/api/users',
      menus: '/api/menus',
      restaurantMenu: '/api/restaurants/menu'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/allergies', allergyRoutes);
app.use('/api/restaurants/menu', restaurantMenuRoutes); // Must be before /api/restaurants
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menus', menuRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
});


