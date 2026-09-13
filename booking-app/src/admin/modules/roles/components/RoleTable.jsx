import React from "react";
import { Edit, Shield, Eye, Lock, Unlock } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";

export const RoleTable = ({ roles, onView, onEdit, onToggleLock }) => {
  const { hasPermission } = usePermission();

  const canEditRole = hasPermission("UPDATE_ROLE");
  const canDeleteRole = hasPermission("DELETE_ROLE");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="py-4 px-4 font-semibold text-gray-600 w-16 text-center">STT</th>
            <th className="py-4 px-4 font-semibold text-gray-600">Tên Vai trò</th>
            <th className="py-4 px-4 font-semibold text-gray-600">Mô tả</th>
            <th className="py-4 px-4 font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-gray-500">
                Không tìm thấy vai trò nào phù hợp
              </td>
            </tr>
          ) : (
            roles.map((role, index) => {
              const isAdmin = role.name?.toUpperCase() === "ADMIN";
              const isLocked = role.deleted === 1;

              return (
                <tr key={role.id} className={`border-b border-gray-50 transition-colors ${isLocked ? 'bg-gray-50/50 opacity-75' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-3 px-4 text-gray-500 font-medium text-center">
                    {index + 1}
                  </td>
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${isAdmin ? 'text-red-500' : isLocked ? 'text-gray-400' : 'text-blue-500'}`} />
                      <span className={`font-semibold ${isLocked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {role.name}
                      </span>
                      {isAdmin && (
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-700 rounded-md">
                          Admin
                        </span>
                      )}
                      {isLocked && (
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-gray-200 text-gray-600 rounded-md">
                          Đã khóa
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                    {role.description || <span className="text-gray-400 italic">Trống</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onView(role)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {!isAdmin ? (
                        <>
                          {/* Ẩn/Hiện nút Sửa dựa trên quyền UPDATE_ROLE */}
                          {canEditRole && (
                            <button 
                              onClick={() => onEdit(role.id)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Sửa vai trò"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {canDeleteRole && (
                            <button 
                              onClick={() => onToggleLock(role)}
                              className={`p-2 rounded-lg transition-colors ${
                                isLocked 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-red-500 hover:bg-red-50'
                              }`}
                              title={isLocked ? "Mở khóa vai trò" : "Khóa vai trò"}
                            >
                              {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                          )}
                        </>
                      ) : (
                        <div 
                          className="p-2 text-gray-300 cursor-not-allowed ml-1" 
                          title="Vai trò hệ thống, không thể thao tác"
                        >
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};