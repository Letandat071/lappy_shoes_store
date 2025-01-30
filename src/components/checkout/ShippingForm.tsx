"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault: boolean;
}

interface ShippingFormProps {
  onSubmit: (address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  }) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onSubmit }) => {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/addresses');
        const data = await response.json();
        if (response.ok) {
          setSavedAddresses(data.addresses);
          // Tự động chọn địa chỉ mặc định nếu có
          const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
            handleAddressSelect(defaultAddress);
          } else {
            setUseNewAddress(true);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setUseNewAddress(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.province) {
        setDistricts([]);
        return;
      }
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`);
        const data = await response.json();
        setDistricts(data.districts);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, [formData.province]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.district) {
        setWards([]);
        return;
      }
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`);
        const data = await response.json();
        setWards(data.wards);
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };
    fetchWards();
  }, [formData.district]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset dependent fields
    if (name === 'province') {
      setFormData(prev => ({
        ...prev,
        district: '',
        ward: ''
      }));
    } else if (name === 'district') {
      setFormData(prev => ({
        ...prev,
        ward: ''
      }));
    }
  };

  const handleAddressSelect = (address: Address) => {
    setFormData({
      ...formData,
      fullName: address.fullName,
      phone: address.phone,
      province: address.province,
      district: address.district,
      ward: address.ward,
      address: address.address
    });

    // Gọi onSubmit để cập nhật địa chỉ giao hàng
    onSubmit({
      fullName: address.fullName,
      phone: address.phone,
      address: `${address.address}, ${address.ward}, ${address.district}`,
      city: address.province
    });
  };

  // Validate and submit form
  useEffect(() => {
    const { fullName, phone, province, district, ward, address } = formData;
    if (fullName && phone && province && district && ward && address) {
      onSubmit({
        fullName,
        phone,
        address: `${address}, ${ward}, ${district}`,
        city: province
      });
    }
  }, [formData, onSubmit]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Địa chỉ đã lưu</h3>
            <button
              type="button"
              onClick={() => setUseNewAddress(!useNewAddress)}
              className="text-blue-600 hover:underline"
            >
              {useNewAddress ? 'Chọn địa chỉ đã lưu' : 'Thêm địa chỉ mới'}
            </button>
          </div>

          {!useNewAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {savedAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddressId === address._id
                      ? 'border-black bg-gray-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => {
                    setSelectedAddressId(address._id);
                    handleAddressSelect(address);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{address.fullName}</h4>
                      {address.isDefault && (
                        <span className="text-sm text-green-600">Địa chỉ mặc định</span>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === address._id}
                      onChange={() => {
                        setSelectedAddressId(address._id);
                        handleAddressSelect(address);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {address.phone}<br />
                    {address.address}<br />
                    {address.ward}, {address.district}<br />
                    {address.province}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Address Form */}
      {useNewAddress && (
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912345678"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố</label>
              <select 
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện</label>
              <select 
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled={!formData.province}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(district => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã</label>
              <select 
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled={!formData.district}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map(ward => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cụ thể</label>
              <input 
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea 
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShippingForm; 