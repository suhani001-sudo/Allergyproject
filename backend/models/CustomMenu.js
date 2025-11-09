import mongoose from 'mongoose';

const customMenuSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=Menu+Item',
    },
    allergenInfo: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      default: [],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    isCustom: {
      type: Boolean,
      default: true, // Always true for custom items
    },
    createdBy: {
      type: String,
      default: 'restaurant', // Can be 'restaurant' or user ID
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
customMenuSchema.index({ restaurantName: 1 });
customMenuSchema.index({ category: 1 });
customMenuSchema.index({ createdBy: 1 });

const CustomMenu = mongoose.model('CustomMenu', customMenuSchema);

export default CustomMenu;
