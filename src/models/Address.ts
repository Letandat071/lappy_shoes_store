import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Vui lòng nhập họ tên']
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại']
  },
  province: {
    type: String,
    required: [true, 'Vui lòng chọn tỉnh/thành phố']
  },
  district: {
    type: String,
    required: [true, 'Vui lòng chọn quận/huyện']
  },
  ward: {
    type: String,
    required: [true, 'Vui lòng chọn phường/xã']
  },
  address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ cụ thể']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Đảm bảo chỉ có một địa chỉ mặc định cho mỗi user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    const Address = mongoose.model('Address');
    await Address.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address; 