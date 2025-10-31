import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['appetizer', 'main', 'dessert', 'beverage', 'side', 'special'],
      lowercase: true,
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
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
menuSchema.index({ restaurantName: 1 });
menuSchema.index({ category: 1 });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
