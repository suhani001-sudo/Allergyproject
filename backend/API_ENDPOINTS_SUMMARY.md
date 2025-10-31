# 🚀 Food Allergy Management System - API Endpoints Summary

## Base URL
```
http://localhost:5000
```

---

## 📡 All Available Endpoints

### 🔐 Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### 🧬 Allergies (Protected - Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/allergies` | Create allergy record |
| GET | `/api/allergies` | Get all user's allergies |
| GET | `/api/allergies/:id` | Get single allergy |
| PUT | `/api/allergies/:id` | Update allergy |
| DELETE | `/api/allergies/:id` | Delete allergy |

### 🍽️ Restaurants (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/restaurants` | Create restaurant |
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/restaurants?location=NYC` | Filter by location |
| GET | `/api/restaurants?allergyFree=gluten` | Filter by allergen-free |
| GET | `/api/restaurants/:id` | Get single restaurant |
| PUT | `/api/restaurants/:id` | Update restaurant |
| DELETE | `/api/restaurants/:id` | Delete restaurant |

### 👤 Users (Protected - Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update current user profile |
| GET | `/api/users/stats` | Get user dashboard stats |
| GET | `/api/users/:id` | Get user by ID with allergies |
| DELETE | `/api/users/account` | Delete user account |

---

## 📋 Request Body Examples

### Signup/Login
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Allergy
```json
{
  "name": "Peanut Allergy",
  "severity": "high",
  "symptoms": ["itchy throat", "hives", "difficulty breathing"],
  "triggers": ["peanuts", "peanut butter", "peanut oil"],
  "notes": "Carry EpiPen at all times",
  "diagnosedDate": "2020-03-15",
  "lastReaction": "2024-10-20"
}
```

### Create Restaurant
```json
{
  "name": "Allergy-Safe Bistro",
  "location": "New York, NY",
  "address": "123 Main Street",
  "phone": "+1-555-123-4567",
  "website": "https://example.com",
  "allergyFriendlyMenu": [
    {
      "dishName": "Gluten-Free Pasta",
      "allergensFree": ["gluten", "dairy", "nuts"],
      "price": 15.99,
      "description": "Delicious pasta",
      "category": "main"
    }
  ],
  "rating": 4.5,
  "allergyRating": 5
}
```

---

## 🔑 Authentication

For protected endpoints, include this header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the token from signup or login response.

---

## ✅ Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev mode only)"
}
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

---

## 🎯 Quick Start Testing

1. **Start server:** `npm run dev`
2. **Signup:** POST `/api/auth/signup`
3. **Login:** POST `/api/auth/login` (get token)
4. **Create allergy:** POST `/api/allergies` (with token)
5. **Get allergies:** GET `/api/allergies` (with token)
6. **Create restaurant:** POST `/api/restaurants`
7. **Get restaurants:** GET `/api/restaurants`

---

For detailed examples and testing guide, see `POSTMAN_TESTING_GUIDE.md`
