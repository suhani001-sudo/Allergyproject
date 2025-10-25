# Food Allergy Management - Backend API

Complete Node.js/Express/MongoDB backend with JWT authentication.

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── authController.js        # Signup & Login logic
│   ├── allergyController.js     # CRUD for allergies
│   └── restaurantController.js  # Restaurant management
├── middleware/
│   └── authMiddleware.js        # JWT protection
├── models/
│   ├── User.js                  # User schema with bcrypt
│   ├── Allergy.js               # Allergy schema
│   └── Restaurant.js            # Restaurant schema
├── routes/
│   ├── authRoutes.js            # /api/auth routes
│   ├── allergyRoutes.js         # /api/allergies routes
│   └── restaurantRoutes.js      # /api/restaurants routes
├── .env                         # Environment variables (create this)
├── .env.example                 # Template
├── package.json
└── server.js                    # Main entry point
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=mongodb://localhost:27017/food_allergy_db
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas connection string.

### 4. Run the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (Public)
- **POST** `/api/auth/signup`
  - Body: `{ "name": "John", "email": "john@example.com", "password": "123456" }`
  - Response: `{ message, user, token }`

- **POST** `/api/auth/login`
  - Body: `{ "email": "john@example.com", "password": "123456" }`
  - Response: `{ message, user, token }`

### Allergies (Protected - requires JWT)
- **POST** `/api/allergies` - Create allergy
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "Peanuts", "severity": "high", "notes": "Carry EpiPen" }`

- **GET** `/api/allergies` - Get all user allergies
- **GET** `/api/allergies/:id` - Get single allergy
- **PUT** `/api/allergies/:id` - Update allergy
- **DELETE** `/api/allergies/:id` - Delete allergy

### Restaurants (Public)
- **POST** `/api/restaurants` - Add restaurant
  - Body: `{ "name": "Safe Eats", "address": "123 Main St", "safeDishes": [...] }`
- **GET** `/api/restaurants` - List all restaurants

## 🔐 Authentication Flow

1. User signs up → receives JWT token
2. Store token in frontend (localStorage/sessionStorage)
3. Include token in headers for protected routes:
   ```javascript
   headers: { Authorization: `Bearer ${token}` }
   ```

## 🔗 Connect to React Frontend

In your React app, create an API client:

```javascript
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

Usage:
```javascript
import api from './api/client';

// Signup
const signup = (data) => api.post('/api/auth/signup', data);

// Login
const login = async (data) => {
  const res = await api.post('/api/auth/login', data);
  localStorage.setItem('token', res.data.token);
  return res.data.user;
};

// Get allergies
const getAllergies = () => api.get('/api/allergies');
```

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin support
- **nodemon** - Dev auto-restart

## 📝 Notes

- Passwords are automatically hashed using bcrypt (10 salt rounds)
- JWT tokens expire in 7 days
- All allergy routes are user-scoped (users can only access their own data)
- CORS is currently open - restrict in production

## 🐛 Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running
- Check MONGO_URI in .env file

**JWT errors:**
- Verify JWT_SECRET is set in .env
- Check token format: `Bearer <token>`

**Port already in use:**
- Change PORT in .env file
- Kill process using port 5000
