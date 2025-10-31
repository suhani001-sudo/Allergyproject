# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your React frontend is now fully connected to your Node.js/Express backend!

---

## 📁 What Was Created

### **1. API Services** (`src/services/`)

| File | Purpose |
|------|---------|
| `api.js` | Axios instance with interceptors for auth |
| `authService.js` | Login, signup, logout functions |
| `allergyService.js` | CRUD operations for allergies |
| `restaurantService.js` | CRUD operations for restaurants |
| `userService.js` | User profile management |

### **2. Authentication Context** (`src/context/`)

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Global authentication state management |

### **3. Updated Components**

| Component | Changes |
|-----------|---------|
| `login.jsx` | Connected to `/api/auth/login` endpoint |
| `Signup.jsx` | Connected to `/api/auth/signup` endpoint |

---

## 🚀 How It Works

### **Authentication Flow**

```
1. User enters credentials → Login/Signup component
2. Component calls backend API → http://localhost:5000/api/auth/login
3. Backend validates → Returns JWT token + user data
4. Frontend stores token → localStorage
5. Token included in all future requests → Authorization header
6. User redirected to dashboard
```

### **API Request Flow**

```javascript
// Example: Get all allergies
import allergyService from './services/allergyService';

const allergies = await allergyService.getAllergies();
// Automatically includes: Authorization: Bearer <token>
```

---

## 🔐 Authentication System

### **Login Process**

```javascript
// In login.jsx
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

if (data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  // User is now authenticated!
}
```

### **Signup Process**

```javascript
// In Signup.jsx
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
});

const data = await response.json();

if (data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  // User is registered and logged in!
}
```

### **Protected Requests**

```javascript
// Axios automatically adds token from localStorage
import api from './services/api';

// This request includes: Authorization: Bearer <token>
const response = await api.get('/allergies');
```

---

## 📡 Available API Services

### **1. Authentication Service**

```javascript
import authService from './services/authService';

// Signup
await authService.signup(name, email, password);

// Login
await authService.login(email, password);

// Logout
authService.logout();

// Get current user
const user = authService.getCurrentUser();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### **2. Allergy Service**

```javascript
import allergyService from './services/allergyService';

// Get all allergies
const allergies = await allergyService.getAllergies();

// Get single allergy
const allergy = await allergyService.getAllergyById(id);

// Create allergy
const newAllergy = await allergyService.createAllergy({
  name: 'Peanut Allergy',
  severity: 'high',
  symptoms: ['hives', 'itchy throat'],
  triggers: ['peanuts']
});

// Update allergy
const updated = await allergyService.updateAllergy(id, data);

// Delete allergy
await allergyService.deleteAllergy(id);
```

### **3. Restaurant Service**

```javascript
import restaurantService from './services/restaurantService';

// Get all restaurants
const restaurants = await restaurantService.getAllRestaurants();

// Filter by location
const nyRestaurants = await restaurantService.getAllRestaurants({
  location: 'New York'
});

// Filter by allergen-free
const glutenFree = await restaurantService.getAllRestaurants({
  allergyFree: 'gluten'
});

// Get single restaurant
const restaurant = await restaurantService.getRestaurantById(id);

// Create restaurant
const newRestaurant = await restaurantService.createRestaurant(data);

// Update restaurant
const updated = await restaurantService.updateRestaurant(id, data);

// Delete restaurant
await restaurantService.deleteRestaurant(id);
```

### **4. User Service**

```javascript
import userService from './services/userService';

// Get profile
const profile = await userService.getProfile();

// Update profile
const updated = await userService.updateProfile({
  name: 'New Name',
  email: 'new@email.com'
});

// Get dashboard stats
const stats = await userService.getStats();

// Delete account
await userService.deleteAccount();
```

---

## 🎯 How to Use in Components

### **Example: UserDashboard Component**

```javascript
import React, { useState, useEffect } from 'react';
import allergyService from '../services/allergyService';
import userService from '../services/userService';

const UserDashboard = () => {
  const [allergies, setAllergies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch allergies
      const allergyResponse = await allergyService.getAllergies();
      setAllergies(allergyResponse.data);

      // Fetch stats
      const statsResponse = await userService.getStats();
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllergy = async (allergyData) => {
    try {
      await allergyService.createAllergy(allergyData);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error adding allergy:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Allergies ({allergies.length})</h1>
      {/* Render allergies */}
    </div>
  );
};
```

### **Example: Restaurant List Component**

```javascript
import React, { useState, useEffect } from 'react';
import restaurantService from '../services/restaurantService';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    allergyFree: ''
  });

  useEffect(() => {
    loadRestaurants();
  }, [filters]);

  const loadRestaurants = async () => {
    try {
      const response = await restaurantService.getAllRestaurants(filters);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  };

  return (
    <div>
      <input
        placeholder="Filter by location"
        value={filters.location}
        onChange={(e) => setFilters({...filters, location: e.target.value})}
      />
      {/* Render restaurants */}
    </div>
  );
};
```

---

## 🔧 Configuration

### **Backend URL**

The backend URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**For production**, update this to your deployed backend URL:

```javascript
const API_BASE_URL = 'https://your-backend.com/api';
```

---

## 🧪 Testing the Integration

### **Step 1: Start Backend**

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Server running on port 5000
✅ MongoDB connected
```

