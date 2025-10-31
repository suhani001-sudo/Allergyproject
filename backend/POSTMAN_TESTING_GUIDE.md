# 🧪 Food Allergy Management System - API Testing Guide

## 📋 Table of Contents
1. [Server Status](#server-status)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Allergy Management Endpoints](#allergy-management-endpoints)
4. [Restaurant Endpoints](#restaurant-endpoints)
5. [User Profile Endpoints](#user-profile-endpoints)

---

## ✅ Server Status

**Check if server is running:**

```http
GET http://localhost:5000/
```

**Expected Response:**
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

## 🔐 Authentication Endpoints

### 1. User Signup

**Endpoint:** `POST http://localhost:5000/api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "67234abc123def456",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Save the `token` - you'll need it for authenticated requests!**

---

### 2. User Login

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "67234abc123def456",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🧬 Allergy Management Endpoints

**⚠️ All allergy endpoints require authentication!**

**Add this header to all requests:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 1. Create Allergy Record

**Endpoint:** `POST http://localhost:5000/api/allergies`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Peanut Allergy",
  "severity": "high",
  "symptoms": ["itchy throat", "hives", "difficulty breathing", "swelling"],
  "triggers": ["peanuts", "peanut butter", "peanut oil"],
  "notes": "Diagnosed in 2020. Carry EpiPen at all times.",
  "diagnosedDate": "2020-03-15",
  "lastReaction": "2024-10-20"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Allergy record created successfully",
  "data": {
    "_id": "67234xyz789abc123",
    "user": "67234abc123def456",
    "name": "Peanut Allergy",
    "severity": "high",
    "symptoms": ["itchy throat", "hives", "difficulty breathing", "swelling"],
    "triggers": ["peanuts", "peanut butter", "peanut oil"],
    "notes": "Diagnosed in 2020. Carry EpiPen at all times.",
    "diagnosedDate": "2020-03-15T00:00:00.000Z",
    "lastReaction": "2024-10-20T00:00:00.000Z",
    "createdAt": "2025-10-31T06:00:00.000Z",
    "updatedAt": "2025-10-31T06:00:00.000Z"
  }
}
```

---

### 2. Get All User's Allergies

**Endpoint:** `GET http://localhost:5000/api/allergies`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67234xyz789abc123",
      "user": "67234abc123def456",
      "name": "Peanut Allergy",
      "severity": "high",
      "symptoms": ["itchy throat", "hives"],
      "triggers": ["peanuts"],
      "notes": "Carry EpiPen",
      "createdAt": "2025-10-31T06:00:00.000Z",
      "updatedAt": "2025-10-31T06:00:00.000Z"
    },
    {
      "_id": "67234xyz789abc124",
      "user": "67234abc123def456",
      "name": "Shellfish Allergy",
      "severity": "moderate",
      "symptoms": ["nausea", "vomiting"],
      "triggers": ["shrimp", "crab"],
      "notes": "Avoid seafood restaurants",
      "createdAt": "2025-10-30T06:00:00.000Z",
      "updatedAt": "2025-10-30T06:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Allergy by ID

**Endpoint:** `GET http://localhost:5000/api/allergies/:id`

**Example:** `GET http://localhost:5000/api/allergies/67234xyz789abc123`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67234xyz789abc123",
    "user": "67234abc123def456",
    "name": "Peanut Allergy",
    "severity": "high",
    "symptoms": ["itchy throat", "hives"],
    "triggers": ["peanuts"],
    "notes": "Carry EpiPen",
    "createdAt": "2025-10-31T06:00:00.000Z",
    "updatedAt": "2025-10-31T06:00:00.000Z"
  }
}
```

---

### 4. Update Allergy Record

**Endpoint:** `PUT http://localhost:5000/api/allergies/:id`

