import { Shield, Phone, Users, MapPin, Tag, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

function formatShortPrice(num) {
  if (!num) return "0đ";
  if (num >= 1000000) {
    const val = num / 1000000;
    return val % 1 === 0 ? `${val}tr` : `${val.toFixed(1).replace(".0", "")}tr`;
  }
  if (num >= 1000) {
    return `${Math.round(num / 1000)}k`;
  }
  return `${num}đ`;
}

function formatTileDate(dateStr) {
  if (!dateStr) return { dayMonth: "--/--", year: "----" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { dayMonth: "--/--", year: "----" };
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return { dayMonth: `${day}/${month}`, year: String(year) };
}

export function TourBookingSidebar({
  tour,
  date,
  setDate,
  departures = [],
  selectedDeparture,
  onSelectDeparture,
  adults,
  setAdults,
  children,
  setChildren,
  babies = 0,
  setBabies,
  unitPrice,
  childPrice,
  babyPrice = 0,
  stockAdult = 50,
  stockChildren = 20,
  stockBaby = 10,
  totalPrice,
  onBook,
}) {
  const upcomingDepartures = departures.filter((dep) => {
    if (!dep || !dep.startTime) return false;
    const start = new Date(dep.startTime);
    if (isNaN(start.getTime())) return false;
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    if (start < todayStart) return false;
    const status = (dep.status || "").toLowerCase();
    if (status === "cancelled" || status === "completed" || status === "departed") return false;
    if (dep.deleted) return false;
    return true;
  });

  const isSoldOut = stockAdult <= 0;

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-20 space-y-6 border border-gray-100">
        {/* Price Header */}
        <div>
          {tour.originalPrice && (
            <p className="text-sm text-gray-400 line-through">{fmt(tour.originalPrice)}</p>
          )}
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-blue-600">{fmt(unitPrice)}</p>
            <span className="text-gray-400 text-sm font-medium">/người lớn</span>
          </div>
          {tour.discount > 0 && tour.originalPrice && (
            <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full mt-1.5 shadow-xs">
              Tiết kiệm {fmt(tour.originalPrice - unitPrice)}
            </span>
          )}
        </div>

        {/* Ngày Khởi Hành (Chỉ hiển thị các đợt chưa khởi hành) */}
        <div>
          <label className="text-sm font-bold text-gray-800 mb-2.5 block flex items-center justify-between">
            <span>Ngày Khởi Hành</span>
            {upcomingDepartures.length > 0 && (
              <span className="text-[11px] font-semibold text-blue-600">
                {upcomingDepartures.length} đợt sắp tới
              </span>
            )}
          </label>

          {upcomingDepartures.length > 0 ? (
            <div className="space-y-3">
              {/* Departure Tiles */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {upcomingDepartures.map((dep) => {
                  const isSelected = selectedDeparture?.id === dep.id;
                  const { dayMonth, year } = formatTileDate(dep.startTime);
                  const priceText = formatShortPrice(dep.priceAdult || unitPrice);

                  return (
                    <button
                      key={dep.id}
                      type="button"
                      onClick={() => onSelectDeparture(dep)}
                      className={`flex-shrink-0 w-22 py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none text-center shadow-sm ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600 scale-102"
                          : "bg-white border-2 border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50/30"
                      }`}
                    >
                      <span className={`text-base font-black tracking-tight leading-none ${
                        isSelected ? "text-white" : "text-gray-900"
                      }`}>
                        {dayMonth}
                      </span>
                      <span className={`text-xs font-semibold mt-1 leading-none ${
                        isSelected ? "text-blue-100" : "text-gray-400"
                      }`}>
                        {year}
                      </span>
                      <div className={`w-10 border-t border-dashed my-2 ${
                        isSelected ? "border-white/50" : "border-gray-200"
                      }`} />
                      <span className={`text-sm font-black tracking-tight leading-none ${
                        isSelected ? "text-white" : "text-blue-600"
                      }`}>
                        {priceText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected departure details snippet */}
              {selectedDeparture && (
                <div className="bg-blue-50/70 rounded-2xl p-3.5 text-xs space-y-1.5 text-blue-950 border border-blue-100">
                  <p className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    Khởi hành từ: {selectedDeparture.departureFrom || tour.departureFrom}
                  </p>
                  <p className="flex items-center gap-1.5 text-green-700 font-semibold">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    Chỗ trống còn lại: {stockAdult} người lớn | {stockChildren} trẻ em | {stockBaby} em bé
                  </p>
                  {selectedDeparture.discount > 0 && (
                    <p className="flex items-center gap-1.5 text-red-600 font-bold">
                      <Tag className="w-3.5 h-3.5 shrink-0" /> Giảm giá {selectedDeparture.discount}%
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 text-xs p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>Chuyến đi hiện chưa có lịch khởi hành sắp tới. Vui lòng liên hệ tổng đài để nhận lịch mới nhất.</span>
            </div>
          )}
        </div>

        {/* Số Lượng Khách: 3 Loại (Người lớn, Trẻ em, Em bé) */}
        <div>
          <label className="text-sm font-bold text-gray-800 mb-3 block">
            Số lượng hành khách
          </label>
          <div className="space-y-3.5">
            {[
              {
                label: "Người lớn",
                note: "≥ 12 tuổi",
                price: unitPrice,
                val: adults,
                set: setAdults,
                min: 1,
                max: stockAdult,
              },
              {
                label: "Trẻ em",
                note: "5–11 tuổi",
                price: childPrice,
                val: children,
                set: setChildren,
                min: 0,
                max: stockChildren,
              },
              {
                label: "Em bé",
                note: "Dưới 5 tuổi",
                price: babyPrice,
                val: babies,
                set: setBabies,
                min: 0,
                max: stockBaby,
              },
            ].map((row) => {
              const reachedMax = row.val >= row.max;
              return (
                <div key={row.label} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-gray-800 font-bold">{row.label}</p>
                      <span className="text-xs text-blue-600 font-medium">({fmt(row.price)})</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {row.note} · <span className={row.max > 0 ? "text-green-600 font-medium" : "text-red-500 font-bold"}>
                        Còn {row.max} chỗ
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => row.set((v) => Math.max(row.min, v - 1))}
                      disabled={row.val <= row.min}
                      className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-lg leading-none cursor-pointer transition-colors ${
                        row.val <= row.min
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-600 active:scale-95"
                      }`}
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{row.val}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (row.val < row.max) {
                          row.set((v) => v + 1);
                        } else {
                          toast.warning(`Không thể đặt quá số chỗ còn lại (${row.max} chỗ ${row.label.toLowerCase()})`);
                        }
                      }}
                      disabled={reachedMax}
                      className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-lg leading-none cursor-pointer transition-colors ${
                        reachedMax
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-600 active:scale-95"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              {adults} người lớn × {fmt(unitPrice)}
            </span>
            <span className="font-medium text-gray-800">{fmt(adults * unitPrice)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>
                {children} trẻ em × {fmt(childPrice)}
              </span>
              <span className="font-medium text-gray-800">{fmt(children * childPrice)}</span>
            </div>
          )}
          {babies > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>
                {babies} em bé × {fmt(babyPrice)}
              </span>
              <span className="font-medium text-gray-800">{fmt(babies * babyPrice)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
            <span>Tổng cộng ({adults + children + babies} khách)</span>
            <span className="text-blue-600 text-base">{fmt(totalPrice)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBook}
          disabled={upcomingDepartures.length === 0 || isSoldOut}
          className={`w-full font-black py-4 rounded-xl transition-all text-base shadow-lg cursor-pointer active:scale-98 ${
            upcomingDepartures.length === 0 || isSoldOut
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
          }`}
        >
          {isSoldOut ? "Chuyến đi đã hết chỗ" : "Đặt tour ngay"}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="w-3.5 h-3.5 text-green-500 shrink-0" />
          Hỗ trợ cọc 50% · Thanh toán 100% · Thanh toán COD
        </div>
      </div>

      {/* Hotline card */}
      <div className="bg-blue-50 rounded-3xl p-5 mt-4 border border-blue-100">
        <p className="font-bold text-gray-800 mb-1 text-sm">Cần tư vấn thêm?</p>
        <p className="text-xs text-gray-500 mb-3">Chuyên gia của chúng tôi sẵn sàng hỗ trợ</p>
        <a
          href="tel:18001234"
          className="flex items-center gap-2 bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors justify-center shadow-xs"
        >
          <Phone className="w-4 h-4" /> Gọi 1800 1234
        </a>
      </div>
    </div>
  );
}

export default TourBookingSidebar;
