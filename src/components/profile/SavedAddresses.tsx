"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import AddressForm from "./AddressForm";

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

// Định nghĩa các interface cho region thay vì sử dụng any
interface RegionWard {
  code: number | string;
  name: string;
}

interface RegionDistrict {
  code: number | string;
  name: string;
  wards: RegionWard[];
}

interface RegionProvince {
  code: number | string;
  name: string;
  districts: RegionDistrict[];
}

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  // Sử dụng kiểu RegionProvince[] thay vì any[]
  const [regionData, setRegionData] = useState<RegionProvince[]>([]);

  useEffect(() => {
    fetchAddresses();
    async function fetchRegionMapping() {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data = await res.json();
        setRegionData(data);
      } catch (_) {
        console.error("Error fetching region mapping:");
      }
    }
    fetchRegionMapping();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
      } else {
        toast.error("Không thể tải danh sách địa chỉ");
      }
    } catch (_) {
      toast.error("Có lỗi xảy ra khi tải địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xóa địa chỉ thành công");
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.error || "Không thể xóa địa chỉ");
      }
    } catch (_) {
      toast.error("Có lỗi xảy ra khi xóa địa chỉ");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const address = addresses.find((a) => a._id === id);
      if (!address) return;

      const response = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...address,
          isDefault: true,
        }),
      });

      if (response.ok) {
        toast.success("Đã đặt làm địa chỉ mặc định");
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.error || "Không thể cập nhật địa chỉ");
      }
    } catch (_) {
      toast.error("Có lỗi xảy ra khi cập nhật địa chỉ");
    }
  };

  const handleFormSubmit = async (formData: Omit<Address, "_id">) => {
    try {
      const url = editingAddress
        ? `/api/addresses/${editingAddress._id}`
        : "/api/addresses";

      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingAddress
            ? "Cập nhật địa chỉ thành công"
            : "Thêm địa chỉ thành công"
        );
        setShowForm(false);
        setEditingAddress(null);
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.error || "Không thể lưu địa chỉ");
      }
    } catch (_) {
      toast.error("Có lỗi xảy ra khi lưu địa chỉ");
    }
  };

  const getRegionName = (
    provinceCode: number | string,
    districtCode?: number | string,
    wardCode?: number | string
  ): string => {
    if (!regionData || regionData.length === 0)
      return `${wardCode || ""}, ${districtCode || ""}, ${provinceCode || ""}`;
    const province = regionData.find((p) => p.code == provinceCode);
    if (!province)
      return `${wardCode || ""}, ${districtCode || ""}, ${provinceCode || ""}`;
    let result = province.name;
    if (districtCode && province.districts && province.districts.length > 0) {
      const district = province.districts.find(
        (d: RegionDistrict) => d.code == districtCode
      );
      if (district) {
        result = `${district.name}, ${result}`;
        if (wardCode && district.wards && district.wards.length > 0) {
          const ward = district.wards.find(
            (w: RegionWard) => w.code == wardCode
          );
          if (ward) {
            result = `${ward.name}, ${result}`;
          }
        }
      }
    }
    return result;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Địa chỉ đã lưu</h3>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddressForm
            initialData={editingAddress || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`border rounded-lg p-4 ${
              address.isDefault ? "border-black" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{address.fullName}</h4>
                {address.isDefault && (
                  <span className="text-sm text-green-600">
                    Địa chỉ mặc định
                  </span>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-gray-600 hover:text-black"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <i className="fas fa-trash"></i>
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="text-gray-600 hover:text-black text-sm"
                  >
                    Đặt mặc định
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600">
              {address.phone}
              <br />
              {address.address}
              <br />
              {getRegionName(address.province, address.district, address.ward)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddresses;
