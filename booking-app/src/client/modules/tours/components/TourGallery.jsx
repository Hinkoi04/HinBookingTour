import { useState } from "react";
import { ChevronLeft, ChevronRight as RightIcon, Eye, Image as ImageIcon } from "lucide-react";

export function TourGallery({ images = [], tourName = "", discount = 0 }) {
  const [activeImg, setActiveImg] = useState(0);

  const displayImages =
    Array.isArray(images) && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"];

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4 space-y-4">
      {/* Main Feature Image */}
      <div className="relative h-80 sm:h-96 md:h-[450px] rounded-2xl overflow-hidden bg-gray-950 group">
        <img
          src={displayImages[activeImg]}
          alt={`${tourName} - ảnh ${activeImg + 1}`}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
          }}
        />

        {/* Gradient Overlay for controls visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Prev & Next Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveImg(
                  (i) => (i - 1 + displayImages.length) % displayImages.length
                )
              }
              className="absolute left-3.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-md transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveImg((i) => (i + 1) % displayImages.length)
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-md transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Ảnh tiếp theo"
            >
              <RightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-lg">
            FLASH SALE -{discount}%
          </div>
        )}

        {/* Image Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow">
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {activeImg + 1} / {displayImages.length}
          </span>
        </div>
      </div>

      {/* Secondary / Thumbnail Images Gallery (Ảnh Phụ) */}
      {displayImages.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" /> Hình ảnh chi tiết ({displayImages.length} ảnh)
            </span>
            <span className="text-[11px] text-gray-400">Click để chuyển ảnh</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {displayImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`relative flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  i === activeImg
                    ? "border-blue-600 ring-2 ring-blue-500/30 scale-95 shadow-md"
                    : "border-gray-200 hover:border-blue-400 opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Ảnh phụ ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
                  }}
                />
                {i === activeImg && (
                  <div className="absolute inset-0 bg-blue-600/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TourGallery;
