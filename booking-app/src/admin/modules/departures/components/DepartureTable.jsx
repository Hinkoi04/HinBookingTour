import { useState, useMemo } from "react";
import { Edit, Trash2, Eye, Bus, Plane, Train, Ship, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";

export function DepartureTable({ departures, onView, onEdit, onDelete }) {
  const { hasPermission } = usePermission();

  const [sortConfig, setSortConfig] = useState({ key: "tourTitle", direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDepartures = useMemo(() => {
    const sorted = [...departures];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key] !== null && a[sortConfig.key] !== undefined ? a[sortConfig.key] : "";
        let bValue = b[sortConfig.key] !== null && b[sortConfig.key] !== undefined ? b[sortConfig.key] : "";

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [departures, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />;
    }
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4 text-gray-800" /> : <ChevronDown className="w-4 h-4 text-gray-800" />;
  };

  const renderVehicle = (type, name) => {
    if (!name) return <span className="text-gray-400 text-xs">—</span>;
    let Icon = Bus;
    if (type === "PLANE") Icon = Plane;
    if (type === "TRAIN") Icon = Train;
    if (type === "SHIP") Icon = Ship;
    return (
      <div className="flex items-center gap-1.5 text-blue-600 font-medium text-xs mt-1" title={name}>
        <Icon className="w-3.5 h-3.5" />
        <span className="truncate max-w-[150px]">{name}</span>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1050px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th onClick={() => handleSort("tourTitle")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Tên Tou {renderSortIcon("tourTitle")}</div>
            </th>
            <th onClick={() => handleSort("departureFrom")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-32 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Điểm đi {renderSortIcon("departureFrom")}</div>
            </th>
            <th onClick={() => handleSort("startTime")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-48 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Khởi hành & HDV {renderSortIcon("startTime")}</div>
            </th>
            <th onClick={() => handleSort("priceAdult")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-32 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Giá vé {renderSortIcon("priceAdult")}</div>
            </th>
            <th onClick={() => handleSort("status")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-35 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Trạng thái {renderSortIcon("status")}</div>
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          
          {sortedDepartures.map((departure) => {
            const dateDisplay = departure.startTime ? new Date(departure.startTime).toLocaleString('vi-VN') : "N/A";
            return (
              <tr key={departure.id} className="hover:bg-blue-50/50 transition-colors">
                
                <td className="py-3 px-4">
                  <div className="font-bold text-gray-800 text-sm truncate max-w-[300px]" title={departure.tourTitle}>
                    {departure.tourTitle || "Tour chưa xác định"}
                  </div>
                </td>
                
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-700 truncate max-w-[120px]" title={departure.departureFrom}>
                    {departure.departureFrom || "—"}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">{dateDisplay}</div>
                  <div className="text-sm font-medium text-blue-600">{departure.guideName || "Đang cập nhật"}</div>
                  
                </td>
                
                <td className="py-3 px-4 text-sm font-medium text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(departure.priceAdult)}
                </td>
                

                
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    departure.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {(departure.status==="active")?"Đang mở":"Đang đóng"}
                  </span>
                </td>
                
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onView?.(departure); }} 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {hasPermission("UPDATE_OPERATIONS") && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(departure); }} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="Sửa lịch"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    
                    {hasPermission("DELETE_OPERATIONS") && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(departure.id); }} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="Xóa lịch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          
          {sortedDepartures.length === 0 && (
            <tr>
              <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                Không có dữ liệu lịch khởi hành
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function DepartureTrashTable({ departures, onRestore, onPermanentDelete, getAccountName }) {
  const { hasPermission } = usePermission(); 

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : "—";
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Mã lịch</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Tên Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Khởi hành</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Người xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Thời gian xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {departures.map((departure) => (
            <tr key={departure.id} className="hover:bg-red-50/30 transition-colors opacity-80">
              <td className="py-3 px-4 text-sm text-gray-500 font-medium">#{departure.id}</td>
              <td className="py-3 px-4 font-bold text-gray-700">{departure.tourTitle || "—"}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{formatDate(departure.startTime)}</td>
              <td className="py-3 px-4 text-sm text-red-600 font-medium">
                {departure.deletedBy 
                  ? (getAccountName?.(departure.deletedBy) || `Nhân viên ${departure.deletedBy}`) 
                  : "Hệ thống"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatDate(departure.deletedAt)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  {hasPermission("OPERATIONS_TRASH") && (
                    <>
                      <button 
                        onClick={() => onRestore(departure.id)} 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" 
                        title="Khôi phục"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onPermanentDelete(departure.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          
          {departures.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                Thùng rác trống
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}