import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,  // bật lại unique
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [function(this: any) {
      // Chỉ yêu cầu password khi không phải OAuth
      return !this.googleId;
    }, 'Vui lòng nhập mật khẩu'],
    minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
  },
  googleId: {
    type: String,
    sparse: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
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
  collection: 'users' // Chỉ định collection name
});

// Middleware để cập nhật updatedAt trước khi save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Hash password trước khi lưu nếu có thay đổi
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 