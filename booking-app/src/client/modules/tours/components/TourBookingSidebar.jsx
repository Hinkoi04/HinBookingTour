import { Shield, Phone, Users, MapPin, Tag } from "lucide-react";

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
  unitPrice,
  childPrice,
  totalPrice,
  onBook,
}) {
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
            <span className="text-gray-400 text-sm font-medium">/người</span>
          </div>
          {tour.discount > 0 && tour.originalPrice && (
            <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full mt-1.5 shadow-xs">
              Tiết kiệm {fmt(tour.originalPrice - unitPrice)}
            </span>
          )}
        </div>

        {/* Ngày Khởi Hành (Tiles Grid) */}
        <div>
          <label className="text-sm font-bold text-gray-800 mb-2.5 block">
            Ngày Khởi Hành
          </label>

          {departures && departures.length > 0 ? (
            <div className="space-y-3">
              {/* Departure Tiles */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {departures.map((dep) => {
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
                  {selectedDeparture.stockAdult !== undefined && (
                    <p className="flex items-center gap-1.5 text-green-700 font-semibold">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      Còn {selectedDeparture.stockAdult} chỗ trống
                    </p>
                  )}
                  {selectedDeparture.discount > 0 && (
                    <p className="flex items-center gap-1.5 text-red-600 font-bold">
                      <Tag className="w-3.5 h-3.5 shrink-0" /> Giảm giá {selectedDeparture.discount}%
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Số Lượng Khách / Số Người */}
        <div>
          <label className="text-sm font-bold text-gray-800 mb-3 block">
            Số người
          </label>
          <div className="space-y-3">
            {[
              { label: "Người lớn", note: "≥ 12 tuổi", val: adults, set: setAdults, min: 1 },
              { label: "Trẻ em", note: "5–11 tuổi (50%)", val: children, set: setChildren, min: 0 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">{row.label}</p>
                  <p className="text-xs text-gray-400">{row.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => row.set((v) => Math.max(row.min, v - 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600 text-lg leading-none cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{row.val}</span>
                  <button
                    type="button"
                    onClick={() => row.set((v) => v + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600 text-lg leading-none cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              {adults} người lớn × {fmt(unitPrice)}
            </span>
            <span>{fmt(adults * unitPrice)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>
                {children} trẻ em × {fmt(childPrice)}
              </span>
              <span>{fmt(children * childPrice)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
            <span>Tổng cộng</span>
            <span className="text-blue-600 text-base">{fmt(totalPrice)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBook}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all text-base shadow-lg shadow-blue-500/20 cursor-pointer active:scale-98"
        >
          Đặt tour ngay
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="w-3.5 h-3.5 text-green-500 shrink-0" />
          Đặt cọc 30% · Hoàn tiền 100% nếu hủy trước 7 ngày
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
