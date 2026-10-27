import { Shield, Clock, MapPin, Users, CheckCircle2 } from "lucide-react";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

export function BookingPolicy() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm">
        <Shield className="w-4 h-4" /> Chính sách thanh toán & hoàn hủy
      </h3>
      <ul className="space-y-2 text-xs sm:text-sm text-amber-700">
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>
          <strong>Lựa chọn thanh toán linh hoạt:</strong> Đặt cọc 50% (1 nửa), thanh toán hết 100% hoặc thanh toán tiền mặt khi nhận vé (COD).
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>
          <strong>Hủy tour miễn phí:</strong> Hoàn 100% nếu hủy trước khởi hành từ 7 ngày trở lên.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>
          <strong>Hủy trước 3 - 6 ngày:</strong> Hoàn lại 50% tổng chi phí tour.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 shrink-0">•</span>
          <strong>Hủy trong vòng 48h trước giờ đi:</strong> Không áp dụng hoàn tiền theo quy định của nhà xe/hàng không.
        </li>
      </ul>
    </div>
  );
}

export function BookingOrderSummary({
  tour,
  date,
  adults = 1,
  children = 0,
  babies = 0,
  totalPrice = 0,
  paymentPlan = "half",
  onSelectPaymentPlan,
}) {
  const adultPrice = tour.departure?.priceAdult ? Number(tour.departure.priceAdult) : (tour.price || 0);
  const childPrice = tour.departure?.priceChildren ? Number(tour.departure.priceChildren) : Math.round(adultPrice * 0.5);
  const babyPrice = tour.departure?.priceBaby !== undefined ? Number(tour.departure.priceBaby) : 0;

  const totalPassengers = adults + children + babies;

  // Tính tiền theo phương án thanh toán
  let amountToPay = 0;
  let remainingAmount = 0;
  let planLabel = "";

  if (paymentPlan === "half") {
    amountToPay = Math.round(totalPrice * 0.5);
    remainingAmount = totalPrice - amountToPay;
    planLabel = "Đặt cọc 50% (1 nửa)";
  } else if (paymentPlan === "full") {
    amountToPay = totalPrice;
    remainingAmount = 0;
    planLabel = "Thanh toán toàn bộ (100%)";
  } else if (paymentPlan === "cod") {
    amountToPay = 0;
    remainingAmount = totalPrice;
    planLabel = "Thanh toán khi nhận vé (COD)";
  }

  const plans = [
    {
      id: "half",
      label: "Cọc 50% (1 nửa)",
      desc: `Trả trước ${fmt(Math.round(totalPrice * 0.5))}`,
      badge: "Phổ biến",
    },
    {
      id: "full",
      label: "Thanh toán hết 100%",
      desc: `Trả trọn gói ${fmt(totalPrice)}`,
      badge: "Nhanh gọn",
    },
    {
      id: "cod",
      label: "Thanh toán COD",
      desc: "Trả tiền mặt khi nhận vé/hợp đồng",
      badge: "An tâm",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20 border border-gray-100 space-y-4">
      <h3 className="font-bold text-gray-800 text-base">Tóm tắt đơn hàng</h3>

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

      {/* Thông tin chuyến đi */}
      <div className="space-y-2 text-xs sm:text-sm text-gray-600 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" /> {tour.duration || "3 ngày 2 đêm"}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> Khởi hành: {tour.departure?.departureFrom || tour.departureFrom}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            {totalPassengers} khách ({adults} NL{children > 0 ? `, ${children} TE` : ""}{babies > 0 ? `, ${babies} EB` : ""})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">📅</span>
          <span className="font-medium text-gray-800">
            {date
              ? new Date(date).toLocaleDateString("vi-VN", {
                  weekday: "short",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "Chưa chọn"}
          </span>
        </div>
      </div>

      {/* Lựa chọn hình thức thanh toán / cọc (Requirement 5) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Hình thức thanh toán cọc:
        </label>
        <div className="space-y-2">
          {plans.map((p) => {
            const isSelected = paymentPlan === p.id;
            return (
              <label
                key={p.id}
                onClick={() => onSelectPaymentPlan && onSelectPaymentPlan(p.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 shadow-xs"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900">{p.label}</span>
                      {p.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">{p.desc}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Chi tiết chi phí */}
      <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs sm:text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{adults} Người lớn × {fmt(adultPrice)}</span>
          <span className="font-medium text-gray-800">{fmt(adults * adultPrice)}</span>
        </div>
        {children > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>{children} Trẻ em × {fmt(childPrice)}</span>
            <span className="font-medium text-gray-800">{fmt(children * childPrice)}</span>
          </div>
        )}
        {babies > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>{babies} Em bé × {fmt(babyPrice)}</span>
            <span className="font-medium text-gray-800">{fmt(babies * babyPrice)}</span>
          </div>
        )}

        <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-100">
          <span>Tổng tiền tour:</span>
          <span className="text-blue-600">{fmt(totalPrice)}</span>
        </div>

        {/* Số tiền cọc / thanh toán ngay */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mt-2 text-xs sm:text-sm space-y-1">
          <div className="flex justify-between font-bold text-orange-800">
            <span>Thanh toán ngay ({planLabel}):</span>
            <span className="text-orange-600 text-base">{fmt(amountToPay)}</span>
          </div>
          {remainingAmount > 0 && (
            <div className="flex justify-between text-xs text-orange-700">
              <span>Còn lại thanh toán sau:</span>
              <span className="font-semibold">{fmt(remainingAmount)}</span>
            </div>
          )}
          {paymentPlan === "cod" && (
            <p className="text-[11px] text-orange-600 italic mt-1">
              * Quý khách không cần trả trước. Thanh toán 100% khi nhận vé hoặc tại quầy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingOrderSummary;
