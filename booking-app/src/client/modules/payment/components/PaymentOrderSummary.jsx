import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, MapPin } from "lucide-react";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

export function PaymentSuccess({ orderId, tour, date, customer, deposit }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full mx-4 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Đặt tour thành công!</h2>
        <p className="text-gray-500 mb-2">Mã đơn hàng của bạn:</p>
        <p className="text-2xl font-black text-blue-600 mb-6">{orderId}</p>
        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Tour:</span>
            <span className="font-semibold text-gray-800 text-right ml-4">{tour.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngày đi:</span>
            <span className="font-semibold">
              {date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Khách:</span>
            <span className="font-semibold">{customer?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Số tiền cọc:</span>
            <span className="font-bold text-orange-600">{fmt(deposit)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Chúng tôi đã gửi xác nhận đến <strong>{customer?.email}</strong>. Nhân viên sẽ liên hệ qua <strong>{customer?.phone}</strong> trong vòng 2 giờ.
        </p>
        <div className="flex gap-3">
          <Link
            to="/home"
            className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors text-center"
          >
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Xem thêm tour
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentOrderSummary({ tour, date, customer, totalPrice, deposit, orderId }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
      <h3 className="font-bold text-gray-800 mb-4">Chi tiết đơn hàng</h3>

      <div className="flex gap-3 pb-4 border-b border-gray-100 mb-4">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-20 h-16 rounded-xl object-cover shrink-0"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
          }}
        />
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-sm line-clamp-2">{tour.name}</p>
          <p className="text-xs text-blue-600 mt-1">{tour.category}</p>
        </div>
      </div>

      <div className="space-y-2.5 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {tour.duration}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {tour.departureFrom}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">📅</span>
          {date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa chọn"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">👤</span>
          {customer?.fullName}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tổng tiền tour</span>
          <span className="font-semibold">{fmt(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-xs">
          <span>Phí dịch vụ</span>
          <span>Miễn phí</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2">
          <span>Cần thanh toán</span>
          <span className="text-orange-600">{fmt(deposit)}</span>
        </div>
        <p className="text-xs text-gray-400">
          Đặt cọc 30% · Còn lại {fmt(totalPrice - deposit)} thanh toán sau
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Mã đơn hàng: <span className="font-mono font-bold text-gray-600">{orderId}</span>
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
