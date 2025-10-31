import Menu from '../models/Menu.js';

// @desc    Get all menu items
// @route   GET /api/menus
// @access  Public
export const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ restaurantName: 1, category: 1 });

    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menus',
    });
  }
};

// @desc    Get menu items by restaurant name
// @route   GET /api/menus/:restaurantName
// @access  Public
export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantName } = req.params;

    const menus = await Menu.find({
      restaurantName: new RegExp(restaurantName, 'i'), // Case-insensitive search
    }).sort({ category: 1 });

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No menu items found for restaurant: ${restaurantName}`,
      });
    }

    res.status(200).json({
      success: true,
      restaurantName: restaurantName,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant menu',
    });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menus/category/:category
// @access  Public
export const getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const menus = await Menu.find({
      category: category.toLowerCase(),
    }).sort({ restaurantName: 1 });

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No menu items found for category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      category: category,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error('Error fetching menu by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu by category',
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/menus
// @access  Public (you can protect this later with auth middleware)
export const createMenuItem = async (req, res) => {
  try {
    const {
      restaurantName,
      category,
      itemName,
      description,
      price,
      imageUrl,
      allergenInfo,
      isVegetarian,
      isVegan,
      isGlutenFree,
    } = req.body;

    // Validation
    if (!restaurantName || !category || !itemName || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: restaurantName, category, itemName, description, price',
      });
    }

    // Create menu item
    const menuItem = await Menu.create({
      restaurantName,
      category: category.toLowerCase(),
      itemName,
      description,
      price,
      imageUrl,
      allergenInfo,
      isVegetarian,
      isVegan,
      isGlutenFree,
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem,
    });
  } catch (error) {
    console.error('Error creating menu item:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating menu item',
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menus/:id
// @access  Public (you can protect this later with auth middleware)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating menu item',
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menus/:id
// @access  Public (you can protect this later with auth middleware)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    await Menu.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting menu item',
    });
  }
};