**Example:** `PUT http://localhost:5000/api/allergies/67234xyz789abc123`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Peanut Allergy",
  "severity": "severe",
  "symptoms": ["itchy throat", "hives", "difficulty breathing", "anaphylaxis"],
  "triggers": ["peanuts", "peanut butter", "peanut oil", "tree nuts"],
  "notes": "Updated: Now includes tree nut sensitivity. Always carry two EpiPens.",
  "lastReaction": "2025-10-30"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Allergy updated successfully",
  "data": {
    "_id": "67234xyz789abc123",
    "user": "67234abc123def456",
    "name": "Peanut Allergy",
    "severity": "severe",
    "symptoms": ["itchy throat", "hives", "difficulty breathing", "anaphylaxis"],
    "triggers": ["peanuts", "peanut butter", "peanut oil", "tree nuts"],
    "notes": "Updated: Now includes tree nut sensitivity. Always carry two EpiPens.",
    "lastReaction": "2025-10-30T00:00:00.000Z",
    "createdAt": "2025-10-31T06:00:00.000Z",
    "updatedAt": "2025-10-31T06:30:00.000Z"
  }
}
```

---

### 5. Delete Allergy Record

**Endpoint:** `DELETE http://localhost:5000/api/allergies/:id`

**Example:** `DELETE http://localhost:5000/api/allergies/67234xyz789abc123`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Allergy deleted successfully"
}
```

---

## 🍽️ Restaurant Endpoints

**ℹ️ Restaurant endpoints are public (no authentication required)**

### 1. Create Restaurant

**Endpoint:** `POST http://localhost:5000/api/restaurants`

**Request Body:**
```json
{
  "name": "Allergy-Safe Bistro",
  "location": "New York, NY",
  "address": "123 Main Street, New York, NY 10001",
  "phone": "+1-555-123-4567",
  "website": "https://allergysafebistro.com",
  "allergyFriendlyMenu": [
    {
      "dishName": "Gluten-Free Pasta",
      "allergensFree": ["gluten", "dairy", "nuts"],
      "price": 15.99,
      "description": "Delicious pasta made with rice flour",
      "category": "main"
    },
    {
      "dishName": "Vegan Chocolate Cake",
      "allergensFree": ["dairy", "eggs", "nuts"],
      "price": 8.99,
      "description": "Rich chocolate cake made with plant-based ingredients",
      "category": "dessert"
    }
  ],
  "rating": 4.5,
  "allergyRating": 5
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "_id": "67234rest123abc456",
    "name": "Allergy-Safe Bistro",
    "location": "New York, NY",
    "address": "123 Main Street, New York, NY 10001",
    "phone": "+1-555-123-4567",
    "website": "https://allergysafebistro.com",
    "allergyFriendlyMenu": [
      {
        "dishName": "Gluten-Free Pasta",
        "allergensFree": ["gluten", "dairy", "nuts"],
        "price": 15.99,
        "description": "Delicious pasta made with rice flour",
        "category": "main",
        "_id": "67234dish123"
      }
    ],
    "rating": 4.5,
    "allergyRating": 5,
    "createdAt": "2025-10-31T06:00:00.000Z",
    "updatedAt": "2025-10-31T06:00:00.000Z"
  }
}
```

---

### 2. Get All Restaurants

**Endpoint:** `GET http://localhost:5000/api/restaurants`

**Optional Query Parameters:**
- `location` - Filter by location (case-insensitive)
- `allergyFree` - Filter by allergen-free dishes

**Examples:**
```
GET http://localhost:5000/api/restaurants
GET http://localhost:5000/api/restaurants?location=New York
GET http://localhost:5000/api/restaurants?allergyFree=gluten
GET http://localhost:5000/api/restaurants?location=New York&allergyFree=nuts
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67234rest123abc456",
      "name": "Allergy-Safe Bistro",
      "location": "New York, NY",
      "address": "123 Main Street",
      "phone": "+1-555-123-4567",
      "allergyFriendlyMenu": [...],
      "rating": 4.5,
      "allergyRating": 5,
      "createdAt": "2025-10-31T06:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Restaurant by ID

**Endpoint:** `GET http://localhost:5000/api/restaurants/:id`

**Example:** `GET http://localhost:5000/api/restaurants/67234rest123abc456`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67234rest123abc456",
    "name": "Allergy-Safe Bistro",
    "location": "New York, NY",
    "address": "123 Main Street",
    "allergyFriendlyMenu": [...],
    "rating": 4.5,
    "allergyRating": 5
  }
}
```

---

### 4. Update Restaurant

**Endpoint:** `PUT http://localhost:5000/api/restaurants/:id`

