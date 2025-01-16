import mongoose from 'mongoose';

interface Review {
  rating: number;
  comment?: string;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
}

interface IProduct {
  name: string;
  images: string[];
  price: number;
  reviews: Review[];
  averageRating: number;
  category: mongoose.Types.ObjectId;
  features: mongoose.Types.ObjectId[];
  targetAudience: string;
  sizes: { size: string; quantity: number }[];
  brand: string;
  colors: string[];
  totalQuantity: number;
  status: 'in-stock' | 'out-of-stock' | 'coming-soon';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IProductMethods {
  calculateAverageRating(): number;
  checkStock(size: string, quantity: number): boolean;
}

type ProductDocument = mongoose.Document & IProduct & IProductMethods;
type ProductModel = mongoose.Model<ProductDocument>;

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema<ProductDocument>({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }],
  targetAudience: { type: String, required: true },
  sizes: [{
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  brand: { type: String, required: true },
  colors: [{ type: String, required: true }],
  totalQuantity: { type: Number, required: true },
  status: { type: String, enum: ['in-stock', 'out-of-stock', 'coming-soon'], default: 'in-stock' },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

productSchema.methods.calculateAverageRating = function(this: ProductDocument) {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
  this.averageRating = sum / this.reviews.length;
  return this.averageRating;
};

productSchema.methods.checkStock = function(this: ProductDocument, size: string, quantity: number) {
  const sizeItem = this.sizes.find((s: { size: string; quantity: number }) => s.size === size);
  if (!sizeItem) return false;
  return sizeItem.quantity >= quantity;
};

productSchema.pre('save', function(this: ProductDocument, next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

export default mongoose.models.Product || mongoose.model<ProductDocument>('Product', productSchema); 