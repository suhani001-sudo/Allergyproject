import mongoose from 'mongoose';

const allergySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Allergy = mongoose.model('Allergy', allergySchema);
export default Allergy;
