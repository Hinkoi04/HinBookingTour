import { Shield, Clock, MapPin, Users } from "lucide-react";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

export function BookingPolicy() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm">
        <Shield className="w-4 h-4" /> Chính sách đặt tour
      </h3>
      <ul className="space-y-2 text-sm text-amber-700">
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>Đặt cọc 30% tổng giá trị để xác nhận chỗ
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>Thanh toán 70% còn lại trước khởi hành 7 ngày
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>Hủy trước 15 ngày: hoàn 100% | Trước 7 ngày: hoàn 70%
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>Hủy dưới 3 ngày: không hoàn tiền
        </li>
      </ul>
    </div>
  );
}

export function BookingOrderSummary({ tour, date, adults, children, totalPrice, deposit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
      <h3 className="font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>

      {/* Tour card */}
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
          <p className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug">{tour.name}</p>
          <p className="text-xs text-blue-600 mt-1">{tour.category}</p>
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" /> {tour.duration}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" /> {tour.departureFrom}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4 text-gray-400" /> {adults} người lớn{children > 0 ? `, ${children} trẻ em` : ""}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-gray-400 text-xs">📅</span>
          {date
            ? new Date(date).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Chưa chọn"}
        </div>
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{adults} người lớn</span>
          <span>{fmt(adults * tour.price)}</span>
        </div>
        {children > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>{children} trẻ em (50%)</span>
            <span>{fmt(children * tour.price * 0.5)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-gray-100">
          <span>Tổng tiền</span>
          <span className="text-blue-600">{fmt(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-orange-600 font-semibold bg-orange-50 rounded-xl px-3 py-2">
          <span>Đặt cọc (30%)</span>
          <span>{fmt(deposit)}</span>
        </div>
      </div>
    </div>
  );
}

export default BookingOrderSummary;
