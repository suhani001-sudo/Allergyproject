import RestaurantMenu from '../models/RestaurantMenu.js';

// @desc    Get all restaurant menu items from MongoDB Atlas
// @route   GET /api/restaurants/menu
// @access  Public
export const getRestaurantMenu = async (req, res) => {
  try {
    console.log('📋 Fetching restaurant menu from MongoDB Atlas...');
    
    // Fetch all documents from the 'restaurants' collection
    const menuItems = await RestaurantMenu.find({}).sort({ restaurantName: 1, category: 1 });
    
    console.log(`✅ Found ${menuItems.length} menu items`);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error('❌ Error fetching restaurant menu:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant menu',
      error: error.message,
    });
  }
};

// @desc    Get menu items by restaurant name
// @route   GET /api/restaurants/menu/:restaurantName
// @access  Public
export const getMenuByRestaurantName = async (req, res) => {
  try {
    const { restaurantName } = req.params;
    
    console.log(`📋 Fetching menu for restaurant: ${restaurantName}`);
    
    // Case-insensitive search
    const menuItems = await RestaurantMenu.find({
      restaurantName: new RegExp(restaurantName, 'i'),
    }).sort({ category: 1 });

    if (menuItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No menu items found for restaurant: ${restaurantName}`,
      });
    }

    console.log(`✅ Found ${menuItems.length} items for ${restaurantName}`);

    res.status(200).json({
      success: true,
      restaurantName: restaurantName,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error('❌ Error fetching menu by restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu by restaurant',
      error: error.message,
    });
  }
};

// @desc    Get menu items by category
// @route   GET /api/restaurants/menu/category/:category
// @access  Public
export const getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    console.log(`📋 Fetching menu for category: ${category}`);
    
    const menuItems = await RestaurantMenu.find({
      category: new RegExp(category, 'i'),
    }).sort({ restaurantName: 1 });

    if (menuItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No menu items found for category: ${category}`,
      });
    }

    console.log(`✅ Found ${menuItems.length} items in category ${category}`);

    res.status(200).json({
      success: true,
      category: category,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error('❌ Error fetching menu by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu by category',
      error: error.message,
    });
  }
};
