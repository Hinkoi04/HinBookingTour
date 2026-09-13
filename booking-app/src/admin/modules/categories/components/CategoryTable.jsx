import { Edit, Trash2, RotateCcw, Eye } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";

export function CategoryTable({ categories, onView, onEdit, onDelete, startIndex = 0 }) {
  const { hasPermission } = usePermission();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Tên danh mục</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Mô tả</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Số lượng tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category, index) => (
            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{startIndex + index + 1}</td>
              <td className="py-3 px-4 font-medium text-gray-900">{category.title}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{category.description || "—"}</td>
              
              <td className="py-3 px-4 text-sm text-blue-600 font-medium">
                {category.tourCount || 0} tour
              </td>
              
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onView(category)}
                    className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                    title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {hasPermission("UPDATE_CATEGORY") && (
                    <button 
                      onClick={() => onEdit(category)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* 👉 [THÊM MỚI] Phân quyền xóa danh mục */}
                  {hasPermission("DELETE_CATEGORY") && (
                    <button 
                      onClick={() => onDelete(category.id)} 
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
        </tbody>
      </table>
    </div>
  );
}

export function CategoryTrashTable({ categories, onRestore, onPermanentDelete, accounts = [], startIndex = 0 }) {
  const { hasPermission } = usePermission();

  const getFullName = (id) => {
    const account = accounts.find(acc => acc.id === id);
    return account ? account.fullName : `Account #${id}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Tên danh mục</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Người xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Thời gian xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category, index) => (
            <tr key={category.id} className="hover:bg-gray-50 transition-colors opacity-75">
              <td className="py-3 px-4 text-sm text-gray-500">{startIndex + index + 1}</td>
              <td className="py-3 px-4 font-medium text-gray-500">{category.title}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {category.deletedBy ? getFullName(category.deletedBy) : "—"}
              </td> 
              <td className="py-3 px-4 text-sm text-gray-600">
                {category.deletedAt ? new Date(category.deletedAt).toLocaleString('vi-VN') : "—"}
              </td>
              
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  {hasPermission("DELETE_CATEGORY") && (
                    <>
                      <button 
                        onClick={() => onRestore(category.id)} 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Khôi phục danh mục"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onPermanentDelete(category.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}