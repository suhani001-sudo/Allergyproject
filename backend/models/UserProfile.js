import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
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
    // Personal Information
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    dateOfBirth: {
        type: Date
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
    // Dietary Preferences
    dietaryPreference: {
        type: String,
        enum: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Pescatarian', 'Keto', ''],
        default: ''
    },
    allergySensitivity: {
        type: String,
        enum: ['Low', 'Medium', 'High', ''],
        default: 'Medium'
    },
    favoriteCuisine: {
        type: String,
        trim: true
    },
    // Allergies
    allergies: [{
        name: String,
        icon: String,
        severity: {
            type: String,
            enum: ['Mild', 'Moderate', 'Severe']
        }
    }],
    // Favorite Foods
    favoriteFoods: [{
        food: String,
        icon: String,
        alternative: String
    }],
    // Privacy Settings
    showEmailPublic: {
        type: Boolean,
        default: false
    },
    // Metadata
    memberSince: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update lastUpdated on save
userProfileSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
