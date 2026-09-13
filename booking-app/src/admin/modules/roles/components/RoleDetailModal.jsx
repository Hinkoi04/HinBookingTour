import React from "react";
import { X, Shield, Clock, Calendar, Activity, Info } from "lucide-react";

const formatDateTime = (dateString) => {
  if (!dateString) return <span className="italic text-gray-400">Trống</span>;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export const RoleDetailModal = ({ isOpen, onClose, role }) => {
  if (!isOpen || !role) return null;

  const isAdmin = role.name?.toUpperCase() === "ADMIN";
  const isDeleted = role.deleted === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Chi tiết Vai trò
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
              <Info className="w-4 h-4 text-gray-500" />
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-gray-500">ID:</span>
                <span className="col-span-2 text-gray-900 font-medium">#{role.id}</span>
              </div>
              
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-gray-500">Tên Vai trò:</span>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-gray-900 font-bold text-base">{role.name}</span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-700 rounded-md">
                      Hệ thống
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3">
                <span className="text-sm font-medium text-gray-500 mt-1">Mô tả:</span>
                <div className="col-span-2 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                  {role.description || <span className="italic text-gray-400">Không có mô tả</span>}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2 mt-2">
              <Activity className="w-4 h-4 text-gray-500" />
              Thông tin hệ thống
            </h3>
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                {isDeleted ? (
                  <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg">
                    Đã xóa (Vô hiệu hóa)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
                    Đang hoạt động
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1.5 font-medium text-gray-500">
                  <Calendar className="w-4 h-4" /> Ngày tạo:
                </span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatDateTime(role.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1.5 font-medium text-gray-500">
                  <Clock className="w-4 h-4" /> Cập nhật lần cuối:
                </span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatDateTime(role.updatedAt)}
                </span>
              </div>

              {isDeleted && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 border-dashed">
                  <span className="text-sm font-medium text-red-500">
                    Thời điểm xóa:
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    {formatDateTime(role.deletedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
        
      </div>
    </div>
  );
};