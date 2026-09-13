import { X, Edit } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";

export function UserDetailModal({ isOpen, onClose, user, onEdit, accounts = [] }) {
  const { hasPermission } = usePermission();

  if (!isOpen || !user) return null;

  const isEmployee = user.role === "employee";
  const roleName = user.roleName || (user.roleId === 1 ? "Admin" : "Staff");

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getDisplayName = (id) => {
    if (!id) return "—";
    const foundAcc = accounts.find(acc => acc.id === id);
    return foundAcc ? foundAcc.fullName : `Account #${id}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEmployee ? "Chi tiết nhân viên" : "Chi tiết khách hàng"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEmployee ? `ID: ${user.id} · ${roleName}` : `ID: ${user.id}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</label>
              <p className="text-gray-900 font-medium">{user.fullName || user.name}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</label>
              <p className="text-gray-900">{user.phone || "—"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</label>
              <p className="text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {user.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </p>
            </div>
          </div>

          {isEmployee && (
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</label>
                <p className="text-gray-900">{user.jobTitle || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</label>
                <p className="text-gray-900">{roleName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</label>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover mt-1" />
                ) : (
                  <p className="text-gray-400">—</p>
                )}
              </div>
            </div>
          )}

          {/* Thông tin kiểm toán */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin kiểm toán</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs text-gray-500">Người tạo</label>
                <p className="font-medium text-gray-900">{getDisplayName(user.createdBy)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Ngày tạo</label>
                <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Người cập nhật</label>
                <p className="font-medium text-gray-900">{getDisplayName(user.updatedBy)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Ngày cập nhật</label>
                <p className="font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
              {user.deletedAt && (
                <>
                  <div>
                    <label className="text-xs text-gray-500">Người xóa</label>
                    <p className="font-medium text-gray-900">{getDisplayName(user.deletedBy)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Ngày xóa</label>
                    <p className="font-medium text-gray-900">{formatDate(user.deletedAt)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer với nút hành động */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          {isEmployee && onEdit && hasPermission("UPDATE_USER") && (
            <button
              onClick={() => onEdit(user)}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Sửa thông tin
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}