**Request Body:**
```json
{
  "name": "Allergy-Safe Bistro & Cafe",
  "rating": 4.8,
  "allergyRating": 5
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": {
    "_id": "67234rest123abc456",
    "name": "Allergy-Safe Bistro & Cafe",
    "rating": 4.8,
    "allergyRating": 5,
    "updatedAt": "2025-10-31T07:00:00.000Z"
  }
}
```

---

### 5. Delete Restaurant

**Endpoint:** `DELETE http://localhost:5000/api/restaurants/:id`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

---

## 👤 User Profile Endpoints

**⚠️ All user endpoints require authentication!**

### 1. Get Current User Profile

**Endpoint:** `GET http://localhost:5000/api/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67234abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-30T06:00:00.000Z",
    "updatedAt": "2025-10-30T06:00:00.000Z"
  }
}
```

---

### 2. Update User Profile

**Endpoint:** `PUT http://localhost:5000/api/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "67234abc123def456",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "updatedAt": "2025-10-31T06:00:00.000Z"
  }
}
```

---

### 3. Get User by ID (with Allergies)

**Endpoint:** `GET http://localhost:5000/api/users/:id`

**Example:** `GET http://localhost:5000/api/users/67234abc123def456`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "67234abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-10-30T06:00:00.000Z"
    },
    "allergies": [
      {
        "_id": "67234xyz789abc123",
        "name": "Peanut Allergy",
        "severity": "high",
        "symptoms": ["itchy throat", "hives"],
        "triggers": ["peanuts"]
      }
    ],
    "allergyCount": 1
  }
}
```

---

### 4. Get User Dashboard Stats

**Endpoint:** `GET http://localhost:5000/api/users/stats`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "totalAllergies": 3,
    "severityCounts": [
      { "_id": "high", "count": 1 },
      { "_id": "moderate", "count": 2 }
    ],
    "recentAllergies": [
      {
        "_id": "67234xyz789abc123",
        "name": "Peanut Allergy",
        "severity": "high",
        "createdAt": "2025-10-31T06:00:00.000Z"
      }
    ]
  }
}
```

---

### 5. Delete User Account

**Endpoint:** `DELETE http://localhost:5000/api/users/account`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**⚠️ This will delete the user and all their allergy records!**

---

## 📝 Testing Workflow

### Step-by-Step Testing Order:

1. **Start Server** - Verify server is running
2. **Signup** - Create a new user account
3. **Login** - Get authentication token
4. **Create Allergy** - Add allergy records
5. **Get Allergies** - View all allergies
6. **Update Allergy** - Modify an allergy record
7. **Create Restaurant** - Add restaurant data
8. **Get Restaurants** - View all restaurants
9. **Get User Profile** - View user details
10. **Get User Stats** - View dashboard statistics

---

## 🔧 Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Allergy name is required"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Allergy not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already registered"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details here"
}
```

---

## 🎯 Quick Test Collection (Copy-Paste Ready)

Save these as a Postman collection or use with any HTTP client:

```
# 1. Signup
POST http://localhost:5000/api/auth/signup
{"name":"Test User","email":"test@test.com","password":"test123"}

# 2. Login
POST http://localhost:5000/api/auth/login
{"email":"test@test.com","password":"test123"}

# 3. Create Allergy (add token to header)
POST http://localhost:5000/api/allergies
Authorization: Bearer YOUR_TOKEN
{"name":"Peanut Allergy","severity":"high","symptoms":["hives"],"triggers":["peanuts"]}

# 4. Get Allergies
GET http://localhost:5000/api/allergies
Authorization: Bearer YOUR_TOKEN

# 5. Create Restaurant
POST http://localhost:5000/api/restaurants
{"name":"Safe Eats","location":"NYC","allergyFriendlyMenu":[]}

# 6. Get Restaurants
GET http://localhost:5000/api/restaurants
```

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] User signup works
- [ ] User login returns token
- [ ] Can create allergy records
- [ ] Can retrieve allergies
- [ ] Can update allergies
- [ ] Can delete allergies
- [ ] Can create restaurants
- [ ] Can retrieve restaurants
- [ ] Can filter restaurants
- [ ] User profile endpoints work
- [ ] Protected routes require authentication
- [ ] Error handling works correctly

---

**🎉 Your backend is ready for production!**
