import Restaurant from '../models/Restaurant.js';

// Create new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      address, 
      phone, 
      website, 
      allergyFriendlyMenu,
      rating,
      allergyRating
    } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ 
        success: false,
        message: 'Restaurant name and location are required' 
      });
    }

    const restaurant = await Restaurant.create({ 
      name, 
      location, 
      address, 
      phone, 
      website, 
      allergyFriendlyMenu: allergyFriendlyMenu || [],
      rating: rating || 0,
      allergyRating: allergyRating || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (err) {
    console.error('Create restaurant error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const { location, allergyFree } = req.query;
    
    let query = {};
    
    // Filter by location if provided
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Filter by allergen-free dishes if provided
    if (allergyFree) {
      query['allergyFriendlyMenu.allergensFree'] = { 
        $in: [allergyFree] 
      };
    }
    
    const restaurants = await Restaurant.find(query)
      .sort({ allergyRating: -1, createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (err) {
    console.error('Get restaurants error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get single restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select('-__v');
    
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (err) {
    console.error('Get restaurant error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      address, 
      phone, 
      website, 
      allergyFriendlyMenu,
      rating,
      allergyRating
    } = req.body;
    
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        location, 
        address, 
        phone, 
        website, 
        allergyFriendlyMenu,
        rating,
        allergyRating
      },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Update restaurant error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const removed = await Restaurant.findByIdAndDelete(req.params.id);
    
    if (!removed) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Restaurant deleted successfully' 
    });
  } catch (err) {
    console.error('Delete restaurant error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Legacy alias for backward compatibility
export const addRestaurant = createRestaurant;
export const listRestaurants = getAllRestaurants;
