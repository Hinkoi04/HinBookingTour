import { Calendar, MapPin, Users, Check, Tag, Bus } from "lucide-react";

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

export function TourDeparturesSelector({
  departures = [],
  selectedDeparture,
  onSelect,
  defaultTourPrice = 0,
}) {
  if (!departures || departures.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-dashed border-gray-200">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-base">
          <Calendar className="w-5 h-5 text-blue-600" /> Lịch khởi hành
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Tour hiện đang mở bán theo yêu cầu hoặc lịch khởi hành định kỳ hàng tuần.
        </p>
        <div className="bg-blue-50/70 text-blue-800 rounded-xl p-3.5 text-xs flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            Bạn có thể chọn ngày khởi hành mong muốn tại cột Đặt tour bên phải hoặc liên hệ hotline để nhận lịch tour mới nhất.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Lịch khởi hành có sẵn
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Chọn ngày khởi hành phù hợp với lịch trình của bạn:
          </p>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
          {departures.length} đợt mở bán
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {departures.map((dep) => {
          const isSelected = selectedDeparture?.id === dep.id;
          const { dayMonth, year } = formatTileDate(dep.startTime);
          const priceText = formatShortPrice(dep.priceAdult || defaultTourPrice);
          const adultPrice = dep.priceAdult ? Number(dep.priceAdult) : defaultTourPrice;
          const slots = dep.stockAdult !== undefined ? dep.stockAdult : null;

          return (
            <div
              key={dep.id}
              onClick={() => onSelect(dep)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between select-none ${
                isSelected
                  ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50/70"
              }`}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="flex items-start gap-3.5 mb-3">
                {/* Visual Date Tile */}
                <div
                  className={`w-20 py-2.5 px-1.5 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  <span className={`text-sm font-black leading-none ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {dayMonth}
                  </span>
                  <span className={`text-[10px] font-semibold mt-0.5 leading-none ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    {year}
                  </span>
                  <div className={`w-8 border-t border-dashed my-1.5 ${isSelected ? "border-white/50" : "border-gray-300"}`} />
                  <span className={`text-[11px] font-black leading-none ${isSelected ? "text-white" : "text-blue-600"}`}>
                    {priceText}
                  </span>
                </div>

                {/* Details info */}
                <div className="space-y-1 text-xs text-gray-600 min-w-0 flex-1 pt-0.5">
                  {dep.departureFrom && (
                    <p className="flex items-center gap-1 text-gray-700 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {dep.departureFrom}
                    </p>
                  )}
                  {dep.vehicleName && (
                    <p className="flex items-center gap-1 text-gray-500 truncate">
                      <Bus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {dep.vehicleName}
                    </p>
                  )}
                  {slots !== null && (
                    <p className="flex items-center gap-1 text-green-700 font-semibold">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      Còn {slots} chỗ
                    </p>
                  )}
                  {dep.discount > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-red-600 font-bold text-[10px]">
                      <Tag className="w-2.5 h-2.5" /> Giảm -{dep.discount}%
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Giá trọn gói:</span>
                <span className="font-black text-blue-600 text-sm">{fmt(adultPrice)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TourDeparturesSelector;
