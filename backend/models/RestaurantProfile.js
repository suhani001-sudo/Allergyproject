import mongoose from 'mongoose';

const restaurantProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    restaurantName: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String, // URL or base64 string
        default: null
    },
    // Address Information
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    // Business Information
    cuisineType: {
        type: String,
        enum: ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American', 'Mediterranean', 'Thai', 'French', 'Other', ''],
        default: ''
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    openingHours: {
        type: String,
        default: '09:00'
    },
    closingHours: {
        type: String,
        default: '22:00'
    },
    operatingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    // Additional Features
    features: {
        type: [String],
        default: []
    },
    // Social Media Links
    website: {
        type: String,
        trim: true
    },
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String
    },
    // Verification Status
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDate: {
        type: Date
    },
    // Ratings and Reviews
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    // Metadata
    memberSince: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Update lastUpdated on save
restaurantProfileSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Index for faster queries
restaurantProfileSchema.index({ restaurantName: 1 });
restaurantProfileSchema.index({ city: 1 });
restaurantProfileSchema.index({ cuisineType: 1 });

const RestaurantProfile = mongoose.model('RestaurantProfile', restaurantProfileSchema);

export default RestaurantProfile;
