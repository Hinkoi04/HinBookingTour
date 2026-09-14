import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Calendar, Bus, Plane, Tag, Hash, Building2 } from "lucide-react";

function formatMoney(num) {
  if (!num) return "0 đ";
  return new Intl.NumberFormat("vi-VN").format(num) + " đ";
}

function formatDate(dateStr) {
  if (!dateStr) return "15/09/2026";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function TourCard({ tour }) {
  const isPlane =
    tour.type === "international" ||
    (tour.vehicle && tour.vehicle.toLowerCase().includes("bay"));

  const tourCode = tour.tourCode || `${600000 + Number(tour.id || 1)}`;
  const departureFrom = tour.departureLocation || tour.departureFrom || "Hồ Chí Minh";
  const formattedDate = formatDate(tour.departureDate);
  const duration = tour.duration || "3 Ngày 2 Đêm";
  const vehicle = tour.vehicle || (isPlane ? "Máy bay Vietnam Airlines" : "Xe Limousine 24 chỗ");
  const availableSlots = tour.availableSlots !== undefined ? tour.availableSlots : (tour.maxPeople || 40);

  return (
    <Link
      to={`/tour/${tour.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between border border-gray-200/90 hover:-translate-y-1"
    >
      {/* Tour Image */}
      <div className="relative overflow-hidden h-44 sm:h-48 bg-gray-100">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
          }}
        />

        {/* Small brand/badge indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {tour.discount > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-md animate-pulse">
            -{tour.discount}%
          </span>
        )}
      </div>

      {/* Tour Content */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-[14px] leading-snug line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
            {tour.name}
          </h3>

          {/* Price */}
          <div className="my-1.5">
            <span className="text-red-600 font-black text-lg tracking-tight">
              {formatMoney(tour.price)}
            </span>
          </div>

          {/* Metadata attributes matching screenshot */}
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
              <span className="font-medium text-gray-700">{formattedDate}</span>
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

        {/* Footer: Star rating & Available slots */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3 h-3 text-yellow-400 fill-yellow-400"
              />
            ))}
            <span className="text-gray-400 text-[11px] ml-1 font-medium">
              ({tour.rating || 5})
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

export default TourCard;
