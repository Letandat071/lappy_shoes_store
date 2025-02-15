import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHighlight: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category; 