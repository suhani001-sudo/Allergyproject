import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Restaurant name is required'], 
      trim: true 
    },
    location: { 
      type: String, 
      trim: true,
      required: [true, 'Location is required']
    },
    address: { 
      type: String, 
      trim: true 
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    allergyFriendlyMenu: [
      {
        dishName: { 
          type: String, 
          required: true,
          trim: true
        },
        allergensFree: [{ 
          type: String,
          trim: true
        }],
        price: {
          type: Number
        },
        description: { 
          type: String,
          trim: true
        },
        category: {
          type: String,
          enum: ['appetizer', 'main', 'dessert', 'beverage', 'side'],
          default: 'main'
        }
      }
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    allergyRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
