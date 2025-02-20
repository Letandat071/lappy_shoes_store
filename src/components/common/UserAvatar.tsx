"use client";

import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, image, size = 32 }) => {
  // Hàm lấy chữ cái đầu của từng từ trong tên
  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      // Lấy chữ cái đầu của từ đầu tiên và từ cuối cùng
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    // Nếu chỉ có một từ, lấy 2 chữ cái đầu hoặc 1 chữ cái nếu chỉ có 1 ký tự
    return name.slice(0, Math.min(2, name.length)).toUpperCase();
  };

  // Hàm tạo độ sáng ngẫu nhiên nhưng ổn định cho mỗi tên
  const getGrayScaleFromName = (name: string) => {
    const shades = [
      'bg-gray-700',  // Đậm nhất
      'bg-gray-600',
      'bg-gray-800',
      'bg-gray-900',  // Gần như đen
      'bg-black',     // Đen hoàn toàn
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return shades[index % shades.length];
  };

  // Kiểm tra xem image có tồn tại và hợp lệ không
  const hasValidImage = image && image !== 'null' && image !== 'undefined' && image !== '';

  if (hasValidImage) {
    return (
      <div 
        className="relative rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center text-white font-medium ${getGrayScaleFromName(name)}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar; 