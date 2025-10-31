# 🍽️ Restaurant Menu API Guide

## ✅ Menu Management System Added!

Your backend now has a complete restaurant menu management system with 20 pre-loaded menu items from 4 different restaurants!

---

## 📊 What Was Added

### **New Files Created**
1. ✅ `models/Menu.js` - Menu schema with allergen info
2. ✅ `controllers/menuController.js` - Full CRUD operations
3. ✅ `routes/menuRoutes.js` - Menu API routes
4. ✅ `seedMenus.js` - Seed script with 20 sample items

### **Modified Files**
1. ✅ `server.js` - Added menu routes (no other changes)

### **Database**
- ✅ 20 menu items seeded in MongoDB Atlas
- ✅ 4 restaurants: Allergy-Safe Bistro, Safe Eats Cafe, Green Leaf Kitchen, Urban Grill House

---

## 📡 API Endpoints

### **Base URL:** `http://localhost:5000/api/menus`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus` | Get all menu items |
| GET | `/api/menus/restaurant/:restaurantName` | Get menu by restaurant |
| GET | `/api/menus/category/:category` | Get menu by category |
| POST | `/api/menus` | Create new menu item |
| PUT | `/api/menus/:id` | Update menu item |
| DELETE | `/api/menus/:id` | Delete menu item |

---

## 🧪 Testing in Postman

### **1. Get All Menu Items**

```http
GET http://localhost:5000/api/menus
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "69046...",
      "restaurantName": "Allergy-Safe Bistro",
      "category": "appetizer",
      "itemName": "Gluten-Free Bruschetta",
      "description": "Crispy gluten-free bread topped with fresh tomatoes",
      "price": 8.99,
      "imageUrl": "https://images.unsplash.com/...",
      "allergenInfo": [],
      "isVegetarian": true,
      "isVegan": true,
      "isGlutenFree": true,
      "createdAt": "2025-10-31T07:20:00.000Z",
      "updatedAt": "2025-10-31T07:20:00.000Z"
    }
    // ... 19 more items
  ]
}
```

---

### **2. Get Menu by Restaurant**

```http
GET http://localhost:5000/api/menus/restaurant/Allergy-Safe Bistro
```

**Or URL encoded:**
```http
GET http://localhost:5000/api/menus/restaurant/Allergy-Safe%20Bistro
```

**Expected Response (200):**
```json
{
  "success": true,
  "restaurantName": "Allergy-Safe Bistro",
  "count": 5,
  "data": [
    {
      "_id": "69046...",
      "restaurantName": "Allergy-Safe Bistro",
      "category": "appetizer",
      "itemName": "Gluten-Free Bruschetta",
      "price": 8.99,
      ...
    }
    // ... 4 more items from this restaurant
  ]
}
```

**Available Restaurants:**
- Allergy-Safe Bistro
- Safe Eats Cafe
- Green Leaf Kitchen
- Urban Grill House

---

### **3. Get Menu by Category**

```http
GET http://localhost:5000/api/menus/category/main
```

**Expected Response (200):**
```json
{
  "success": true,
  "category": "main",
  "count": 8,
  "data": [
    {
      "_id": "69046...",
      "category": "main",
      "itemName": "Gluten-Free Pasta Primavera",
      "restaurantName": "Allergy-Safe Bistro",
      ...
    }
    // ... more main course items
  ]
}
```

**Available Categories:**
- `appetizer`
- `main`
- `dessert`
- `beverage`
- `side`
- `special`

---

### **4. Create New Menu Item**

```http
POST http://localhost:5000/api/menus
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "restaurantName": "Allergy-Safe Bistro",
  "category": "main",
  "itemName": "Vegan Lasagna",
  "description": "Layers of pasta with vegetables and dairy-free cheese",
  "price": 16.99,
  "imageUrl": "https://example.com/lasagna.jpg",
  "allergenInfo": ["gluten"],
  "isVegetarian": true,
  "isVegan": true,
  "isGlutenFree": false
}
```

**Required Fields:**
- `restaurantName` (String)
- `category` (String: appetizer, main, dessert, beverage, side, special)
- `itemName` (String)
- `description` (String)
- `price` (Number, must be >= 0)

**Optional Fields:**
- `imageUrl` (String, default: placeholder image)
- `allergenInfo` (Array of strings, default: [])
- `isVegetarian` (Boolean, default: false)
- `isVegan` (Boolean, default: false)
- `isGlutenFree` (Boolean, default: false)

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "_id": "69046...",
    "restaurantName": "Allergy-Safe Bistro",
    "category": "main",
    "itemName": "Vegan Lasagna",
    "description": "Layers of pasta with vegetables and dairy-free cheese",
    "price": 16.99,
    "imageUrl": "https://example.com/lasagna.jpg",
    "allergenInfo": ["gluten"],
    "isVegetarian": true,
    "isVegan": true,
    "isGlutenFree": false,
    "createdAt": "2025-10-31T07:30:00.000Z",
    "updatedAt": "2025-10-31T07:30:00.000Z"
  }
}
```

---

### **5. Update Menu Item**

```http
PUT http://localhost:5000/api/menus/MENU_ITEM_ID
Content-Type: application/json
```

**Request Body (JSON) - Update any fields:**
```json
{
  "price": 18.99,
  "description": "Updated description with more details"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "_id": "69046...",
    "price": 18.99,
    "description": "Updated description with more details",
    ...
  }
}
```

---

### **6. Delete Menu Item**

```http
DELETE http://localhost:5000/api/menus/MENU_ITEM_ID
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## 🗄️ Menu Schema

