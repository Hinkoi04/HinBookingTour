import React from "react";
import { getPaymentStatusBadge } from "./BookingTable";

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thất bại" },
  { value: "refunded", label: "Đã hoàn tiền" },
];

export const PaymentHistory = ({ payments, formatCurrency, formatDate, onChangePaymentStatus }) => {
  if (!payments || payments.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Lịch sử thanh toán</h3>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 font-medium text-gray-600 border-b border-gray-100">
            <tr>
              <th className="p-3">Mã GD</th>
              <th className="p-3">Phương thức</th>
              <th className="p-3 text-right">Số tiền</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3">Ngày thanh toán</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((pm) => (
              <tr key={pm.id}>
                <td className="p-3 font-mono text-xs ">{pm.transactionId || "không có"}</td>
                <td className="p-3">
                  <div className="text-center" >{pm.paymentMethod}</div>
                  <div className="text-xs text-gray-500 text-center">{pm.paymentType} %</div>
                </td>
                <td className="p-3 text-right font-medium">{formatCurrency(pm.amount)}</td>
                <td className="p-3 text-center">
                  {getPaymentStatusBadge(pm.paymentStatus)}
                </td>
                <td className="p-3 text-gray-600">
                  {pm.paidAt ? formatDate(pm.paidAt) : "Chưa thanh toán"}
                </td>
                <td className="p-3 text-center">
                  {onChangePaymentStatus && (
                    <select
                      value={pm.paymentStatus}
                      onChange={(e) => onChangePaymentStatus(pm.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                      title="Đổi trạng thái thanh toán"
                    >
                      {PAYMENT_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};