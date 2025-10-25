import Restaurant from '../models/Restaurant.js';

export const addRestaurant = async (req, res) => {
  try {
    const { name, address, safeDishes } = req.body;
    const restaurant = await Restaurant.create({ name, address, safeDishes });
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Add restaurant error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    console.error('List restaurants error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
