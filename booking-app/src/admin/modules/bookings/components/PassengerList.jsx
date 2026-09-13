import React, { useState } from "react";
import { Edit } from "lucide-react";
import { PassengerEditModal } from "./PassengerEditModal";

export const PassengerList = ({ passengers, onUpdatePassenger, bookingStatus }) => {
  const [editingPassenger, setEditingPassenger] = useState(null);
  const canEdit = bookingStatus === "pending" || bookingStatus === "confirmed";

  if (!passengers || passengers.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Danh sách hành khách</h3>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 font-medium text-gray-600 border-b border-gray-100">
            <tr>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Ngày sinh</th>
              <th className="p-3">Giới tính</th>
              <th className="p-3">Số CMND/Hộ chiếu</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3">Loại</th>
              {canEdit && (
                <th className="p-3 text-center">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {passengers.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-medium">{p.fullName}</td>
                <td className="p-3">{p.dob || "---"}</td>
                <td className="p-3">{p.gender || "---"}</td>
                <td className="p-3">{p.identityCard || "---"}</td>
                <td className="p-3">{p.phone || "---"}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {p.passengerType === "adult" ? "Người lớn" : p.passengerType === "child" ? "Trẻ em" : p.passengerType === "baby" ? "Em bé" : "---"  }
                  </span>
                </td>
                {canEdit && (
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setEditingPassenger(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PassengerEditModal
        passenger={editingPassenger}
        isOpen={!!editingPassenger}
        onClose={() => setEditingPassenger(null)}
        onSave={onUpdatePassenger}
      />
    </div>
  );
};