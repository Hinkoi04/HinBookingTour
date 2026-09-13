import { Plus, X } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';

export function TourItinerary({ itinerary, onAddDay, onRemoveDay, onUpdateDay }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Lộ trình chi tiết</h2>
        <button
          type="button"
          onClick={onAddDay}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm ngày
        </button>
      </div>
      <div className="p-6 space-y-6">
        {itinerary.map((item, index) => (
          <div key={index} className="relative p-5 bg-gray-50 border border-gray-200 rounded-xl">
            {itinerary.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveDay(index)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Xóa ngày này"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4 pr-8">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-gray-900">Ngày {item.dayNumber}</h3>
                <select
                  value={item.status || 'active'}
                  onChange={(e) => onUpdateDay(index, "status", e.target.value)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="active">🟢 Đang hoạt động</option>
                  <option value="inactive">🔴 Ẩn</option>
                </select>
              </div>
              
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => onUpdateDay(index, "title", e.target.value)}
                placeholder="Tiêu đề (VD: Hà Nội - Vịnh Hạ Long)"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              
              <div className="prose max-w-none">
                <Editor
                  apiKey='k5ysd87u5tqf2yutdbl7n3fcwvyjhwfuc32p5kzi50tytfb8'
                  value={item.content || ''} 
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                  }}
                  onEditorChange={(content) => onUpdateDay(index, "content", content)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}