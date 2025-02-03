"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import { toast } from 'react-hot-toast'; // Đã xóa vì không sử dụng
import Swal from "sweetalert2";
import { useImageUpload } from "@/lib/cloudinary";
import { useAuth } from "@/contexts/AuthContext";

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
    avatar: "",
  });

  // Fetch user data khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("1. Bắt đầu fetch user data");
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        console.log("2. Data nhận được từ API /me:", data);

        if (data.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            avatar: data.user.avatar || "https://i.pravatar.cc/100?img=2",
          });
          console.log("3. Form data được set:", data.user);
        }
      } catch (error) {
        console.error("4. Lỗi khi fetch user data:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải thông tin người dùng",
          confirmButtonColor: "#000",
        });
      }
    };
    fetchUserData();
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      console.log("1. Bắt đầu upload ảnh");
      const imageUrl = await uploadImage(file);
      console.log("2. Upload thành công, URL:", imageUrl);

      // Chỉ gửi avatar lên để update
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: imageUrl }),
      });

      const data = await response.json();
      console.log("3. Response từ server:", data);

      if (!response.ok) {
        throw new Error(data.error || "Không thể cập nhật avatar");
      }

      // Update local state và context sau khi server xác nhận thành công
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      if (user) {
        updateUser({ ...user, avatar: imageUrl });
      }

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật avatar thành công",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });
    } catch (error: unknown) {
      console.error("4. Lỗi khi update avatar:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Đã có lỗi xảy ra";
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMsg,
        confirmButtonColor: "#000",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("5. Bắt đầu submit form với data:", formData);

    try {
      console.log("6. Gửi request update");
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("7. Response từ API update:", data);

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      // Update user trong context
      updateUser(data.user);

      console.log("8. Update thành công");
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật thông tin thành công",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });
    } catch (error: unknown) {
      console.error("9. Lỗi khi update:", error);
      const errorMsg = error instanceof Error ? error.message : "Có lỗi xảy ra";
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMsg,
        confirmButtonColor: "#000",
      });
    } finally {
      setIsLoading(false);
      console.log("10. Kết thúc quá trình update");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("11. Form field change:", name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              src={formData.avatar}
              alt="User avatar"
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
