import { Eye, Lock, Unlock, ShieldCheck, User, Trash2, Edit } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";

const RoleBadge = ({ roleId, roleName }) => {
  if (roleId === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <ShieldCheck className="w-3.5 h-3.5" /> {roleName || "Admin"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
      <User className="w-3.5 h-3.5" /> {roleName || "Staff"}
    </span>
  );
};

export function EmployeeTable({ data, onView, onToggleLock, onDelete, onEdit, startIndex = 0 }) {
  const { hasPermission } = usePermission();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nhân viên</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Liên hệ</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Chức vụ</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày tham gia</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((employee, index) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{startIndex + index + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-500 font-bold">
                    {employee.avatar ? (
                      <img src={employee.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      employee.fullName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{employee.fullName}</div>
                    <div className="text-sm"><RoleBadge roleId={employee.roleId} roleName={employee.roleName} /></div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="text-gray-900">{employee.email}</div>
                <div className="text-gray-500 mt-0.5">{employee.phone || "—"}</div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{employee.jobTitle || "—"}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('vi-VN') : "—"}
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  employee.status === "active" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                }`}>
                  {employee.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button 
                    onClick={() => onView(employee)} 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" 
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {hasPermission("UPDATE_USER") && (
                    <>
                      <button 
                        onClick={() => onEdit(employee)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="Sửa thông tin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onToggleLock(employee.id, "employee", employee.status)} 
                        className={`p-2 rounded-md transition-colors ${
                          employee.status === "active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                        }`}
                        title={employee.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      >
                        {employee.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </>
                  )}

                  {hasPermission("DELETE_USER") && (
                    <button 
                      onClick={() => onDelete(employee.id, "employee")} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                      title="Chuyển vào thùng rác"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                Không có dữ liệu nhân viên
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}