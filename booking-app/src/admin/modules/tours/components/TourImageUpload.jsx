import { useState, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

export function TourImageUpload({
  thumbnail,
  onThumbnailChange,
  onThumbnailRemove,
  imageFile,
  galleryFiles,
  galleryPreviews,
  onGalleryChange,
  onGalleryRemove,
}) {

  const handleThumbnailInput = (e) => {
    const file = e.target.files?.[0] || null;
    onThumbnailChange(file);
    e.target.value = "";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Hình ảnh</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ảnh đại diện (Thumbnail)
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
            {thumbnail ? (
              <div className="relative">
                <img src={thumbnail} alt="Preview" className="w-full h-52 object-cover" />
                {imageFile && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="text-xs text-white truncate">{imageFile.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onThumbnailRemove}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-52 cursor-pointer group/upload">
                <div className="w-14 h-14 mb-3 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:shadow-md transition-all">
                  <Upload className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Nhấn để chọn ảnh</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Tối đa 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailInput} />
              </label>
            )}
          </div>

          {thumbnail && (
            <label className="w-full mt-3 inline-flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" /> Đổi ảnh đại diện
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailInput} />
            </label>
          )}

          {!imageFile && !thumbnail && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Hoặc nhập URL ảnh"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={(e) => onThumbnailChange(null, e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 pt-5 mt-5">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh phụ (Gallery)</label>
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
              {galleryPreviews.length}/5 ảnh
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {galleryPreviews.map((url, idx) => (
              <div key={idx} className="relative aspect-square border border-gray-200 rounded-xl overflow-hidden group shadow-sm">
                <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onGalleryRemove(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-md hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {galleryPreviews.length < 5 && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Thêm ảnh</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onGalleryChange} />
              </label>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}