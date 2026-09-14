import { Link } from "react-router-dom";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function FlashSaleCard({ tour, item }) {
  const data = item || tour;
  if (!data) return null;

  const dateText = formatShortDate(data.departureTime);

  return (
    <Link
      to={`/tour/${data.id}`}
      className="flex-shrink-0 w-72 sm:w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 group shadow-lg flex flex-col justify-between"
    >
      <div className="relative h-44 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Discount Badge */}
        {data.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
            -{data.discount}%
          </div>
        )}

        {/* Departure Date Badge */}
        {dateText && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-yellow-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
            <span>📅</span> {dateText}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-sm line-clamp-2 leading-tight drop-shadow-sm">
            {data.name}
          </p>
        </div>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            {data.originalPrice && (
              <p className="text-white/60 text-xs line-through">
                {fmt(data.originalPrice)}
              </p>
            )}
            <p className="text-yellow-300 text-xl font-black">{fmt(data.price)}</p>
          </div>
          <span className="bg-yellow-400 group-hover:bg-yellow-300 text-gray-900 text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md group-hover:scale-105">
            Săn ngay
          </span>
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
