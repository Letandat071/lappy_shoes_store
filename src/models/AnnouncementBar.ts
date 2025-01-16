import mongoose from 'mongoose';

const announcementBarSchema = new mongoose.Schema({
  message: { type: String, required: true },
  link: { type: String },
  backgroundColor: { type: String, default: '#000000' },
  textColor: { type: String, default: '#FFFFFF' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.AnnouncementBar || mongoose.model('AnnouncementBar', announcementBarSchema); 