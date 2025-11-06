const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection - Use Atlas connection from .env
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/allergydb';

// Menu Schema (matching your existing schema)
const menuSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  allergenInfo: [String],
  ingredients: [String],
  category: { type: String, required: true },
  restaurantName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

// 30 Menu Items with Real Food Images from Unsplash
const menuItems = [
  // Appetizers (6 items)
  {
    itemName: "Crispy Spring Rolls",
    price: 8.99,
    description: "Golden fried spring rolls filled with fresh vegetables and served with sweet chili sauce",
    allergenInfo: ["Gluten", "Soy"],
    ingredients: ["Cabbage", "Carrots", "Bean Sprouts", "Rice Paper", "Soy Sauce"],
    category: "appetizer",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    itemName: "Buffalo Chicken Wings",
    price: 12.99,
    description: "Spicy buffalo wings served with celery sticks and blue cheese dip",
    allergenInfo: ["Dairy"],
    ingredients: ["Chicken Wings", "Buffalo Sauce", "Butter", "Blue Cheese", "Celery"],
    category: "appetizer",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Mozzarella Sticks",
    price: 9.99,
    description: "Breaded mozzarella cheese sticks fried until golden, served with marinara sauce",
    allergenInfo: ["Dairy", "Gluten", "Eggs"],
    ingredients: ["Mozzarella Cheese", "Breadcrumbs", "Eggs", "Marinara Sauce"],
    category: "appetizer",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Bruschetta",
    price: 7.99,
    description: "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil",
    allergenInfo: ["Gluten"],
    ingredients: ["Bread", "Tomatoes", "Basil", "Garlic", "Olive Oil"],
    category: "appetizer",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    itemName: "Shrimp Cocktail",
    price: 14.99,
    description: "Chilled jumbo shrimp served with zesty cocktail sauce and lemon",
    allergenInfo: ["Shellfish"],
    ingredients: ["Shrimp", "Cocktail Sauce", "Lemon", "Lettuce"],
    category: "appetizer",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Loaded Nachos",
    price: 11.99,
    description: "Crispy tortilla chips topped with cheese, jalapeños, sour cream, and guacamole",
    allergenInfo: ["Dairy", "Gluten"],
    ingredients: ["Tortilla Chips", "Cheese", "Jalapeños", "Sour Cream", "Guacamole"],
    category: "appetizer",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },

  // Main Courses (12 items)
  {
    itemName: "Grilled Salmon",
    price: 22.99,
    description: "Fresh Atlantic salmon grilled to perfection with lemon butter sauce",
    allergenInfo: ["Fish", "Dairy"],
    ingredients: ["Salmon", "Butter", "Lemon", "Herbs", "Garlic"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Classic Cheeseburger",
    price: 15.99,
    description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce",
    allergenInfo: ["Gluten", "Dairy", "Eggs"],
    ingredients: ["Beef", "Cheese", "Lettuce", "Tomato", "Bun", "Special Sauce"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Chicken Alfredo Pasta",
    price: 17.99,
    description: "Fettuccine pasta in creamy Alfredo sauce with grilled chicken",
    allergenInfo: ["Gluten", "Dairy"],
    ingredients: ["Fettuccine", "Chicken", "Cream", "Parmesan", "Garlic"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Vegetable Stir Fry",
    price: 13.99,
    description: "Fresh mixed vegetables stir-fried in savory sauce with jasmine rice",
    allergenInfo: ["Soy"],
    ingredients: ["Broccoli", "Carrots", "Bell Peppers", "Soy Sauce", "Rice"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    itemName: "BBQ Ribs",
    price: 24.99,
    description: "Tender pork ribs slow-cooked and glazed with smoky BBQ sauce",
    allergenInfo: [],
    ingredients: ["Pork Ribs", "BBQ Sauce", "Spices", "Brown Sugar"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Margherita Pizza",
    price: 14.99,
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
    allergenInfo: ["Gluten", "Dairy"],
    ingredients: ["Pizza Dough", "Mozzarella", "Tomatoes", "Basil", "Olive Oil"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Beef Tacos",
    price: 12.99,
    description: "Three soft tacos filled with seasoned beef, lettuce, cheese, and salsa",
    allergenInfo: ["Gluten", "Dairy"],
    ingredients: ["Beef", "Tortillas", "Cheese", "Lettuce", "Salsa", "Sour Cream"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Teriyaki Chicken Bowl",
    price: 16.99,
    description: "Grilled chicken with teriyaki glaze over steamed rice and vegetables",
    allergenInfo: ["Soy"],
    ingredients: ["Chicken", "Teriyaki Sauce", "Rice", "Broccoli", "Carrots"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Mushroom Risotto",
    price: 18.99,
    description: "Creamy Italian rice with wild mushrooms and parmesan cheese",
    allergenInfo: ["Dairy"],
    ingredients: ["Arborio Rice", "Mushrooms", "Parmesan", "White Wine", "Butter"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-c4ca6f27a1f8?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Fish and Chips",
    price: 16.99,
    description: "Beer-battered cod with crispy fries and tartar sauce",
    allergenInfo: ["Fish", "Gluten", "Eggs"],
    ingredients: ["Cod", "Beer Batter", "Potatoes", "Tartar Sauce"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Caesar Salad with Chicken",
    price: 13.99,
    description: "Crisp romaine lettuce with grilled chicken, croutons, and Caesar dressing",
    allergenInfo: ["Gluten", "Dairy", "Eggs"],
    ingredients: ["Romaine Lettuce", "Chicken", "Croutons", "Parmesan", "Caesar Dressing"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Lamb Curry",
    price: 19.99,
    description: "Tender lamb in aromatic curry sauce served with basmati rice",
    allergenInfo: ["Dairy"],
    ingredients: ["Lamb", "Curry Spices", "Coconut Milk", "Tomatoes", "Rice"],
    category: "main",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },

  // Desserts (6 items)
  {
    itemName: "Chocolate Lava Cake",
    price: 8.99,
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    allergenInfo: ["Gluten", "Dairy", "Eggs"],
    ingredients: ["Chocolate", "Flour", "Eggs", "Butter", "Sugar", "Ice Cream"],
    category: "dessert",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "New York Cheesecake",
    price: 7.99,
    description: "Rich and creamy cheesecake with graham cracker crust",
    allergenInfo: ["Gluten", "Dairy", "Eggs"],
    ingredients: ["Cream Cheese", "Graham Crackers", "Eggs", "Sugar", "Vanilla"],
    category: "dessert",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Tiramisu",
    price: 8.99,
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    allergenInfo: ["Gluten", "Dairy", "Eggs"],
    ingredients: ["Ladyfingers", "Mascarpone", "Coffee", "Cocoa", "Eggs"],
    category: "dessert",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Apple Pie",
    price: 6.99,
    description: "Homemade apple pie with cinnamon and a flaky crust",
    allergenInfo: ["Gluten", "Dairy"],
    ingredients: ["Apples", "Flour", "Butter", "Cinnamon", "Sugar"],
    category: "dessert",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    itemName: "Ice Cream Sundae",
    price: 5.99,
    description: "Three scoops of ice cream with chocolate sauce, whipped cream, and cherry",
    allergenInfo: ["Dairy", "Nuts"],
    ingredients: ["Ice Cream", "Chocolate Sauce", "Whipped Cream", "Nuts", "Cherry"],
    category: "dessert",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Crème Brûlée",
    price: 9.99,
    description: "Silky vanilla custard with caramelized sugar topping",
    allergenInfo: ["Dairy", "Eggs"],
    ingredients: ["Cream", "Eggs", "Vanilla", "Sugar"],
    category: "dessert",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },

  // Beverages (6 items)
  {
    itemName: "Fresh Lemonade",
    price: 3.99,
    description: "Freshly squeezed lemonade with a hint of mint",
    allergenInfo: [],
    ingredients: ["Lemon", "Sugar", "Water", "Mint"],
    category: "beverage",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9f?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    itemName: "Iced Coffee",
    price: 4.99,
    description: "Cold brew coffee served over ice with a splash of cream",
    allergenInfo: ["Dairy"],
    ingredients: ["Coffee", "Ice", "Cream", "Sugar"],
    category: "beverage",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Mango Smoothie",
    price: 5.99,
    description: "Tropical mango smoothie blended with yogurt and honey",
    allergenInfo: ["Dairy"],
    ingredients: ["Mango", "Yogurt", "Honey", "Ice"],
    category: "beverage",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Green Tea",
    price: 2.99,
    description: "Premium Japanese green tea, hot or iced",
    allergenInfo: [],
    ingredients: ["Green Tea Leaves", "Water"],
    category: "beverage",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    itemName: "Strawberry Milkshake",
    price: 6.99,
    description: "Thick and creamy milkshake made with fresh strawberries",
    allergenInfo: ["Dairy"],
    ingredients: ["Strawberries", "Milk", "Ice Cream", "Sugar"],
    category: "beverage",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    itemName: "Orange Juice",
    price: 3.99,
    description: "Freshly squeezed orange juice",
    allergenInfo: [],
    ingredients: ["Oranges"],
    category: "beverage",
    restaurantName: "SafeBytes Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  }
];

// Function to populate database
async function populateMenu() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert new menu items
    const result = await Menu.insertMany(menuItems);
    console.log(`✅ Successfully added ${result.length} menu items to database`);

    // Display summary
    console.log('\n📊 Menu Summary:');
    console.log(`   - Appetizers: 6 items`);
    console.log(`   - Main Courses: 12 items`);
    console.log(`   - Desserts: 6 items`);
    console.log(`   - Beverages: 6 items`);
    console.log(`   - Total: 30 items\n`);

    console.log('🎉 Database population complete!');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run the script
populateMenu();
