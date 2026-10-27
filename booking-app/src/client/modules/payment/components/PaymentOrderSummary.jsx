import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

export function PaymentSuccess({
  orderId,
  tour,
  date,
  customer,
  deposit = 0,
  totalPrice = 0,
  paymentPlan = "half",
  paymentMethod = "bank",
  passengers = [],
}) {
  const navigate = useNavigate();

  const remaining = Math.max(0, totalPrice - deposit);

  let planText = "Đặt cọc 50% (1 nửa)";
  if (paymentPlan === "full") planText = "Thanh toán trọn gói 100%";
  if (paymentPlan === "cod") planText = "Thanh toán khi nhận vé (COD)";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-xl w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Đặt tour thành công!</h2>
        <p className="text-gray-500 text-sm mb-1">Mã đơn hàng của bạn:</p>
        <p className="text-2xl font-mono font-black text-blue-600 mb-6 tracking-wide">{orderId}</p>

        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2.5 text-xs sm:text-sm mb-6 border border-gray-100">
          <div className="flex justify-between items-start gap-4 pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 shrink-0">Chuyến đi:</span>
            <span className="font-bold text-gray-900 text-right">{tour.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngày khởi hành:</span>
            <span className="font-semibold text-gray-800">
              {date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Người đặt tour:</span>
            <span className="font-semibold text-gray-800">{customer?.fullName} ({customer?.phone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Hình thức thanh toán:</span>
            <span className="font-bold text-blue-600">{planText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Số tiền cọc / thanh toán:</span>
            <span className="font-black text-orange-600 text-base">{fmt(deposit)}</span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-200/60">
              <span>Còn lại thanh toán sau:</span>
              <span className="font-semibold text-gray-800">{fmt(remaining)}</span>
            </div>
          )}

          {/* Danh sách hành khách */}
          {passengers && passengers.length > 0 && (
            <div className="pt-2 border-t border-gray-200/60">
              <span className="text-gray-500 block mb-1.5 font-medium">
                Danh sách {passengers.length} hành khách:
              </span>
              <div className="bg-white rounded-xl p-2.5 border border-gray-200 space-y-1">
                {passengers.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-800">
                      {i + 1}. {p.fullName || "Chưa nhập"} ({p.gender || "Nam"})
                    </span>
                    <span className="text-gray-400 text-[11px]">{p.typeLabel || p.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          Xác nhận đặt tour đã được gửi tới <strong>{customer?.email}</strong>. Nhân viên TravelGo sẽ liên hệ qua SĐT <strong>{customer?.phone}</strong> trong vòng 2 giờ để hỗ trợ thủ tục.
        </p>

        <div className="flex gap-3">
          <Link
            to="/home"
            className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors text-center"
          >
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-blue-500/20"
          >
            Xem thêm tour
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentOrderSummary({
  tour,
  date,
  customer,
  totalPrice = 0,
  deposit = 0,
  remaining = 0,
  paymentPlan = "half",
  adults = 1,
  children = 0,
  babies = 0,
  passengers = [],
  orderId,
}) {
  const [showPassengers, setShowPassengers] = useState(false);

  let planDesc = "Đặt cọc 50% (1 nửa)";
  if (paymentPlan === "full") planDesc = "Thanh toán hết 100%";
  if (paymentPlan === "cod") planDesc = "Thanh toán khi nhận vé (COD)";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20 border border-gray-100 space-y-4">
      <h3 className="font-bold text-gray-800 mb-1 text-base">Chi tiết đơn hàng</h3>

      {/* Tour card preview */}
      <div className="flex gap-3 pb-3 border-b border-gray-100">
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
          <p className="text-xs text-blue-600 mt-1 font-semibold">{tour.category}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs sm:text-sm text-gray-600 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {tour.duration || "3 ngày 2 đêm"}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {tour.departure?.departureFrom || tour.departureFrom}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">📅</span>
          <span>{date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa chọn"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {passengers.length || (adults + children + babies)} hành khách ({adults} NL{children > 0 ? `, ${children} TE` : ""}{babies > 0 ? `, ${babies} EB` : ""})
          </span>
        </div>
      </div>

      {/* Danh sách hành khách xem nhanh */}
      {passengers && passengers.length > 0 && (
        <div className="pb-3 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setShowPassengers((v) => !v)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-blue-600"
          >
            <span>Danh sách hành khách ({passengers.length} người)</span>
            {showPassengers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showPassengers && (
            <div className="mt-2 space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
              {passengers.map((p, i) => (
                <div key={i} className="flex justify-between text-gray-700">
                  <span>{i + 1}. {p.fullName || "Chưa có tên"}</span>
                  <span className="text-gray-400 text-[11px]">{p.typeLabel || p.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chi phí */}
      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tổng giá trị tour:</span>
          <span className="font-semibold text-gray-900">{fmt(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-xs">
          <span>Phương án thanh toán:</span>
          <span className="font-bold text-blue-600">{planDesc}</span>
        </div>
        <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-100 pt-2">
          <span>Cần thanh toán:</span>
          <span className="text-orange-600">{fmt(deposit)}</span>
        </div>
        {remaining > 0 && (
          <p className="text-xs text-gray-500">
            Còn lại <strong>{fmt(remaining)}</strong> thanh toán trước khởi hành hoặc khi nhận vé.
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Mã đơn hàng: <span className="font-mono font-bold text-gray-600">{orderId}</span>
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
