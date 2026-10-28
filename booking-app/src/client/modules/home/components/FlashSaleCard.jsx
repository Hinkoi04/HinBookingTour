import { Link } from "react-router-dom";
import {
  Bus, Building2, Calendar, Clock, Plane, Star,
} from "lucide-react";

const formatMoney = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(value || 0)} đ`;

function formatDate(dateString) {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export function FlashSaleCard({ tour, item }) {
  const data = item || tour;
  if (!data) return null;

  const tourCode = data.tourCode || `${600000 + Number(data.id || 1)}`;
  const departureFrom = data.departureFrom || data.departureLocation || "Chưa cập nhật";
  const duration = data.duration || "Chưa cập nhật";
  const isPlane =
    data.type === "international" ||
    (data.vehicle && data.vehicle.toLowerCase().includes("bay"));
  const vehicle = data.vehicle || (isPlane ? "Máy bay Vietnam Airlines" : "Xe Limousine 24 chỗ");
  const availableSlots =
    data.stock !== undefined && data.stock !== null
      ? data.stock
      : data.availableSlots ?? data.maxPeople ?? 0;
  const departureDate = data.departureTime || data.departureDate;

  return (
    <Link
      to={`/tour/${encodeURIComponent(data.slug || data.id)}`}
      className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between border border-gray-200/90 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden h-44 sm:h-48 bg-gray-100">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        {data.discount > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-md animate-pulse">
            -{data.discount}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-[14px] leading-snug line-clamp-2 min-h-10 group-hover:text-blue-600 transition-colors">
            {data.name}
          </h3>

          <div>
            {data.originalPrice > data.price && (
              <p className="text-gray-400 text-xs line-through">
                {formatMoney(data.originalPrice)}
              </p>
            )}
            <p className="text-red-600 font-black text-lg tracking-tight">
              {formatMoney(data.price)}
            </p>
          </div>

          <div className="space-y-1 text-[11.5px] text-gray-600 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-gray-400 font-mono font-bold">|||</span>
              <span>Mã Tour:</span>
              <span className="font-semibold text-gray-800">{tourCode}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Nơi Khởi Hành:</span>
              <span className="font-medium text-gray-700 truncate">{departureFrom}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Ngày Khởi Hành:</span>
              <span className="font-medium text-gray-700">{formatDate(departureDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Thời Gian:</span>
              <span className="font-medium text-gray-700">{duration}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              {isPlane ? (
                <Plane className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <Bus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span>Phương tiện:</span>
              <span className="font-medium text-gray-700 truncate">{vehicle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-gray-400 text-[11px] ml-1 font-medium">
              ({data.rating || 5})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <span>Số chỗ còn:</span>
            <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded-md min-w-[22px] text-center shadow-xs">
              {availableSlots}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TourSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
}

export default FlashSaleCard;
