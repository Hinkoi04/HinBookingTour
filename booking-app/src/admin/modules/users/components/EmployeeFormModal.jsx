import { X } from "lucide-react";

export function EmployeeFormModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  roles = [],
  isEdit = false,
  loading = false
}) {
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.fullName || !formData.fullName.trim()) {
      alert("Vui lòng nhập họ và tên!");
      return;
    }
    if (!formData.email || !formData.email.trim()) {
      alert("Vui lòng nhập email đăng nhập!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ!");
      return;
    }
    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (!formData.roleId) {
      alert("Vui lòng chọn phân quyền!");
      return;
    }

    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Cập nhật nhân viên" : "Tạo tài khoản nhân viên"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isEdit ? "Chỉnh sửa thông tin nhân viên" : "Cấp quyền truy cập hệ thống cho nhân sự mới"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.fullName} 
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
              placeholder="Nguyễn Văn A" 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email đăng nhập <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="employee@tourcompany.com" 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEdit ? "Mật khẩu mới" : "Mật khẩu"} {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                placeholder={isEdit ? "Để trống nếu không đổi" : "••••••••"} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="0912..." 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chức danh</label>
              <input 
                type="text" 
                value={formData.jobTitle} 
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} 
                placeholder="Kế toán viên..." 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phân quyền <span className="text-red-500">*</span></label>
              <select
                value={formData.roleId || ""}
                onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
              >
                {roles.length === 0 && (
                  <option value="" disabled>Đang tải danh sách phân quyền...</option>
                )}
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </select>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : (isEdit ? "Cập nhật" : "Tạo tài khoản")}
          </button>
        </div>
      </div>
    </div>
  );
}