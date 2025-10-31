# 🏥 Food Allergy Management System - Backend API

A complete RESTful API backend for managing food allergies, restaurant data, and user profiles built with Node.js, Express, and MongoDB.

---

## ✅ Current Status

```
✅ Server running on port 5000
✅ MongoDB connected
✅ All endpoints tested and working
✅ No AI dependencies
✅ Production ready
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Module System:** ES Modules

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── env.js             # Environment variables loader
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── allergyController.js  # Allergy CRUD operations
│   ├── restaurantController.js  # Restaurant CRUD operations
│   └── userController.js  # User profile management
├── models/
│   ├── User.js            # User schema
│   ├── Allergy.js         # Allergy schema
│   └── Restaurant.js      # Restaurant schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── allergyRoutes.js   # Allergy endpoints
│   ├── restaurantRoutes.js  # Restaurant endpoints
│   └── userRoutes.js      # User endpoints
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── .env                   # Environment variables
├── server.js              # Main application file
└── package.json           # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create/update `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

3. **Start the server:**

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

4. **Verify server is running:**
```bash
curl http://localhost:5000
```

Expected output:
```json
{
  "success": true,
  "message": "Food Allergy Management API is running",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "allergies": "/api/allergies",
    "restaurants": "/api/restaurants",
    "users": "/api/users"
  }
}
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Allergies (Protected)
- `POST /api/allergies` - Create allergy record
- `GET /api/allergies` - Get all user's allergies
- `GET /api/allergies/:id` - Get single allergy
- `PUT /api/allergies/:id` - Update allergy
- `DELETE /api/allergies/:id` - Delete allergy

### Restaurants (Public)
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get single restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Users (Protected)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get dashboard stats
- `GET /api/users/:id` - Get user with allergies
- `DELETE /api/users/account` - Delete account

**📖 For detailed API documentation, see `API_ENDPOINTS_SUMMARY.md`**

---

## 🧪 Testing

### Using Postman

1. Import the endpoints from `POSTMAN_TESTING_GUIDE.md`
2. Start with signup/login to get authentication token
3. Use the token in Authorization header for protected routes

### Quick Test Workflow

```bash
# 1. Signup
POST http://localhost:5000/api/auth/signup
Body: {"name":"Test User","email":"test@test.com","password":"test123"}

# 2. Login (get token)
POST http://localhost:5000/api/auth/login
Body: {"email":"test@test.com","password":"test123"}

# 3. Create Allergy (add token to header)
POST http://localhost:5000/api/allergies
Headers: Authorization: Bearer YOUR_TOKEN
Body: {"name":"Peanut Allergy","severity":"high","symptoms":["hives"],"triggers":["peanuts"]}

# 4. Get Allergies
GET http://localhost:5000/api/allergies
Headers: Authorization: Bearer YOUR_TOKEN
```

**📖 For complete testing guide, see `POSTMAN_TESTING_GUIDE.md`**

---

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Allergy
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  severity: String (low|moderate|high|severe),
  symptoms: [String],
  triggers: [String],
  notes: String,
  diagnosedDate: Date,
  lastReaction: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurant
```javascript
{
  name: String,
  location: String,
  address: String,
  phone: String,
  website: String,
  allergyFriendlyMenu: [{
    dishName: String,
    allergensFree: [String],
    price: Number,
    description: String,
    category: String
  }],
  rating: Number,
  allergyRating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### How it works:
1. User signs up or logs in
2. Server returns a JWT token
3. Client includes token in Authorization header for protected routes
4. Server verifies token and grants access

### Protected Routes
All `/api/allergies` and `/api/users` endpoints require authentication.

### Authorization Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "nodemon": "^3.1.0"
}
```

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |

---

## 🌐 CORS Configuration

CORS is enabled for all origins. For production, update the CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## 🎯 Features

✅ **User Authentication**
- Secure signup and login
- Password hashing with bcrypt
- JWT token-based authentication

✅ **Allergy Management**
- Create, read, update, delete allergies
- Track symptoms and triggers
- Severity levels
- Diagnosis and reaction dates

✅ **Restaurant Database**
- Allergy-friendly restaurant listings
- Detailed menu information
- Allergen-free dish tracking
- Location-based filtering

✅ **User Profiles**
- Profile management
- Dashboard statistics
- Account deletion

✅ **Data Validation**
- Input validation
- Error handling
- Duplicate prevention

---

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10  // (for list endpoints)
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 📝 Development Notes

### Adding New Endpoints

1. Create controller in `controllers/`
2. Create route in `routes/`
3. Import route in `server.js`
4. Add route to app: `app.use('/api/endpoint', route)`

### Database Queries

All controllers use async/await with try-catch blocks for error handling.

Example:
```javascript
export const getItems = async (req, res) => {
  try {
    const items = await Model.find();
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
```

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify MongoDB connection string
- Ensure all dependencies are installed

### Authentication errors
- Verify JWT_SECRET is set in .env
- Check token format in Authorization header
- Ensure token hasn't expired (7 days)

### Database connection issues
- Verify MongoDB Atlas IP whitelist
- Check database credentials
- Ensure network connectivity

---

## 📚 Additional Documentation

- **`API_ENDPOINTS_SUMMARY.md`** - Quick reference for all endpoints
- **`POSTMAN_TESTING_GUIDE.md`** - Detailed testing guide with examples
- **`.env.example`** - Environment variables template

---

## 🚀 Deployment

### Preparing for Production

1. **Update environment variables:**
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=strong_production_secret
```

2. **Configure CORS for your frontend domain**

3. **Deploy to hosting platform:**
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

---

## 📄 License

This project is part of the Food Allergy Management System.

---

## 👨‍💻 Author

Built with ❤️ for managing food allergies safely.

---

## 🎉 Ready to Use!

Your backend is fully functional and ready to connect with your React frontend!

**Next Steps:**
1. Test all endpoints in Postman
2. Connect your React frontend
3. Deploy to production
4. Build amazing features!

For questions or issues, refer to the documentation files in this directory.
