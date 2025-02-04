"use client";

import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import UserAvatar from "../common/UserAvatar";

interface AdminInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminHeader() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);

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
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white">
                  5
                </span>
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
                  <div className="px-4 py-2 text-sm text-gray-900">
                    Thông báo mới
                  </div>
                  {/* Add notification items here */}
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
