import { useState } from "react";
import { Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

export function BankTransferDetail({ detail, deposit, orderId }) {
  const [copied, setCopied] = useState("");

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
      toast.success(`Đã sao chép ${label}`);
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-5">Thông tin chuyển khoản</h3>
      <div className="bg-blue-50 rounded-2xl p-5 space-y-4">
        {[
          { label: "Ngân hàng", value: detail.bank },
          { label: "Số tài khoản", value: detail.account, copyable: true },
          { label: "Tên tài khoản", value: detail.name },
          { label: "Nội dung CK", value: `DATCOC ${orderId}`, copyable: true, highlight: true },
          { label: "Số tiền", value: fmt(deposit), highlight: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{row.label}:</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold ${
                  row.highlight ? "text-blue-700 text-base" : "text-gray-800"
                }`}
              >
                {row.value}
              </span>
              {row.copyable && (
                <button
                  type="button"
                  onClick={() => handleCopy(row.value, row.label)}
                  className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {copied === row.label ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 items-start">
        <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Vui lòng chuyển khoản trong vòng <strong>24 giờ</strong> để giữ chỗ. Đơn hàng sẽ tự động hủy nếu quá thời hạn.
        </p>
      </div>
    </div>
  );
}

export function MoMoDetail({ deposit, orderId }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Thanh toán qua MoMo</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 bg-pink-50 rounded-2xl flex items-center justify-center text-6xl border-2 border-pink-200">
          💜
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Chuyển đến số:</p>
          <p className="text-2xl font-black text-gray-800">0901 234 567</p>
          <p className="text-sm text-gray-500">TravelGo</p>
          <p className="text-lg font-black text-pink-600 mt-2">{fmt(deposit)}</p>
        </div>
        <p className="text-xs text-gray-500 text-center">Nội dung: DATCOC {orderId}</p>
      </div>
    </div>
  );
}

export default BankTransferDetail;