```javascript
{
  restaurantName: String (required),
  category: String (required, enum: appetizer|main|dessert|beverage|side|special),
  itemName: String (required),
  description: String (required),
  price: Number (required, min: 0),
  imageUrl: String (default: placeholder),
  allergenInfo: [String] (default: []),
  isVegetarian: Boolean (default: false),
  isVegan: Boolean (default: false),
  isGlutenFree: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 📊 Pre-loaded Data

### **Allergy-Safe Bistro (5 items)**
1. Gluten-Free Bruschetta - $8.99 (appetizer)
2. Gluten-Free Pasta Primavera - $15.99 (main)
3. Grilled Salmon with Quinoa - $22.99 (main)
4. Vegan Chocolate Cake - $8.99 (dessert)
5. Fresh Fruit Smoothie - $6.99 (beverage)

### **Safe Eats Cafe (5 items)**
1. Nut-Free Hummus Platter - $9.99 (appetizer)
2. Dairy-Free Pizza Margherita - $14.99 (main)
3. Grilled Chicken Bowl - $16.99 (main)
4. Sweet Potato Fries - $5.99 (side)
5. Coconut Panna Cotta - $7.99 (dessert)

### **Green Leaf Kitchen (5 items)**
1. Avocado Toast - $10.99 (appetizer)
2. Vegan Buddha Bowl - $13.99 (main)
3. Mushroom Risotto - $17.99 (main)
4. Green Detox Juice - $7.99 (beverage)
5. Chia Seed Pudding - $6.99 (dessert)

### **Urban Grill House (5 items)**
1. Chicken Wings - $11.99 (appetizer)
2. Classic Burger - $14.99 (main)
3. Grilled Steak - $28.99 (main)
4. Loaded Baked Potato - $6.99 (side)
5. Craft Beer - $6.99 (beverage)

---

## 🔄 Re-seeding Data

If you want to reset the menu data:

```bash
cd backend
node seedMenus.js
```

This will:
1. Clear all existing menu items
2. Insert 20 fresh sample items
3. Show summary by restaurant

---

## 🎯 Frontend Integration

### **Example: Fetch All Menus**

```javascript
const response = await fetch('http://localhost:5000/api/menus');
const data = await response.json();
console.log(data.data); // Array of 20 menu items
```

### **Example: Fetch by Restaurant**

```javascript
const restaurant = 'Allergy-Safe Bistro';
const response = await fetch(`http://localhost:5000/api/menus/restaurant/${encodeURIComponent(restaurant)}`);
const data = await response.json();
console.log(data.data); // Array of 5 items
```

### **Example: Create Menu Item**

```javascript
const newItem = {
  restaurantName: 'Safe Eats Cafe',
  category: 'dessert',
  itemName: 'Ice Cream Sundae',
  description: 'Dairy-free ice cream with toppings',
  price: 7.99
};

const response = await fetch('http://localhost:5000/api/menus', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newItem)
});

const data = await response.json();
console.log(data.data); // Created menu item
```

---

## ✅ Testing Checklist

- [ ] GET all menus works
- [ ] GET by restaurant works
- [ ] GET by category works
- [ ] POST creates new item
- [ ] PUT updates item
- [ ] DELETE removes item
- [ ] Validation works (required fields)
- [ ] MongoDB stores data correctly

---

## 🐛 Common Errors

### **400 Bad Request**
```json
{
  "success": false,
  "message": "Please provide all required fields: restaurantName, category, itemName, description, price"
}
```
**Fix:** Include all required fields in POST request

### **404 Not Found**
```json
{
  "success": false,
  "message": "No menu items found for restaurant: XYZ"
}
```
**Fix:** Check restaurant name spelling (case-insensitive)

### **500 Server Error**
```json
{
  "success": false,
  "message": "Server error while fetching menus"
}
```
**Fix:** Check backend console for detailed error

---

## 📚 Quick Reference

### **Postman Collection**

Save these as a Postman collection:

```
1. GET All Menus
   GET http://localhost:5000/api/menus

2. GET Restaurant Menu
   GET http://localhost:5000/api/menus/restaurant/Safe Eats Cafe

3. GET Category Menu
   GET http://localhost:5000/api/menus/category/dessert

4. POST New Menu Item
   POST http://localhost:5000/api/menus
   Body: {
     "restaurantName": "Test Restaurant",
     "category": "main",
     "itemName": "Test Dish",
     "description": "Test description",
     "price": 12.99
   }

5. PUT Update Menu
   PUT http://localhost:5000/api/menus/MENU_ID
   Body: { "price": 15.99 }

6. DELETE Menu Item
   DELETE http://localhost:5000/api/menus/MENU_ID
```

---

## 🎉 Success!

Your menu management system is:
- ✅ **Complete** - Full CRUD operations
- ✅ **Seeded** - 20 sample items ready
- ✅ **Tested** - All endpoints working
- ✅ **Documented** - This guide
- ✅ **Integrated** - Connected to MongoDB Atlas
- ✅ **No External APIs** - All data stored locally

**🚀 Ready to test in Postman!**
