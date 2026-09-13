import React from 'react';
import { Upload, X } from 'lucide-react';

export function ImageUploadAvatar({ avatarUrl, onFileChange, onRemove }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md bg-blue-50 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-blue-600">U</span>
        )}
        {avatarUrl && (
          <button 
            type="button" 
            onClick={onRemove}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <label className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
        <Upload className="w-4 h-4" />
        {avatarUrl ? "Đổi ảnh" : "Chọn ảnh"}
        <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
      </label>
    </div>
  );
}