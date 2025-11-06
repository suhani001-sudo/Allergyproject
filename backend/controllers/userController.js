import User from '../models/User.js';
import Allergy from '../models/Allergy.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get user by ID (with allergies)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Get user's allergies
    const allergies = await Allergy.find({ user: req.params.id })
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        user,
        allergies,
        allergyCount: allergies.length
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          success: false,
          message: 'Email already in use' 
        });
      }
    }
    
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Change user password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide both old and new passwords' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 6 characters' 
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Verify old password
    const isMatch = await user.matchPassword(oldPassword);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
    
    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Password changed successfully' 
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    // Delete all user's allergies first
    await Allergy.deleteMany({ user: req.user.id });
    
    // Delete user
    const removed = await User.findByIdAndDelete(req.user.id);
    
    if (!removed) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get user dashboard stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total allergies
    const totalAllergies = await Allergy.countDocuments({ user: userId });
    
    // Get allergies by severity
    const severityCounts = await Allergy.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    // Get recent allergies
    const recentAllergies = await Allergy.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name severity createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        totalAllergies,
        severityCounts,
        recentAllergies
      }
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};
