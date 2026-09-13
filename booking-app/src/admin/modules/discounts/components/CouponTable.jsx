import { Edit, Trash, Eye } from "lucide-react";

export function CouponTable({ coupons, onEdit, onDelete, onView, canUpdate, canDelete }) {
  if (coupons.length === 0) {
    return <div className="text-center py-10 text-gray-500">Chưa có mã giảm giá nào.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 font-medium">Mã Code</th>
            <th className="px-4 py-3 font-medium">Mức giảm</th>
            <th className="px-4 py-3 font-medium">Đã dùng</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{coupon.code}</td>
              <td className="px-4 py-3">
                <span className="font-medium text-blue-600">
                  {coupon.discountPercentage || 0}%
                </span>
                {coupon.maxDiscountAmount ? (
                  <span className="text-xs text-gray-500 block mt-0.5">
                    Tối đa {(coupon.maxDiscountAmount).toLocaleString()}đ
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 block mt-0.5">
                    Không giới hạn
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {coupon.usedCount || 0} / {coupon.quantity || "∞"}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coupon.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {coupon.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => onView(coupon)} 
                  className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg mr-2 transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {canUpdate && (
                  <button 
                    onClick={() => onEdit(coupon)} 
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button 
                    onClick={() => onDelete(coupon.id)} 
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Chuyển vào thùng rác"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}