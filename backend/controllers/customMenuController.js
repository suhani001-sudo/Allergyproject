import CustomMenu from '../models/CustomMenu.js';

// @desc    Get all custom menu items
// @route   GET /api/custom-menus
// @access  Public
export const getAllCustomMenus = async (req, res) => {
  try {
    const menus = await CustomMenu.find().sort({ restaurantName: 1, category: 1 });

    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error('Error fetching custom menus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching custom menus',
    });
  }
};

// @desc    Create new custom menu item
// @route   POST /api/custom-menus
// @access  Public
export const createCustomMenuItem = async (req, res) => {
  try {
    const {
      restaurantName,
      category,
      itemName,
      description,
      price,
      imageUrl,
      allergenInfo,
      ingredients,
      isVegetarian,
      isVegan,
      isGlutenFree,
    } = req.body;

    // Validation
    if (!restaurantName || !category || !itemName || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: restaurantName, category, itemName, description, price',
      });
    }

    // Create custom menu item
    const menuItem = await CustomMenu.create({
      restaurantName,
      category: category.toLowerCase(),
      itemName,
      description,
      price,
      imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Menu+Item',
      allergenInfo: allergenInfo || [],
      ingredients: ingredients || [],
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isGlutenFree: isGlutenFree || false,
      isCustom: true,
    });

    res.status(201).json({
      success: true,
      message: 'Custom menu item created successfully',
      data: menuItem,
    });
  } catch (error) {
    console.error('Error creating custom menu item:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating custom menu item',
      error: error.message,
    });
  }
};

// @desc    Update custom menu item
// @route   PUT /api/custom-menus/:id
// @access  Public
export const updateCustomMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await CustomMenu.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Custom menu item not found',
      });
    }

    const updatedMenuItem = await CustomMenu.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Custom menu item updated successfully',
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error('Error updating custom menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating custom menu item',
    });
  }
};

// @desc    Delete custom menu item
// @route   DELETE /api/custom-menus/:id
// @access  Public
export const deleteCustomMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await CustomMenu.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Custom menu item not found',
      });
    }

    await CustomMenu.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Custom menu item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting custom menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting custom menu item',
    });
  }
};
