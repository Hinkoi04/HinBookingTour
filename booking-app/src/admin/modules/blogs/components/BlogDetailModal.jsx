import { X } from "lucide-react";

export function BlogDetailModal({ isOpen, onClose, blog, getAccountName }) {
  if (!isOpen || !blog) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết bài viết</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {blog.thumbnail && (
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover rounded-xl border border-gray-100" />
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                blog.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {blog.status === "published" ? "Đã đăng" : "Nháp"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{blog.title}</h3>
            <p className="text-gray-500 text-sm">{blog.description}</p>
          </div>

          <div
            className="prose prose-sm max-w-none text-gray-700 border-t border-gray-100 pt-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
            <h4 className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Thông tin hệ thống</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-400">Ngày tạo</p>
                <p className="font-medium text-gray-800">{formatDate(blog.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-400">Người tạo</p>
                <p className="font-medium text-gray-800">
                  {blog.createdBy ? (getAccountName?.(blog.createdBy) || `NV #${blog.createdBy}`) : "Hệ thống"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Cập nhật lần cuối</p>
                <p className="font-medium text-gray-800">{formatDate(blog.updatedAt)}</p>
              </div>
              <div>
                <p className="text-gray-400">Người cập nhật</p>
                <p className="font-medium text-gray-800">
                  {blog.updatedBy ? (getAccountName?.(blog.updatedBy) || `NV #${blog.updatedBy}`) : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}