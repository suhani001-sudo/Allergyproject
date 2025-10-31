// Seed script to populate menu items in MongoDB
import './config/env.js';
import { connectDB } from './config/db.js';
import Menu from './models/Menu.js';

const sampleMenus = [
  // Restaurant 1: Allergy-Safe Bistro
  {
    restaurantName: 'Allergy-Safe Bistro',
    category: 'appetizer',
    itemName: 'Gluten-Free Bruschetta',
    description: 'Crispy gluten-free bread topped with fresh tomatoes, basil, and olive oil',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Allergy-Safe Bistro',
    category: 'main',
    itemName: 'Gluten-Free Pasta Primavera',
    description: 'Fresh vegetables tossed with gluten-free pasta in a light garlic sauce',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Allergy-Safe Bistro',
    category: 'main',
    itemName: 'Grilled Salmon with Quinoa',
    description: 'Fresh Atlantic salmon with quinoa and steamed vegetables',
    price: 22.99,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300',
    allergenInfo: ['fish'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Allergy-Safe Bistro',
    category: 'dessert',
    itemName: 'Vegan Chocolate Cake',
    description: 'Rich chocolate cake made with plant-based ingredients',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
  },
  {
    restaurantName: 'Allergy-Safe Bistro',
    category: 'beverage',
    itemName: 'Fresh Fruit Smoothie',
    description: 'Blend of seasonal fruits with coconut milk',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },

  // Restaurant 2: Safe Eats Cafe
  {
    restaurantName: 'Safe Eats Cafe',
    category: 'appetizer',
    itemName: 'Nut-Free Hummus Platter',
    description: 'Creamy hummus served with fresh vegetables and pita bread',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300',
    allergenInfo: ['sesame'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
  },
  {
    restaurantName: 'Safe Eats Cafe',
    category: 'main',
    itemName: 'Dairy-Free Pizza Margherita',
    description: 'Classic pizza with dairy-free cheese and fresh basil',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
    allergenInfo: ['gluten'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
  },
  {
    restaurantName: 'Safe Eats Cafe',
    category: 'main',
    itemName: 'Grilled Chicken Bowl',
    description: 'Grilled chicken with rice, vegetables, and tahini sauce',
    price: 16.99,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
    allergenInfo: ['sesame'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Safe Eats Cafe',
    category: 'side',
    itemName: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries with dairy-free aioli',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Safe Eats Cafe',
    category: 'dessert',
    itemName: 'Coconut Panna Cotta',
    description: 'Creamy coconut dessert with berry compote',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },

  // Restaurant 3: Green Leaf Kitchen
  {
    restaurantName: 'Green Leaf Kitchen',
    category: 'appetizer',
    itemName: 'Avocado Toast',
    description: 'Smashed avocado on whole grain toast with cherry tomatoes',
    price: 10.99,
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300',
    allergenInfo: ['gluten'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
  },
  {
    restaurantName: 'Green Leaf Kitchen',
    category: 'main',
    itemName: 'Vegan Buddha Bowl',
    description: 'Quinoa, roasted vegetables, chickpeas, and tahini dressing',
    price: 13.99,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
    allergenInfo: ['sesame'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Green Leaf Kitchen',
    category: 'main',
    itemName: 'Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms (dairy-free option available)',
    price: 17.99,
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-c4f6c8f6c42e?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Green Leaf Kitchen',
    category: 'beverage',
    itemName: 'Green Detox Juice',
    description: 'Fresh blend of kale, cucumber, apple, and lemon',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Green Leaf Kitchen',
    category: 'dessert',
    itemName: 'Chia Seed Pudding',
    description: 'Chia seeds in coconut milk with fresh berries',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },

  // Restaurant 4: Urban Grill House
  {
    restaurantName: 'Urban Grill House',
    category: 'appetizer',
    itemName: 'Chicken Wings',
    description: 'Crispy wings with choice of sauce (gluten-free)',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300',
    allergenInfo: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Urban Grill House',
    category: 'main',
    itemName: 'Classic Burger',
    description: 'Beef burger with lettuce, tomato, and gluten-free bun option',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    allergenInfo: ['gluten'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  },
  {
    restaurantName: 'Urban Grill House',
    category: 'main',
    itemName: 'Grilled Steak',
    description: 'Premium ribeye steak with roasted vegetables',
    price: 28.99,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300',
    allergenInfo: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Urban Grill House',
    category: 'side',
    itemName: 'Loaded Baked Potato',
    description: 'Baked potato with dairy-free toppings',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=300',
    allergenInfo: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
  {
    restaurantName: 'Urban Grill House',
    category: 'beverage',
    itemName: 'Craft Beer',
    description: 'Selection of local craft beers',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300',
    allergenInfo: ['gluten'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
  },
];

const seedMenus = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Starting menu seed...');

    // Clear existing menus
    await Menu.deleteMany({});
    console.log('✅ Cleared existing menu items');

    // Insert sample menus
    const createdMenus = await Menu.insertMany(sampleMenus);
    console.log(`✅ Successfully seeded ${createdMenus.length} menu items`);

    // Show summary by restaurant
    const restaurants = [...new Set(sampleMenus.map(m => m.restaurantName))];
    console.log('\n📊 Menu Summary:');
    for (const restaurant of restaurants) {
      const count = sampleMenus.filter(m => m.restaurantName === restaurant).length;
      console.log(`   ${restaurant}: ${count} items`);
    }

    console.log('\n🎉 Menu seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menus:', error);
    process.exit(1);
  }
};

// Run the seed function
seedMenus();
