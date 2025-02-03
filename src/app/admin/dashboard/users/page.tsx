"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  avatar?: string;
  // Nếu có thêm các trường khác như trạng thái, bạn có thể bổ sung ở đây
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Định nghĩa giao diện cho Address (địa chỉ)
interface Address {
  _id: string;
  fullName?: string;
  phone?: string;
  address?: string;
  province: number | string;
  district: number | string;
  ward: number | string;
}

// Định nghĩa giao diện cho Order (đơn hàng)
interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
}

// Định nghĩa giao diện cho dữ liệu vùng (region) từ API
interface Ward {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  wards: Ward[];
}

interface Province {
  code: number;
  name: string;
  districts: District[];
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State cho địa chỉ và đơn hàng
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // State lưu dữ liệu mapping của tỉnh, huyện, xã
  const [regionData, setRegionData] = useState<Province[]>([]);
  useEffect(() => {
    async function fetchRegionMapping() {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data = await res.json();
        setRegionData(data);
      } catch {
        console.error("Error fetching region mapping:");
      }
    }
    fetchRegionMapping();
  }, []);

  // Hàm chuyển đổi mã tỉnh, huyện, xã thành tên
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
        (d: District) => d.code == districtCode
      );
      if (district) {
        result = `${district.name}, ${result}`;
        if (wardCode && district.wards && district.wards.length > 0) {
          const ward = district.wards.find((w: Ward) => w.code == wardCode);
          if (ward) {
            result = `${ward.name}, ${result}`;
          }
        }
      }
    }
    return result;
  };

  // Bọc hàm fetchUsers bằng useCallback để có dependency ổn định
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchTerm) queryParams.append("search", searchTerm);
      const response = await fetch(`/api/admin/users?${queryParams}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || "Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Khi selectedUser thay đổi, fetch thông tin địa chỉ và đơn hàng của user đó
  useEffect(() => {
    if (selectedUser) {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
          const res = await fetch(`/api/addresses?userId=${selectedUser._id}`);
          const data = await res.json();
          if (res.ok) {
            setAddresses(data.addresses);
          } else {
            toast.error(data.error || "Error fetching addresses");
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
          toast.error("Error fetching addresses");
        } finally {
          setLoadingAddresses(false);
        }
      };

      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch(
            `/api/admin/orders?userId=${selectedUser._id}`
          );
          const data = await res.json();
          if (res.ok) {
            setOrders(data.orders);
          } else {
            toast.error(data.error || "Error fetching orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Error fetching orders");
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchAddresses();
      fetchOrders();
    } else {
      setAddresses([]);
      setOrders([]);
    }
  }, [selectedUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Khi tìm kiếm, reset trang về 1
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý khách hàng</h1>

      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 border rounded-r-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày đăng ký
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Không có khách hàng nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{user._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Hiển thị {users.length} / {pagination.total} khách hàng
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Trước
          </button>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(pagination.totalPages, prev.page + 1),
              }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết khách hàng</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex flex-col items-center">
              {selectedUser.avatar ? (
                <Image
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <p className="font-semibold">{selectedUser.name}</p>
              <p>{selectedUser.email}</p>
              <p>{selectedUser.phone || "-"}</p>
              <p className="capitalize">{selectedUser.role}</p>
              <p>
                Đăng ký:{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}
              </p>

              <div className="mt-6 w-full">
                <h3 className="text-lg font-bold mb-2">Địa chỉ</h3>
                {loadingAddresses ? (
                  <p>Đang tải địa chỉ...</p>
                ) : addresses.length === 0 ? (
                  <p>Không có địa chỉ</p>
                ) : (
                  <ul className="space-y-2">
                    {addresses.map((addr: Address) => (
                      <li key={addr._id} className="border p-2 rounded">
                        <p>
                          <strong>{addr.fullName || "Tên người nhận"}</strong>
                        </p>
                        <p>{addr.phone}</p>
                        <p>{addr.address}</p>
                        <p>
                          {getRegionName(
                            addr.province,
                            addr.district,
                            addr.ward
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 w-full">
                <h3 className="text-lg font-bold mb-2">Đơn hàng</h3>
                {loadingOrders ? (
                  <p>Đang tải đơn hàng...</p>
                ) : orders.length === 0 ? (
                  <p>Không có đơn hàng</p>
                ) : (
                  <ul className="space-y-2">
                    {orders.map((order: Order) => (
                      <li key={order._id} className="border p-2 rounded">
                        <p>
                          <strong>Mã đơn hàng:</strong> #{order._id.slice(-6)}
                        </p>
                        <p>
                          <strong>Ngày:</strong>{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong>{" "}
                          {order.totalAmount ? order.totalAmount : "0"}₫
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
