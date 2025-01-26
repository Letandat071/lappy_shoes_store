import mongoose from 'mongoose';

export const PRODUCT_STATUS = {
  IN_STOCK: 'in-stock',
  OUT_OF_STOCK: 'out-of-stock',
  COMING_SOON: 'coming-soon'
} as const;

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  color: String,
  version: String
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number
  },
  images: [imageSchema],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  features: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature'
  }],
  sizes: [sizeSchema],
  colors: [String],
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.IN_STOCK
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  brand: {
    type: String,
    required: true
  },
  targetAudience: [{
    type: String,
    enum: ['men', 'women', 'kids', 'unisex']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Tính toán totalQuantity trước khi lưu
productSchema.pre('save', function(next) {
  if (this.sizes) {
    this.totalQuantity = this.sizes.reduce((total, size) => total + size.quantity, 0);
  }
  next();
});

// Tính toán discount trước khi lưu
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Tự động cập nhật status dựa trên totalQuantity
productSchema.pre('save', function(next) {
  if (this.totalQuantity === 0) {
    this.status = PRODUCT_STATUS.OUT_OF_STOCK;
  } else if (this.status === PRODUCT_STATUS.OUT_OF_STOCK && this.totalQuantity > 0) {
    this.status = PRODUCT_STATUS.IN_STOCK;
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 