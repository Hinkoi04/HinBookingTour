import { Eye, EyeOff, Trash2, Star, RotateCcw, AlertTriangle } from "lucide-react";

export function ReviewTable({ reviews, onToggleVisibility, onDelete, isTrashView, onRestore, onHardDelete, canUpdate, canDelete }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const hasActionPermission = canUpdate || canDelete;

  if (reviews.length === 0) {
    return <div className="text-center py-10 text-gray-400 text-sm">Không có dữ liệu</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nhận xét</th>
            
            {isTrashView ? (
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Người xóa</th>
            ) : (
              <>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày duyệt</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Người duyệt</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
              </>
            )}
            
            {hasActionPermission && (
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-gray-50 transition-colors">
              
              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                {review.userFullName || `Khách hàng #${review.userId}`}
              </td>
              
              <td className="py-3 px-4 text-sm text-gray-700 max-w-[150px] truncate" title={review.tourTitle}>
                {review.tourTitle || `Tour #${review.tourId}`}
              </td>
              
              <td className="py-3 px-4">
                <div className="flex flex-col gap-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 max-w-[200px] truncate" title={review.content}>
                    {review.content}
                  </span>
                </div>
              </td>
              
              {isTrashView ? (
                <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                  {review.deletedByName}
                </td>
              ) : (
                <>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {review.isApproved ? formatDate(review.updatedAt) : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                    {review.approvedByName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      review.isApproved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                </>
              )}

              {hasActionPermission && (
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    {isTrashView ? (
                      <>
                        {canUpdate && (
                          <button
                            onClick={() => onRestore(review.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Khôi phục"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onHardDelete(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Xóa vĩnh viễn"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {canUpdate && (
                          <button
                            onClick={() => onToggleVisibility(review.id)}
                            className={`p-2 rounded-md transition-colors ${
                              review.isApproved ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                            }`}
                            title={review.isApproved ? "Bỏ duyệt / Ẩn" : "Duyệt / Hiển thị"}
                          >
                            {review.isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onDelete(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Chuyển vào thùng rác"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}