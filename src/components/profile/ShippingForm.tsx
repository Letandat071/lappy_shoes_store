"use client";

import React, { useState, useEffect } from "react";

export interface ShippingFormData {
  fullName: string;
  phone: string;
  addressDetail: string;
  province: string;
  district: string;
  ward: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  initialData?: ShippingFormData;
}

// Định nghĩa kiểu cho region thay vì sử dụng any
interface RegionWard {
  code: string | number;
  name: string;
}

interface RegionDistrict {
  code: string | number;
  name: string;
  wards: RegionWard[];
}

interface RegionProvince {
  code: string | number;
  name: string;
  districts: RegionDistrict[];
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<ShippingFormData>(
    initialData || {
      fullName: "",
      phone: "",
      addressDetail: "",
      province: "",
      district: "",
      ward: "",
    }
  );

  const [regionData, setRegionData] = useState<RegionProvince[]>([]);
  const [districtData, setDistrictData] = useState<RegionDistrict[]>([]);
  const [wardData, setWardData] = useState<RegionWard[]>([]);

  // Fetch danh sách tỉnh với depth=2
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data = await res.json();
        setRegionData(data);
      } catch (error: unknown) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchProvinces();
  }, []);

  // Cập nhật danh sách quận/huyện khi Tỉnh/Thành phố thay đổi
  useEffect(() => {
    if (formData.province) {
      const province = regionData.find((p) => p.code == formData.province);
      if (province) {
        setDistrictData(province.districts || []);
      } else {
        setDistrictData([]);
      }
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));
      setWardData([]);
    } else {
      setDistrictData([]);
      setWardData([]);
    }
  }, [formData.province, regionData]);

  // Cập nhật danh sách Phường/Xã khi Quận/Huyện thay đổi
  useEffect(() => {
    if (formData.district) {
      const district = districtData.find(
        (d: RegionDistrict) => d.code == formData.district
      );
      if (district) {
        setWardData(district.wards || []);
      } else {
        setWardData([]);
      }
      setFormData((prev) => ({ ...prev, ward: "" }));
    } else {
      setWardData([]);
    }
  }, [formData.district, districtData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Helper hiển thị tên địa danh hoàn chỉnh
  const getRegionName = (
    provinceCode: number | string,
    districtCode?: number | string,
    wardCode?: number | string
  ): string => {
    if (!regionData || regionData.length === 0) return "";
    const province = regionData.find((p) => p.code == provinceCode);
    if (!province) return "";
    let result = province.name;
    if (districtCode) {
      const district = province.districts.find(
        (d: RegionDistrict) => d.code == districtCode
      );
      if (district) {
        result = `${district.name}, ${result}`;
        if (wardCode) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Họ và tên</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Địa chỉ chi tiết</label>
        <input
          type="text"
          name="addressDetail"
          value={formData.addressDetail}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Tỉnh/Thành phố</label>
        <select
          name="province"
          value={formData.province}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {regionData.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Quận/Huyện</label>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          disabled={!districtData.length}
        >
          <option value="">Chọn quận/huyện</option>
          {districtData.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Phường/Xã</label>
        <select
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          disabled={!wardData.length}
        >
          <option value="">Chọn phường/xã</option>
          {wardData.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
      {/* Hiển thị preview địa chỉ */}
      <div className="mt-4 p-3 border rounded">
        <h4 className="font-semibold mb-2">Địa chỉ hiển thị</h4>
        <p>
          {formData.addressDetail}
          {(formData.province || formData.district || formData.ward) &&
            `, ${getRegionName(
              formData.province,
              formData.district,
              formData.ward
            )}`}
        </p>
      </div>
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Gửi
      </button>
    </form>
  );
};

export default ShippingForm;