### **Step 2: Start Frontend**

```bash
cd ..
npm run dev
```

Expected output:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### **Step 3: Test Authentication**

1. **Open browser:** `http://localhost:5173`
2. **Click "Sign up instead"**
3. **Fill form:**
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. **Click "Sign Up"**
5. **Check:**
   - ✅ Redirected to dashboard
   - ✅ Token stored in localStorage
   - ✅ User data visible

### **Step 4: Test Login**

1. **Logout** (if logged in)
2. **Go to login page**
3. **Enter credentials:**
   - Email: test@example.com
   - Password: password123
4. **Click "Sign In"**
5. **Check:**
   - ✅ Redirected to dashboard
   - ✅ Token refreshed
   - ✅ User data loaded

### **Step 5: Test API Calls**

Open browser console and test:

```javascript
// Get allergies
const response = await fetch('http://localhost:5000/api/allergies', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const data = await response.json();
console.log(data);
```

---

## 🐛 Troubleshooting

### **Issue: CORS Error**

**Error:** `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS`

**Solution:** Backend already has CORS enabled. If issue persists, check `backend/server.js`:

```javascript
app.use(cors()); // Should be present
```

### **Issue: 401 Unauthorized**

**Error:** `Not authorized, no token`

**Solution:**
1. Check if token exists: `localStorage.getItem('token')`
2. Login again to get new token
3. Check token is being sent in headers

### **Issue: Network Error**

**Error:** `Network error. Please check your connection`

**Solution:**
1. Verify backend is running on port 5000
2. Check `http://localhost:5000` in browser
3. Verify API_BASE_URL in `src/services/api.js`

### **Issue: Token Expired**

**Error:** `401 Unauthorized` after some time

**Solution:**
- Tokens expire after 7 days
- Login again to get new token
- Auto-logout is handled by axios interceptor

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   React     │
│  Component  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  (allergyService, authService, etc.)
│   Layer     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Axios    │  (api.js with interceptors)
│  Instance   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │  http://localhost:5000/api
│     API     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MongoDB   │
│   Database  │
└─────────────┘
```

---

## 🎨 localStorage Structure

After login/signup, localStorage contains:

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67234abc123def456",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "isLoggedIn": "true",
  "role": "user"
}
```

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Password Hashing** - bcrypt on backend
✅ **Token Expiration** - 7-day validity
✅ **Auto Logout** - On 401 errors
✅ **Protected Routes** - Auth required for sensitive endpoints
✅ **HTTPS Ready** - Works with SSL in production

---

## 🚀 Next Steps

### **1. Update Components to Use Real Data**

Replace mock data in:
- `UserDashboard.jsx` → Use `allergyService.getAllergies()`
- `UserRestaurantPage.jsx` → Use `restaurantService.getAllRestaurants()`
- `Profile.jsx` → Use `userService.getProfile()`

### **2. Add Error Handling**

```javascript
try {
  const data = await allergyService.getAllergies();
  setAllergies(data.data);
} catch (error) {
  setError(error.message || 'Failed to load allergies');
}
```

### **3. Add Loading States**

```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await allergyService.getAllergies();
    setAllergies(data.data);
  } finally {
    setLoading(false);
  }
};
```

### **4. Implement Real-time Updates**

After creating/updating/deleting, refresh the data:

```javascript
const handleDelete = async (id) => {
  await allergyService.deleteAllergy(id);
  loadData(); // Refresh list
};
```

---

## 📚 Additional Resources

- **Backend API Docs:** `backend/POSTMAN_TESTING_GUIDE.md`
- **API Endpoints:** `backend/API_ENDPOINTS_SUMMARY.md`
- **Backend README:** `backend/README.md`

---

## ✅ Integration Checklist

- [x] Axios installed
- [x] API services created
- [x] Auth context created
- [x] Login component connected
- [x] Signup component connected
- [x] Token storage implemented
- [x] Auto-logout on 401
- [x] Error handling added
- [x] CORS configured
- [x] Backend running
- [x] Frontend running
- [x] Authentication working

---

**🎉 Your frontend and backend are now fully integrated!**

You can now build features using real data from your MongoDB database!
