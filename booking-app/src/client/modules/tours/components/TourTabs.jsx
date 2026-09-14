import { useState } from "react";
import { Check, X, Star, Send, ThumbsUp, Image as ImageIcon } from "lucide-react";
import { StarRow } from "./StarRow";

export function TourTabs({ tour, reviews = [], avgRating = 5, onAddReview }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", author: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  const images = Array.isArray(tour.images) && tour.images.length > 0
    ? tour.images
    : [tour.image].filter(Boolean);

  const handleReviewSubmit = (e) => {
    e?.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) return;
    onAddReview(newReview);
    setNewReview({ rating: 5, comment: "", author: "" });
    setShowReviewForm(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      {/* Tabs bar */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {[
          { key: "overview", label: "Tổng quan" },
          { key: "itinerary", label: `Lịch trình (${tour.itinerary?.length || 0} ngày)` },
          { key: "gallery", label: `Hình ảnh (${images.length})` },
          { key: "reviews", label: `Đánh giá (${reviews.length + (tour.reviewCount || 0)})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors cursor-pointer text-center ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {tour.description && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2 text-base">Mô tả chuyến đi</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-base">Điểm nổi bật</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tour.highlights?.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 bg-blue-50 rounded-xl p-3">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {h}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </span>
                  Bao gồm
                </h3>
                <ul className="space-y-2">
                  {tour.includes?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-500" />
                  </span>
                  Không bao gồm
                </h3>
                <ul className="space-y-2">
                  {tour.excludes?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div className="space-y-1">
            {tour.itinerary?.map((day, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-sm">
                    {day.day}
                  </div>
                  {i < tour.itinerary.length - 1 && <div className="w-0.5 bg-blue-100 flex-1 my-1" />}
                </div>
                <div className="pb-6 flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 mb-2 text-base">{day.title}</h4>
                  <ul className="space-y-1.5">
                    {day.activities?.map((act, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery / Ảnh phụ Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                <ImageIcon className="w-5 h-5 text-blue-600" /> Bộ sưu tập ảnh chuyến đi
              </h3>
              <span className="text-xs text-gray-500">{images.length} hình ảnh thực tế</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setPreviewModalImg(img)}
                  className="relative h-44 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md border border-gray-100"
                >
                  <img
                    src={img}
                    alt={`Ảnh tour ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <span>🔍 Xem phóng to</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {previewModalImg && (
              <div
                onClick={() => setPreviewModalImg(null)}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
              >
                <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={previewModalImg}
                    alt="Preview"
                    className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewModalImg(null)}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full p-2.5 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center gap-8 p-5 bg-blue-50 rounded-2xl">
              <div className="text-center shrink-0">
                <p className="text-5xl font-black text-blue-600">{avgRating.toFixed(1)}</p>
                <StarRow rating={Math.round(avgRating)} />
                <p className="text-xs text-gray-500 mt-1.5">{reviews.length + (tour.reviewCount || 0)} đánh giá</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = reviews.filter((r) => r.rating === s).length + (s === 5 ? 8 : s === 4 ? 3 : s === 3 ? 1 : 0);
                  const total = reviews.length + (tour.reviewCount || 0);
                  const pct = total ? (count / total) * 100 : 0;
                  return (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-8">{s} ★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-gray-500 w-5 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm((v) => !v)}
              className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Star className="w-4 h-4" /> Viết đánh giá của bạn
            </button>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-gray-800">Đánh giá tour</h4>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Xếp hạng của bạn:</p>
                  <StarRow rating={newReview.rating} interactive onChange={(r) => setNewReview((p) => ({ ...p, rating: r }))} />
                </div>
                <input
                  type="text"
                  placeholder="Tên của bạn *"
                  value={newReview.author}
                  onChange={(e) => setNewReview((p) => ({ ...p, author: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
                <textarea
                  rows={3}
                  placeholder="Chia sẻ trải nghiệm về tour này..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Gửi đánh giá
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {r.author ? r.author.charAt(0) : "K"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{r.author}</p>
                        <p className="text-xs text-gray-400">{r.date ? new Date(r.date).toLocaleDateString("vi-VN") : ""}</p>
                      </div>
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                  <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" /> Hữu ích
                  </button>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-center text-gray-400 py-10">Chưa có đánh giá. Hãy là người đầu tiên!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TourTabs;
