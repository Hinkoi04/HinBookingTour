import { RotateCcw, Trash2, ShieldCheck } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";

export function TrashTable({ data, onRestore, onForceDelete, startIndex = 0 }) {
  const { hasPermission } = usePermission();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nhân viên</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{startIndex + index + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-gray-900">{item.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{item.email}</td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.deletedAt ? new Date(item.deletedAt).toLocaleString('vi-VN') : "—"}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  
                  {/* 👉 [THAY ĐỔI] Check quyền UPDATE_USER cho Khôi phục */}
                  {hasPermission("UPDATE_USER") && (
                    <button
                      onClick={() => onRestore(item.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="Khôi phục"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* 👉 [THAY ĐỔI] Check quyền DELETE_USER cho Xóa vĩnh viễn */}
                  {hasPermission("DELETE_USER") && (
                    <button
                      onClick={() => onForceDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Xóa vĩnh viễn"
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
              <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">
                Không có dữ liệu trong thùng rác
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}