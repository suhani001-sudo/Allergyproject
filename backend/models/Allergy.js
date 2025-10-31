import mongoose from 'mongoose';

const allergySchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    name: { 
      type: String, 
      required: [true, 'Allergy name is required'], 
      trim: true 
    },
    severity: { 
      type: String, 
      enum: ['low', 'moderate', 'high', 'severe'], 
      default: 'moderate' 
    },
    symptoms: [{ 
      type: String, 
      trim: true 
    }],
    triggers: [{ 
      type: String, 
      trim: true 
    }],
    notes: { 
      type: String, 
      trim: true 
    },
    diagnosedDate: {
      type: Date
    },
    lastReaction: {
      type: Date
    }
  },
  { timestamps: true }
);

const Allergy = mongoose.model('Allergy', allergySchema);
export default Allergy;
