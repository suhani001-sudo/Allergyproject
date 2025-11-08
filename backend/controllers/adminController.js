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

// 🔹 Delete User (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find and delete user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Prevent deleting admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin accounts"
      });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};

// 🔹 Delete Restaurant (Admin only)
export const deleteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Find and delete restaurant
    const restaurant = await User.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }
    
    // Verify it's a restaurant account
    if (restaurant.role !== "restaurant") {
      return res.status(400).json({
        success: false,
        message: "This is not a restaurant account"
      });
    }
    
    // Delete associated restaurant profile if exists
    await RestaurantProfile.deleteMany({ userId: restaurantId });
    
    // Delete the restaurant user account
    await User.findByIdAndDelete(restaurantId);
    
    res.status(200).json({
      success: true,
      message: "Restaurant and associated data deleted successfully"
    });
  } catch (err) {
    console.error("Delete restaurant error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant"
    });
  }
};
