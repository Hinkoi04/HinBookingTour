import { Clock, MapPin, Users } from "lucide-react";
import { StarRow } from "./StarRow";

export function TourHeader({ tour, avgRating = 5, reviewCount = 0 }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-blue-600 font-semibold mb-2">{tour.category}</p>
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{tour.name}</h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-500" />
          {tour.duration}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-500" />
          {tour.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-500" />
          Tối đa {tour.maxPeople} người
        </span>
        <span className="flex items-center gap-1.5 text-gray-500">
          Khởi hành: <strong className="text-gray-700">{tour.departureFrom}</strong>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StarRow rating={Math.round(avgRating)} />
        <span className="text-yellow-500 font-bold">{avgRating.toFixed(1)}</span>
        <span className="text-gray-400 text-sm">({reviewCount} đánh giá)</span>
      </div>
    </div>
  );
}

export default TourHeader;
