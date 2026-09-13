import { Edit, Trash2, Bus, Train, Plane, Ship, UserX, RefreshCcw, AlertTriangle, Trash } from "lucide-react";

const VEHICLE_TYPE_MAP = {
  BUS: { label: "Xe ô tô / Khách", icon: Bus, color: "text-blue-600 bg-blue-50" },
  TRAIN: { label: "Tàu hỏa", icon: Train, color: "text-orange-600 bg-orange-50" },
  PLANE: { label: "Máy bay", icon: Plane, color: "text-sky-600 bg-sky-50" },
  SHIP: { label: "Tàu thủy", icon: Ship, color: "text-teal-600 bg-teal-50" },
};

export function VehicleTable({ vehicles, onEdit, onDelete, getAccountName, canUpdate, canDelete }) {
  const hasAction = canUpdate || canDelete;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Tên phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Loại phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Ngày tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Người tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((vehicle, index) => {
            const typeInfo = VEHICLE_TYPE_MAP[vehicle.vehicleType] || { label: vehicle.vehicleType, icon: Bus, color: "text-gray-600 bg-gray-50" };
            const TypeIcon = typeInfo.icon;
            const dateDisplay = vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString('vi-VN') : "N/A";

            return (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 font-bold text-gray-900">{vehicle.name}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${typeInfo.color}`}>
                    <TypeIcon className="w-3.5 h-3.5" />
                    {typeInfo.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{dateDisplay}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {vehicle.createdBy ? (getAccountName(vehicle.createdBy) || `NV #${vehicle.createdBy}`) : "Hệ thống"}
                </td>
                {hasAction && (
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      {canUpdate && (
                        <button onClick={() => onEdit(vehicle)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(vehicle.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function VehicleTrashTable({ vehicles, onRestore, onPermanentDelete, getAccountName, canUpdate, canDelete }) {
  const hasAction = canUpdate || canDelete;

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : "—";
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Trash className="w-8 h-8 text-gray-300" />
        </div>
        <p className="font-medium text-gray-600">Thùng rác trống</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Thông tin</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Loại</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Người tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 border-l border-red-100 bg-red-50/30">Ngày xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 bg-red-50/30">Người xóa</th>
            {hasAction && (
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((v) => {
            const typeInfo = VEHICLE_TYPE_MAP[v.vehicleType] || { label: v.vehicleType, icon: Bus, color: "text-gray-600 bg-gray-50" };
            const TypeIcon = typeInfo.icon;
            return (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-bold text-gray-900">{v.name}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${typeInfo.color}`}>
                    <TypeIcon className="w-3.5 h-3.5" />
                    {typeInfo.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-600">
                  {v.createdBy ? (getAccountName(v.createdBy) || `NV #${v.createdBy}`) : "Hệ thống"}
                </td>
                <td className="py-3 px-4 text-xs text-red-600 font-medium border-l border-red-50 bg-red-50/10">
                  {formatDate(v.deletedAt)}
                </td>
                <td className="py-3 px-4 text-xs text-gray-700 bg-red-50/10">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <UserX className="w-3 h-3 text-red-400" />
                    {v.deletedBy ? (getAccountName(v.deletedBy) || `NV #${v.deletedBy}`) : "Hệ thống"}
                  </div>
                </td>
                {hasAction && (
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      {canUpdate && (
                        <button onClick={() => onRestore(v.id)} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors" title="Khôi phục">
                          <RefreshCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onPermanentDelete(v.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors" title="Xóa vĩnh viễn">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}