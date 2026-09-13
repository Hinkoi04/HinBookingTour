import { RefreshCcw, XCircle } from "lucide-react";

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

export function CouponTrashTable({ coupons, onRestore, onPermanentDelete, getAccountName }) {
  if (coupons.length === 0) {
    return <div className="text-center py-10 text-gray-500">Thùng rác trống.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead >
          <tr className="border-b bg-gray-50/50">
            <th className="px-4 py-3 font-medium">Mã Code</th>
            <th className="px-4 py-3 font-medium">Người xóa</th>
            <th className="px-4 py-3 font-medium">Ngày xóa</th>
            <th className="px-4 py-3 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-red-50/30 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 line-through opacity-70">
                {coupon.code}
              </td>
              <td className="px-4 py-3">
                {getAccountName(coupon.deletedBy) || "Hệ thống"}
              </td>
              <td className="px-4 py-3">
                {formatDate(coupon.deletedAt)}
              </td>
              <td className="px-4 py-3 text-right flex justify-end gap-2">
                <button 
                  onClick={() => onRestore(coupon.id)} 
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onPermanentDelete(coupon.id)} 
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}