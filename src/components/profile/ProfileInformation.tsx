"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useImageUpload } from "@/lib/cloudinary";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

const ProfileInformation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useImageUpload();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        address: "",
      });

      // Fetch additional user data
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/auth/me");
          const data = await response.json();

          if (data.user) {
            setFormData(prev => ({
              ...prev,
              phone: data.user.phone || "",
              address: data.user.address || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Không thể tải thông tin người dùng");
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    try {
      setIsLoading(true);
      const imageUrl = await uploadImage(e.target.files[0]);
      
      if (imageUrl) {
        await updateUser({ image: imageUrl });
        toast.success("Cập nhật ảnh đại diện thành công");
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error("Không thể cập nhật ảnh đại diện");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      // Update user trong context
      updateUser(data.user);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Thông tin cá nhân</h3>

      {/* Avatar Section */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Image
              src={user.image || '/images/default-avatar.png'}
              alt={user.name || 'Avatar'}
              fill
              className="object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
              <span className="text-white opacity-0 group-hover:opacity-100">
                Thay đổi
              </span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInformation;
