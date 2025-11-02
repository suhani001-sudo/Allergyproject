import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/user-profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        let profile = await UserProfile.findOne({ userId });

        // If profile doesn't exist, create one with basic info from User model
        if (!profile) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            profile = await UserProfile.create({
                userId: user._id,
                fullName: user.name || '',
                email: user.email || '',
                username: user.email ? user.email.split('@')[0] : ''
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile',
            error: error.message
        });
    }
};

// @desc    Create or update user profile
// @route   PUT /api/user-profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.userId;
        delete updateData.memberSince;
        delete updateData._id;

        let profile = await UserProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            Object.assign(profile, updateData);
            await profile.save();
        } else {
            // Create new profile
            profile = await UserProfile.create({
                userId,
                ...updateData
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile',
            error: error.message
        });
    }
};

// @desc    Add allergy to user profile
// @route   POST /api/user-profile/allergies
// @access  Private
export const addAllergy = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, icon, severity } = req.body;

        if (!name || !severity) {
            return res.status(400).json({
                success: false,
                message: 'Allergy name and severity are required'
            });
        }

        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Check if allergy already exists
        const exists = profile.allergies.some(a => 
            a.name.toLowerCase() === name.toLowerCase()
        );

        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Allergy already exists in profile'
            });
        }

        profile.allergies.push({ name, icon: icon || '⚠️', severity });
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Allergy added successfully',
            data: profile.allergies
        });
    } catch (error) {
        console.error('Add allergy error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding allergy',
            error: error.message
        });
    }
};

// @desc    Remove allergy from user profile
// @route   DELETE /api/user-profile/allergies/:allergyId
// @access  Private
export const removeAllergy = async (req, res) => {
    try {
        const userId = req.user.id;
        const { allergyId } = req.params;

        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        profile.allergies = profile.allergies.filter(
            a => a._id.toString() !== allergyId
        );
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Allergy removed successfully',
            data: profile.allergies
        });
    } catch (error) {
        console.error('Remove allergy error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing allergy',
            error: error.message
        });
    }
};

// @desc    Add favorite food to user profile
// @route   POST /api/user-profile/favorite-foods
// @access  Private
export const addFavoriteFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const { food, icon, alternative } = req.body;

        if (!food || !alternative) {
            return res.status(400).json({
                success: false,
                message: 'Food and alternative are required'
            });
        }

        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        profile.favoriteFoods.push({ food, icon: icon || '🍽️', alternative });
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Favorite food added successfully',
            data: profile.favoriteFoods
        });
    } catch (error) {
        console.error('Add favorite food error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding favorite food',
            error: error.message
        });
    }
};

// @desc    Remove favorite food from user profile
// @route   DELETE /api/user-profile/favorite-foods/:foodId
// @access  Private
export const removeFavoriteFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodId } = req.params;

        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        profile.favoriteFoods = profile.favoriteFoods.filter(
            f => f._id.toString() !== foodId
        );
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Favorite food removed successfully',
            data: profile.favoriteFoods
        });
    } catch (error) {
        console.error('Remove favorite food error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing favorite food',
            error: error.message
        });
    }
};

// @desc    Delete user profile
// @route   DELETE /api/user-profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await UserProfile.findOneAndDelete({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting profile',
            error: error.message
        });
    }
};
