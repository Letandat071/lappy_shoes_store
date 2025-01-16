import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  brand: {
    logo: { type: String, required: true },
    description: { type: String, required: true }
  },
  talk: {
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  contact: {
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Footer || mongoose.model('Footer', footerSchema); 