import { X } from "lucide-react";
import { getStatusBadge, getPaymentStatusBadge } from "./BookingTable";
import { PassengerList } from "./PassengerList";
import { PaymentHistory } from "./PaymentHistory";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getOverallPaymentStatus = (payments) => {
  if (!payments || payments.length === 0) return "pending";
  if (payments.some(p => p.paymentStatus === "paid")) return "paid";
  if (payments.every(p => p.paymentStatus === "failed")) return "failed";
  if (payments.some(p => p.paymentStatus === "refunded")) return "refunded";
  return payments[payments.length - 1].paymentStatus;
};

// Lấy % đã thanh toán cao nhất trong các payment đã "paid" (dựa trên paymentType)
const getPaidPercent = (payments) => {
  if (!payments || payments.length === 0) return 0;
  const paidPayments = payments.filter(p => p.paymentStatus === "paid");
  if (paidPayments.length === 0) return 0;
  return Math.max(...paidPayments.map(p => Number(p.paymentType) || 0));
};

export function BookingDetailModal({ booking, onClose, onChangePaymentStatus, onUpdatePassenger, accountMap = {} }) {
  if (!booking) return null;

  const overallPaymentStatus = getOverallPaymentStatus(booking.payments);
  const pendingPayment = booking.payments?.find(p => p.paymentStatus === "pending");
  const paidPercent = getPaidPercent(booking.payments);
  const paidAmount = Math.round((booking.total || 0) * paidPercent / 100);
  const remainingAmount = Math.max((booking.total || 0) - paidAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn đặt vé</h2>
            <p className="text-sm text-gray-500 mt-1">
              Mã Booking: <span className="font-mono font-semibold text-gray-900">{booking.bookingCode}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Thông tin Tour & Khách đặt */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
            <div>
              <p className="text-gray-500 mb-0.5">Khách hàng</p>
              <p className="font-semibold text-gray-900">{booking.fullName}</p>
              <p className="text-xs text-gray-500 mt-1">User ID: {booking.userId || "Khách vãng lai"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Ngày đặt</p>
              <p className="font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 mb-0.5">Tour</p>
              <p className="font-semibold text-gray-900 text-base">{booking.tourTitle || "Không xác định"}</p>
              <p className="text-xs text-gray-500 mt-1">Departure ID: {booking.departureId}</p>
              {booking.departureStartDate && (
                <p className="text-xs text-gray-500">Ngày khởi hành: {formatDate(booking.departureStartDate)}</p>
              )}
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Thông tin liên hệ</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Email:</span> {booking.email || "Chưa cung cấp"}</div>
              <div><span className="text-gray-500">Số điện thoại:</span> {booking.phone || "Chưa cung cấp"}</div>
              <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> {booking.address || "Chưa cung cấp"}</div>
            </div>
          </div>

          {/* Bảng chi tiết vé */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Chi tiết vé</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 font-medium text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="p-3">Loại vé</th>
                    <th className="p-3 text-center">Số lượng</th>
                    <th className="p-3 text-right">Đơn giá</th>
                    <th className="p-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-medium">Người lớn (Adult)</td>
                    <td className="p-3 text-center font-mono">{booking.quantityAdult}</td>
                    <td className="p-3 text-right text-gray-600">{formatCurrency(booking.adultPrice)}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(booking.quantityAdult * booking.adultPrice)}</td>
                  </tr>
                  {booking.quantityChildren > 0 && (
                    <tr>
                      <td className="p-3 font-medium">Trẻ em (Children)</td>
                      <td className="p-3 text-center font-mono">{booking.quantityChildren}</td>
                      <td className="p-3 text-right text-gray-600">{formatCurrency(booking.childrenPrice)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(booking.quantityChildren * booking.childrenPrice)}</td>
                    </tr>
                  )}
                  {booking.quantityBaby > 0 && (
                    <tr>
                      <td className="p-3 font-medium">Em bé (Baby)</td>
                      <td className="p-3 text-center font-mono">{booking.quantityBaby}</td>
                      <td className="p-3 text-right text-gray-600">{formatCurrency(booking.babyPrice)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(booking.quantityBaby * booking.babyPrice)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách hành khách */}
          <PassengerList 
            passengers={booking.passengers} 
            onUpdatePassenger={onUpdatePassenger}
            bookingStatus={booking.status}
          />

          {/* Lịch sử thanh toán */}
          <PaymentHistory 
            payments={booking.payments} 
            formatCurrency={formatCurrency} 
            formatDate={formatDate} 
            onChangePaymentStatus={onChangePaymentStatus}
          />

          {/* Ghi chú */}
          {booking.note && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Ghi chú từ khách hàng:</h3>
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-gray-700 italic">
                "{booking.note}"
              </div>
            </div>
          )}

          {/* Tổng tiền & Trạng thái */}
          <div className="border-t border-gray-100 pt-4 flex flex-col items-end space-y-2 text-sm">
            <div className="flex justify-between w-64 text-gray-500">
              <span>Tạm tính (subTotal):</span>
              <span className="font-medium text-gray-900">{formatCurrency(booking.subTotal)}</span>
            </div>
            {booking.couponId && (
              <div className="flex justify-between w-64 text-gray-500">
                <span>Mã giảm giá (Coupon ID):</span>
                <span className="font-medium text-red-600">#{booking.couponId}</span>
              </div>
            )}
            <div className="flex justify-between w-64 text-gray-500">
              <span>Giảm giá (discount):</span>
              <span className="font-medium text-red-600">{formatCurrency(booking.discount || 0)}</span>
            </div>
            <div className="flex justify-between w-64 text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
              <span>Tổng thanh toán (total):</span>
              <span className="text-lg text-green-600">{formatCurrency(booking.total)}</span>
            </div>
          
            {/* Chi tiết đã thanh toán / còn lại */}
            <div className="w-64 border-t border-dashed border-gray-200 pt-2 space-y-1.5">
              <div className="flex justify-between text-gray-500">
                <span>Đã thanh toán {paidPercent > 0 && `(${paidPercent}%)`}:</span>
                <span className="font-medium text-blue-600">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Còn lại:</span>
                <span className={`font-medium ${remainingAmount > 0 ? "text-red-600" : "text-gray-400"}`}>
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            </div>
            
            <div className="w-64 border-t border-gray-200 mt-3 pt-3 space-y-2">
              
              {booking.updatedAt && (
                <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200 mt-2">
                  <span className="text-xs text-gray-400">Cập nhật lúc:</span>
                  <span className="text-xs font-medium text-gray-600">{formatDate(booking.updatedAt)}</span>
                </div>
              )}
              {booking.updatedBy && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Người cập nhật:</span>
                  <span className="text-xs font-medium text-gray-600">{accountMap[booking.updatedBy] || `ID: ${booking.updatedBy}`}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Đóng
          </button>
          
          
        </div>
      </div>
    </div>
  );
}