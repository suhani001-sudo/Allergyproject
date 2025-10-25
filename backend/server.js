import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import allergyRoutes from './routes/allergyRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database
connectDB();

app.get('/', (req, res) => {
  res.send('Food Allergy API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/allergies', allergyRoutes);
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


