import { X, Save } from "lucide-react";

export function VehicleModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Cập nhật phương tiện" : "Thêm phương tiện mới"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên phương tiện <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="VD: Xe khách Phương Trang, Vietjet Air..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại phương tiện <span className="text-red-500">*</span></label>
            <select 
              value={formData.vehicleType} 
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm bg-white"
            >
              <option value="BUS">Xe ô tô / Xe khách</option>
              <option value="TRAIN">Tàu hỏa</option>
              <option value="PLANE">Máy bay</option>
              <option value="SHIP">Tàu thủy / Du thuyền</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Hủy bỏ
          </button>
          <button onClick={onSubmit} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            {isEdit ? "Cập nhật" : "Lưu dữ liệu"}
          </button>
        </div>
        
      </div>
    </div>
  );
}