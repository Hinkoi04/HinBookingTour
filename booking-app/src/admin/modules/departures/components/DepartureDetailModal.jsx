import React from 'react';

export function DepartureDetailModal({ isOpen, onClose, departure, accountList = [] }) {
  if (!isOpen || !departure) return null;

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "—";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const getAccountName = (id) => {
    if (!id) return null;
    const account = accountList.find(acc => acc.id === id);
    return account ? account.fullName : `Nhân viên #${id}`; 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Chi tiết lịch khởi hành</h2>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            (departure.status === 'OPEN' || String(departure.status).toUpperCase() === 'ACTIVE') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {(departure.status === 'OPEN' || String(departure.status).toUpperCase() === 'ACTIVE') 
              ? 'Đang hoạt động' 
              : 'Đã đóng'}
          </span>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-4 text-sm text-gray-700 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Tên Tour:</span>
            <span className="col-span-2 font-bold text-gray-900">{departure.tourTitle || `Tour #${departure.tourId}`}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Khởi hành từ:</span>
            <span className="col-span-2 font-medium text-gray-900">{departure.departureFrom || "—"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Thời gian đi:</span>
            <span className="col-span-2 font-medium text-blue-600">{formatDate(departure.startTime)}</span>
          </div>

          {/* Đã bổ sung trường Ngày về */}
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Thời gian về:</span>
            <span className="col-span-2 font-medium text-blue-600">{formatDate(departure.endDate)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Phương tiện:</span>
            <span className="col-span-2">{departure.vehicleName || "Tự túc"}</span>
          </div>

          {/* Đã bổ sung trường Hướng dẫn viên */}
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">HDV phụ trách:</span>
            <span className="col-span-2 font-medium text-gray-900">
              {departure.guideName || <span className="text-gray-400 italic">Chưa phân công</span>}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Biểu phí:</span>
            <span className="col-span-2 space-y-1">
              <div className="flex justify-between"><span>Người lớn:</span> <span className="font-bold text-green-600">{formatCurrency(departure.priceAdult)}</span></div>
              <div className="flex justify-between text-xs text-gray-500"><span>Trẻ em:</span> <span>{formatCurrency(departure.priceChildren)}</span></div>
              <div className="flex justify-between text-xs text-gray-500"><span>Em bé:</span> <span>{formatCurrency(departure.priceBaby)}</span></div>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Giới hạn chỗ:</span>
            <span className="col-span-2">
              <span className="font-medium text-gray-900">NL:</span> {departure.stockAdult} | <span className="font-medium text-gray-900">TE:</span> {departure.stockChildren} | <span className="font-medium text-gray-900">EB:</span> {departure.stockBaby}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-3 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin hệ thống</h3>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Ngày tạo:</span>
              <span className="font-medium">{formatDate(departure.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Người tạo:</span>
              <span className="font-medium text-blue-700">
                {departure.createdBy ? getAccountName(departure.createdBy) : "Hệ thống"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Lần cập nhật cuối:</span>
              <span className="font-medium">{formatDate(departure.updatedAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Người cập nhật:</span>
              <span className="font-medium text-blue-700">
                {departure.updatedBy ? getAccountName(departure.updatedBy) : "Chưa cập nhật"}
              </span>
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