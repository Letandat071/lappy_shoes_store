import mongoose from 'mongoose';

interface IAdmin {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'pending' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Middleware để cập nhật updatedAt trước khi save
adminSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin; 