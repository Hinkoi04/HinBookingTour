import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export function BlogTable({ blogs, onView, onDelete, getAccountName, canUpdate, canDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-20">Ảnh</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tiêu đề</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-36">Ngày tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Người tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {blogs.map((blog, index) => (
            <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4">
                {blog.thumbnail ? (
                  <img src={blog.thumbnail} alt={blog.title} className="w-12 h-12 rounded-lg object-cover border" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs border">
                    No img
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.description}</p>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  blog.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {blog.status === "published" ? "Đã đăng" : "Nháp"}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {blog.createdBy ? (getAccountName?.(blog.createdBy) || `NV #${blog.createdBy}`) : "Hệ thống"}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  
                  <button onClick={() => onView(blog)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" title="Xem">
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {canUpdate && (
                    <Link to={`/admin/blogs/edit/${blog.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa">
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                  
                  {canDelete && (
                    <button onClick={() => onDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
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