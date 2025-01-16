"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/lib/cloudinary';

interface ImageUploaderProps {
  currentImage: string;
  onImageUpload: (url: string) => void;
  onError: (error: string) => void;
}

export default function ImageUploader({ currentImage, onImageUpload, onError }: ImageUploaderProps) {
  const { uploadImage } = useImageUpload();
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      if (!imageUrl) throw new Error('Failed to get image URL');
      
      console.log('Uploaded image URL:', imageUrl);
      onImageUpload(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      onError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Hình ảnh Banner</label>
      <div className="mt-1 flex items-center space-x-4">
        {currentImage && (
          <div className="relative h-32 w-32">
            <Image 
              src={currentImage}
              alt="Preview"
              className="object-cover rounded-md"
              fill
              sizes="128px"
            />
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {uploading && (
            <p className="mt-2 text-sm text-gray-500">Đang tải ảnh lên...</p>
          )}
        </div>
      </div>
    </div>
  );
} 