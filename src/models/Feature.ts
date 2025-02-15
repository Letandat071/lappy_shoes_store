import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  icon: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHighlight: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Feature = mongoose.models.Feature || mongoose.model('Feature', featureSchema);

export default Feature; 