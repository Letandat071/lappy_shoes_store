"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Feature {
  _id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Fetch features
  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/admin/features");
      const data = await response.json();
      if (data.features) {
        setFeatures(data.features);
      }
    } catch {
      toast.error("Lỗi khi tải tính năng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên tính năng");
      return;
    }

    try {
      const url = editingFeature
        ? "/api/admin/features"
        : "/api/admin/features";
      const method = editingFeature ? "PUT" : "POST";
      const body = editingFeature
        ? { ...formData, id: editingFeature._id }
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
          editingFeature
            ? "Cập nhật tính năng thành công"
            : "Thêm tính năng thành công"
        );
        fetchFeatures();
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
    if (window.confirm("Bạn có chắc muốn xóa tính năng này?")) {
      try {
        const response = await fetch(`/api/admin/features?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Xóa tính năng thành công");
          fetchFeatures();
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
  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description,
      icon: feature.icon,
    });
    setModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
    });
    setEditingFeature(null);
  };

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tính năng</h1>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Thêm tính năng
        </button>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div
            key={feature._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              {feature.icon && (
                <span className="text-2xl mr-2">{feature.icon}</span>
              )}
              <h3 className="font-semibold text-lg">{feature.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(feature)}
                className="text-blue-500 hover:text-blue-700"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(feature._id)}
                className="text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingFeature ? "Sửa tính năng" : "Thêm tính năng mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">
                  Tên tính năng <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2">Mô tả (không bắt buộc)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Icon (không bắt buộc)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="VD: 🚀 hoặc fa-star"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bạn có thể sử dụng emoji hoặc class icon từ Font Awesome
                </p>
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingFeature ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
