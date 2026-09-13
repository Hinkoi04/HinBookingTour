import React from 'react';

export function CouponDetailModal({ isOpen, onClose, coupon, getAccountName }) {
  if (!isOpen || !coupon) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Chi tiết mã giảm giá</h2>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {coupon.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
          </span>
        </div>
        
        <div className="p-6 space-y-4 text-sm text-gray-700 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Mã Code:</span>
            <span className="col-span-2 font-bold text-gray-900 font-mono tracking-wider uppercase">{coupon.code}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Tỷ lệ giảm:</span>
            <span className="col-span-2 font-bold text-blue-600">{coupon.discountPercentage || 0}%</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Giảm tối đa:</span>
            <span className="col-span-2">
              {coupon.maxDiscountAmount ? `${(coupon.maxDiscountAmount).toLocaleString()} VNĐ` : "Không giới hạn"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Lượt sử dụng:</span>
            <span className="col-span-2 font-medium text-blue-600">
              {coupon.usedCount || 0} / {coupon.quantity || "∞"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b pb-3">
            <span className="text-gray-500 font-medium">Thời gian áp dụng:</span>
            <span className="col-span-2 font-medium">
              Từ: {formatDate(coupon.startDate)} <br/>
              Đến: {formatDate(coupon.endDate)}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-3 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin hệ thống</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo:</span>
              <span className="font-medium">{formatDate(coupon.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Người tạo:</span>
              <span className="font-medium text-blue-700">
                {coupon.createdBy ? getAccountName(coupon.createdBy) : "Hệ thống"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lần cập nhật cuối:</span>
              <span className="font-medium">{formatDate(coupon.updatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Người cập nhật:</span>
              <span className="font-medium text-blue-700">
                {coupon.updatedBy ? getAccountName(coupon.updatedBy) : "Chưa cập nhật"}
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