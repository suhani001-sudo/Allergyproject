import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    safeDishes: [
      {
        dishName: { type: String, required: true },
        allergensFree: [{ type: String }],
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
