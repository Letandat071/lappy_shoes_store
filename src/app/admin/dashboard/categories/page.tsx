"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useImageUpload } from "@/lib/cloudinary";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const { uploadImage } = useImageUpload();

  // State để kiểm soát việc render (để tránh lỗi Hydration)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  // Xử lý upload ảnh
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Tải ảnh lên thành công");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi khi tải ảnh lên");
      }
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi khi tải danh mục");
      }
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory
        ? "/api/admin/categories"
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";
      // Nếu đang chỉnh sửa thì gửi kèm cả id
      const body = editingCategory
        ? { ...formData, id: editingCategory._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          editingCategory
            ? "Cập nhật danh mục thành công"
            : "Thêm danh mục thành công"
        );
        fetchCategories();
        setModalOpen(false);
        resetForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã có lỗi xảy ra");
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        const response = await fetch(`/api/admin/categories?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Xóa danh mục thành công");
          fetchCategories();
        } else {
          throw new Error(data.error);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Đã có lỗi xảy ra");
        }
      }
    }
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setEditingCategory(null);
  };

  // Nếu chưa mount hoặc đang tải dữ liệu, hiển thị giao diện loading
  if (!mounted || loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm">
              <div className="h-40 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="flex justify-end space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Thêm danh mục
        </button>
      </div>

      {/* Danh sách danh mục */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Ảnh của danh mục */}
            <div className="relative h-40 mb-4">
              <Image
                src={category.image || "/images/placeholder.jpg"}
                alt={category.name}
                fill
                className="object-cover rounded-lg"
                unoptimized={true}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "/images/placeholder.jpg";
                }}
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-500 hover:text-blue-700"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm/sửa danh mục */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  rows={3}
                />
              </div>

              {/* Phần tải ảnh */}
              <div className="mb-4">
                <label className="block mb-2">Hình ảnh</label>
                <div className="space-y-2">
                  {formData.image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={formData.image}
                        alt="Category preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`block w-full text-center py-2 px-4 border-2 border-dashed rounded-lg cursor-pointer ${
                      uploading
                        ? "bg-gray-100 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Đang tải lên...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-cloud-upload-alt mr-2"></i>
                        {formData.image ? "Thay đổi ảnh" : "Tải ảnh lên"}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {editingCategory ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
