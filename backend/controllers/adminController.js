import User from "../models/User.js";
import RestaurantProfile from "../models/RestaurantProfile.js";

// 🔹 Get Admin Statistics
export const getAdminStats = async (req, res) => {
  try {
    // Count total users (role: user)
    const totalUsers = await User.countDocuments({ role: "user" });
    
    // Count total restaurants (role: restaurant)
    const totalRestaurants = await User.countDocuments({ role: "restaurant" });
    
    // Count restaurant profiles (active restaurants with profiles)
    const totalRestaurantProfiles = await RestaurantProfile.countDocuments();
    
    // Get recent users (last 10)
    const recentUsers = await User.find({ role: "user" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get recent restaurants (last 10)
    const recentRestaurants = await User.find({ role: "restaurant" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Send response
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalRestaurantProfiles,
        recentUsers,
        recentRestaurants,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch admin statistics" 
    });
  }
};

// 🔹 Get All Users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch users" 
    });
  }
};

// 🔹 Get All Restaurants (Admin only)
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" })
      .select("-password")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (err) {
    console.error("Get all restaurants error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch restaurants" 
    });
  }
};
