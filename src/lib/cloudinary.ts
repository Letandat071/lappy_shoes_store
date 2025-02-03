interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'shoe-store-unsigned';

export const useImageUpload = () => {
  const uploadImage = async (file: File): Promise<string> => {
    try {
      if (!CLOUD_NAME) {
        throw new Error('Missing Cloudinary configuration');
      }

      console.log('🚀 Bắt đầu quá trình upload ảnh');
      console.log('📁 Thông tin file:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        lastModified: new Date(file.lastModified).toISOString()
      });

      // Validate file
      if (!file.type.startsWith('image/')) {
        console.error('❌ Loại file không hợp lệ:', file.type);
        throw new Error('Chỉ chấp nhận file ảnh');
      }

      if (file.size > 10 * 1024 * 1024) {
        console.error('❌ File quá lớn:', `${(file.size / 1024 / 1024).toFixed(2)}MB`);
        throw new Error('Kích thước file không được vượt quá 10MB');
      }

      console.log('✅ File hợp lệ, bắt đầu chuyển đổi sang base64');

      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log('✅ Chuyển đổi base64 thành công');
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          console.error('❌ Lỗi chuyển đổi base64:', error);
          reject(error);
        };
      });

      // Extract base64 content
      const base64Content = base64Data.split(',')[1];
      console.log('✅ Đã tách nội dung base64');

      console.log('📝 Chuẩn bị form data với config:', {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('cloud_name', CLOUD_NAME);

      console.log('🌐 Bắt đầu gửi request đến Cloudinary API');
      console.log('🔗 URL:', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(30000) // 30 seconds
        }
      );

      console.log('📥 Nhận response từ Cloudinary');
      console.log('📊 Status:', response.status, response.statusText);
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);

      if (!response.ok) {
        console.error('❌ Upload thất bại');
        console.error('❌ Status:', response.status, response.statusText);
        console.error('❌ Response:', responseText);
        throw new Error('Không thể tải ảnh lên. Vui lòng thử lại');
      }

      try {
        const data: CloudinaryResponse = JSON.parse(responseText);
        console.log('✨ Parse JSON thành công:', data);
        console.log('🎉 Upload thành công!');
        console.log('🔗 URL ảnh:', data.secure_url);
        return data.secure_url;
      } catch (parseError) {
        console.error('❌ Lỗi parse JSON:', parseError);
        console.error('❌ Response text:', responseText);
        throw new Error('Lỗi xử lý response từ server');
      }

    } catch (error) {
      console.error('❌ Lỗi upload:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      throw new Error('Không thể tải ảnh lên. Vui lòng thử lại');
    }
  };

  return { uploadImage };
} 