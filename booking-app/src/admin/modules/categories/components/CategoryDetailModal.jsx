import React from 'react';

export function CategoryDetailModal({ isOpen, onClose, category, categories = [], accounts = [] }) {
  if (!isOpen || !category) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const getFullName = (id) => {
    const account = accounts.find(acc => acc.id === id);
    return account ? account.fullName : `Account #${id}`;
  };

  const parentCategory = categories.find(c => c.id === category.parentId);
  const parentName = parentCategory 
    ? parentCategory.title 
    : (category.parentId ? `Danh mục #${category.parentId}` : "Không có (Danh mục gốc)");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Chi tiết danh mục</h2>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {category.status === 'active' ? 'Đang hoạt động' : 'Tạm ẩn'}
          </span>
        </div>
        
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Tên danh mục:</span>
            <span className="col-span-2 font-bold text-gray-900">{category.title}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Danh mục cha:</span>
            <span className="col-span-2 font-medium text-blue-600">{parentName}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Đường dẫn (Slug):</span>
            <span className="col-span-2">{category.slug}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Mô tả:</span>
            <span className="col-span-2">{category.description || "Không có mô tả"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Số tour hiện tại:</span>
            <span className="col-span-2 text-blue-600 font-bold">{category.tourCount || 0} tour</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-3 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin hệ thống</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo:</span>
              <span className="font-medium">{formatDate(category.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Người tạo:</span>
              <span className="font-medium text-blue-700">{category.createdBy ? getFullName(category.createdBy) : "Hệ thống"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lần cập nhật cuối:</span>
              <span className="font-medium">{formatDate(category.updatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Người cập nhật:</span>
              <span className="font-medium text-blue-700">{category.updatedBy ? getFullName(category.updatedBy) : "Chưa cập nhật"}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}