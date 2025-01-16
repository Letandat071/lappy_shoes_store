import mongoose from 'mongoose';

const heroBannerSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: [true, 'Banner image is required'] 
  },
  event: { 
    type: String, 
    required: [true, 'Event text is required'],
    trim: true
  },
  titleLine1: { 
    type: String, 
    required: [true, 'First title line is required'],
    trim: true
  },
  titleLine2: { 
    type: String, 
    required: [true, 'Second title line is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true
  },
  styles: {
    backgroundColor: {
      from: { type: String, default: '#111827' },
      via: { type: String, default: '#000000' },
      to: { type: String, default: '#111827' }
    },
    eventBadge: {
      textColor: { type: String, default: '#FCD34D' },
      backgroundColor: { type: String, default: 'rgba(251, 191, 36, 0.1)' }
    },
    title: {
      glowColor: { type: String, default: '#FCD34D' },
      gradientColors: {
        from: { type: String, default: '#FCD34D' },
        via: { type: String, default: '#EF4444' },
        to: { type: String, default: '#9333EA' }
      }
    },
    description: {
      textColor: { type: String, default: '#D1D5DB' }
    },
    buttons: {
      primary: {
        textColor: { type: String, default: '#000000' },
        backgroundColor: { type: String, default: '#FFFFFF' },
        hoverBackgroundColor: { type: String, default: '#FCD34D' }
      },
      secondary: {
        textColor: { type: String, default: '#FFFFFF' },
        borderColor: { type: String, default: '#FFFFFF' },
        hoverBackgroundColor: { type: String, default: '#FFFFFF' },
        hoverTextColor: { type: String, default: '#000000' }
      }
    },
    stats: {
      valueColor: { type: String, default: '#FFFFFF' },
      labelColor: { type: String, default: '#9CA3AF' }
    },
    glowEffects: {
      topLeft: {
        color: { type: String, default: '#FCD34D' },
        opacity: { type: Number, default: 0.5 },
        blur: { type: Number, default: 100 }
      },
      bottomRight: {
        color: { type: String, default: '#9333EA' },
        opacity: { type: Number, default: 0.5 },
        blur: { type: Number, default: 100 }
      }
    }
  },
  highlightedWords: [{
    text: { type: String, required: true },
    color: { type: String, required: true }
  }],
  stats: [{
    value: { type: String, required: true },
    label: { type: String, required: true }
  }],
  features: [{
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconBgColor: { type: String, required: true }
  }],
  overlayOpacity: {
    type: Number,
    default: 0.2
  },
  particlesEnabled: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

const HeroBanner = mongoose.models.HeroBanner || mongoose.model('HeroBanner', heroBannerSchema);

export default HeroBanner; 