import { RotateCcw, Trash2, Calendar, UserX } from "lucide-react";

export function BlogTrashTable({ blogs, onRestore, onHardDelete, getAccountName }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tiêu đề</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-36">Người tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Ngày xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-36">Người xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {blogs.map((blog, index) => (
            <tr key={blog.id} className="hover:bg-gray-50 transition-colors opacity-75">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4">
                <p className="font-medium text-gray-500 line-clamp-1">{blog.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.description}</p>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {blog.createdBy ? (getAccountName?.(blog.createdBy) || `NV #${blog.createdBy}`) : "Hệ thống"}
              </td>
              <td className="py-3 px-4 text-xs text-red-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  {blog.deletedAt ? new Date(blog.deletedAt).toLocaleString("vi-VN") : "—"}
                </div>
              </td>
              <td className="py-3 px-4 text-xs text-gray-700">
                <div className="flex items-center gap-1.5 font-semibold">
                  <UserX className="w-3 h-3 text-red-400" />
                  {blog.deletedBy ? (getAccountName?.(blog.deletedBy) || `NV #${blog.deletedBy}`) : "—"}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onRestore(blog.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Khôi phục">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={() => onHardDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa vĩnh viễn">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}