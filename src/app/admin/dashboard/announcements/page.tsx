'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Announcement {
  _id: string;
  message: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    message: '',
    link: '',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      if (res.ok) {
         setAnnouncements(data.announcements);
      } else {
         toast.error(data.error || "Lỗi khi tải thông báo");
      }
    } catch (error) {
       console.error(error);
       toast.error("Lỗi khi tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if(editingAnnouncement) {
         // Cập nhật thông báo
         res = await fetch(`/api/admin/announcements`, {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              announcementId: editingAnnouncement._id,
              ...formData
           })
         });
      } else {
         // Tạo thông báo mới
         res = await fetch('/api/admin/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
         });
      }
      const data = await res.json();
      if(res.ok) {
         toast.success(editingAnnouncement ? "Cập nhật thông báo thành công" : "Tạo thông báo thành công");
         setFormData({
            message: '',
            link: '',
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
            isActive: true,
            startDate: '',
            endDate: '',
         });
         setEditingAnnouncement(null);
         fetchAnnouncements();
      } else {
         toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch(error) {
       console.error(error);
       toast.error("Có lỗi xảy ra");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      message: announcement.message,
      link: announcement.link || '',
      backgroundColor: announcement.backgroundColor,
      textColor: announcement.textColor,
      isActive: announcement.isActive,
      startDate: announcement.startDate ? announcement.startDate.split('T')[0] : '',
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : '',
    });
  };

  const handleDelete = async (announcementId: string) => {
    if(confirm("Bạn có chắc muốn xóa thông báo này?")) {
       try {
         const res = await fetch('/api/admin/announcements', {
           method: 'DELETE',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ announcementId })
         });
         const data = await res.json();
         if(res.ok) {
            toast.success("Xóa thông báo thành công");
            fetchAnnouncements();
         } else {
            toast.error(data.error || "Có lỗi xảy ra");
         }
       } catch(error) {
         console.error(error);
         toast.error("Có lỗi xảy ra");
       }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý thông báo</h1>

      <div className="mb-6">
         <h2 className="text-xl font-semibold mb-4">{editingAnnouncement ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung thông báo</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link (tuỳ chọn)</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Màu nền</label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="mt-1 w-full p-1 border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Màu chữ</label>
                <input
                  type="color"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleChange}
                  className="mt-1 w-full p-1 border rounded-md"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bắt đầu từ</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md"
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Kích hoạt</label>
              </div>
            </div>
            <div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editingAnnouncement ? "Cập nhật" : "Tạo thông báo"}
              </button>
              {editingAnnouncement && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setFormData({
                      message: '',
                      link: '',
                      backgroundColor: '#000000',
                      textColor: '#FFFFFF',
                      isActive: true,
                      startDate: '',
                      endDate: '',
                    });
                  }}
                  className="ml-4 px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
              )}
            </div>
         </form>
      </div>

      <div>
         <h2 className="text-xl font-semibold mb-4">Danh sách thông báo</h2>
         {loading ? (
           <p>Đang tải...</p>
         ) : (
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nền</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chữ</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hiệu lực</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {announcements.map((announcement) => (
                 <tr key={announcement._id}>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                     {announcement.message}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                     {announcement.link || '-'}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <div
                       className="w-8 h-8 rounded-full"
                       style={{ backgroundColor: announcement.backgroundColor }}
                     ></div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <div
                       className="w-8 h-8 rounded-full"
                       style={{ backgroundColor: announcement.textColor }}
                     ></div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                     {announcement.startDate ? new Date(announcement.startDate).toLocaleDateString('vi-VN') : '-'}
                     {' '} - {' '}
                     {announcement.endDate ? new Date(announcement.endDate).toLocaleDateString('vi-VN') : '-'}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                     <button
                       onClick={() => handleEdit(announcement)}
                       className="text-blue-600 hover:text-blue-900 mr-2"
                     >
                       Sửa
                     </button>
                     <button
                       onClick={() => handleDelete(announcement._id)}
                       className="text-red-600 hover:text-red-900"
                     >
                       Xóa
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         )}
      </div>
    </div>
  );
};

export default AnnouncementManagement; 