import RestaurantProfile from '../models/RestaurantProfile.js';
import User from '../models/User.js';

// @desc    Get restaurant profile
// @route   GET /api/restaurant-profile
// @access  Private
export const getRestaurantProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        let profile = await RestaurantProfile.findOne({ userId });

        // If profile doesn't exist, create one with basic info from User model
        if (!profile) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            profile = await RestaurantProfile.create({
                userId: user._id,
                restaurantName: user.restaurantName || '',
                ownerName: user.name || '',
                email: user.email || ''
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get restaurant profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile',
            error: error.message
        });
    }
};

// @desc    Create or update restaurant profile
// @route   PUT /api/restaurant-profile
// @access  Private
export const updateRestaurantProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.userId;
        delete updateData.memberSince;
        delete updateData._id;
        delete updateData.isVerified;
        delete updateData.verificationDate;
        delete updateData.averageRating;
        delete updateData.totalReviews;

        let profile = await RestaurantProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            Object.assign(profile, updateData);
            await profile.save();
        } else {
            // Create new profile
            profile = await RestaurantProfile.create({
                userId,
                ...updateData
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurant profile updated successfully',
            data: profile
        });
    } catch (error) {
        console.error('Update restaurant profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile',
            error: error.message
        });
    }
};

// @desc    Update restaurant business hours
// @route   PUT /api/restaurant-profile/hours
// @access  Private
export const updateBusinessHours = async (req, res) => {
    try {
        const userId = req.user.id;
        const { openingHours, closingHours, operatingDays } = req.body;

        const profile = await RestaurantProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant profile not found'
            });
        }

        if (openingHours) profile.openingHours = openingHours;
        if (closingHours) profile.closingHours = closingHours;
        if (operatingDays) profile.operatingDays = operatingDays;

        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Business hours updated successfully',
            data: {
                openingHours: profile.openingHours,
                closingHours: profile.closingHours,
                operatingDays: profile.operatingDays
            }
        });
    } catch (error) {
        console.error('Update business hours error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating business hours',
            error: error.message
        });
    }
};

// @desc    Update social media links
// @route   PUT /api/restaurant-profile/social-media
// @access  Private
export const updateSocialMedia = async (req, res) => {
    try {
        const userId = req.user.id;
        const { facebook, instagram, twitter, website } = req.body;

        const profile = await RestaurantProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant profile not found'
            });
        }

        if (facebook !== undefined) profile.socialMedia.facebook = facebook;
        if (instagram !== undefined) profile.socialMedia.instagram = instagram;
        if (twitter !== undefined) profile.socialMedia.twitter = twitter;
        if (website !== undefined) profile.website = website;

        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Social media links updated successfully',
            data: {
                socialMedia: profile.socialMedia,
                website: profile.website
            }
        });
    } catch (error) {
        console.error('Update social media error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating social media',
            error: error.message
        });
    }
};

// @desc    Get all restaurant profiles (for admin or public listing)
// @route   GET /api/restaurant-profile/all
// @access  Public
export const getAllRestaurantProfiles = async (req, res) => {
    try {
        const { city, cuisineType, page = 1, limit = 10 } = req.query;

        const query = { accountStatus: 'Active' };
        
        if (city) query.city = new RegExp(city, 'i');
        if (cuisineType) query.cuisineType = cuisineType;

        const profiles = await RestaurantProfile.find(query)
            .select('-userId')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ averageRating: -1, createdAt: -1 });

        const count = await RestaurantProfile.countDocuments(query);

        res.status(200).json({
            success: true,
            data: profiles,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all restaurant profiles error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching restaurant profiles',
            error: error.message
        });
    }
};

// @desc    Get restaurant profile by ID (public view)
// @route   GET /api/restaurant-profile/:id
// @access  Public
export const getRestaurantProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await RestaurantProfile.findById(id)
            .select('-userId');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get restaurant profile by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching restaurant profile',
            error: error.message
        });
    }
};

// @desc    Delete restaurant profile
// @route   DELETE /api/restaurant-profile
// @access  Private
export const deleteRestaurantProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await RestaurantProfile.findOneAndDelete({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurant profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete restaurant profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting profile',
            error: error.message
        });
    }
};

// @desc    Update account status
// @route   PUT /api/restaurant-profile/status
// @access  Private
export const updateAccountStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { accountStatus } = req.body;

        if (!['Active', 'Inactive'].includes(accountStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid account status'
            });
        }

        const profile = await RestaurantProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant profile not found'
            });
        }

        profile.accountStatus = accountStatus;
        await profile.save();

        res.status(200).json({
            success: true,
            message: `Account status updated to ${accountStatus}`,
            data: { accountStatus: profile.accountStatus }
        });
    } catch (error) {
        console.error('Update account status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating account status',
            error: error.message
        });
    }
};
