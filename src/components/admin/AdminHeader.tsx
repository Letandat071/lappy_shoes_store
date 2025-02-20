"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import UserAvatar from "../common/UserAvatar";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface AdminInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'user' | 'product' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'order':
      return 'fas fa-shopping-cart';
    case 'user':
      return 'fas fa-user';
    case 'product':
      return 'fas fa-box';
    default:
      return 'fas fa-bell';
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'order':
      return 'text-blue-500';
    case 'user':
      return 'text-green-500';
    case 'product':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
}

export default function AdminHeader() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();

      if (res.ok) {
        const newNotifications = data.notifications || [];
        const newUnreadCount = data.unreadCount || 0;

        // Kiểm tra xem có thông báo mới không
        if (notifications.length > 0 && newNotifications.length > notifications.length) {
          // Hiển thị toast
          toast.success("Bạn có thông báo mới!", {
            icon: "🔔"
          });
        }

        setNotifications(newNotifications);
        setUnreadCount(newUnreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [notifications.length]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        const data = await res.json();

        if (data.authenticated && data.admin) {
          setAdmin(data.admin);
        }
      } catch (error) {
        console.error("Failed to get admin info:", error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Fetch ngay lập tức
    fetchNotifications();

    // Thiết lập interval để fetch mỗi 10 giây
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Đánh dấu thông báo đã đọc
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: notification._id,
        }),
      });

      // Cập nhật state
      setNotifications(prev => 
        prev.filter(n => n._id !== notification._id)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Chuyển hướng nếu có link
      if (notification.link) {
        router.push(notification.link);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Không thể đánh dấu thông báo đã đọc");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.replace("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="w-full">
      <div className="relative z-0 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <div className="flex flex-1">
            {/* Tên admin và role */}
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">{admin?.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({admin?.role === "super_admin" ? "Super Admin" : "Admin"})
              </span>
            </div>
          </div>
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
            {/* Notifications dropdown */}
            <Menu as="div" className="relative flex-shrink-0">
              <Menu.Button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                    Thông báo mới
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        Không có thông báo mới
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Menu.Item key={notification._id}>
                          {({ active }) => (
                            <button
                              onClick={() => handleNotificationClick(notification)}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "w-full text-left px-4 py-3 border-b last:border-0"
                              )}
                            >
                              <div className="flex items-start">
                                <div className={`mr-3 mt-1 ${getNotificationColor(notification.type)}`}>
                                  <i className={`${getNotificationIcon(notification.type)} text-lg`}></i>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </p>
                                </div>
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      ))
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Profile dropdown */}
            <Menu as="div" className="relative flex-shrink-0">
              <Menu.Button className="flex rounded-full bg-white focus:outline-none">
                {admin && <UserAvatar name={admin.name} size={32} />}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Thông tin cá nhân
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Đăng xuất
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
