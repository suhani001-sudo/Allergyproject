import mongoose from 'mongoose';

const restaurantMenuSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    ingredients: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'restaurants', // Explicitly use your existing collection name
  }
);

// Connect to 'test' database and 'restaurants' collection
const RestaurantMenu = mongoose.model('RestaurantMenu', restaurantMenuSchema);

export default RestaurantMenu;
