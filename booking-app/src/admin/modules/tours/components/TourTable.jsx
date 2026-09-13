import { useState, useMemo } from "react";
import { Edit, Trash2, RotateCcw, Eye, UserX, Calendar, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { usePermission } from "../../../hooks/usePermission";

export function TourTable({ tours, onView, onDelete, getAccountName }) {
  const { hasPermission } = usePermission();
  
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTours = useMemo(() => {
    const sorted = [...tours];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "createdBy") {
          aValue = getAccountName(a.createdBy) || "";
          bValue = getAccountName(b.createdBy) || "";
        }

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [tours, sortConfig, getAccountName]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />;
    }
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4 text-gray-800" /> : <ChevronDown className="w-4 h-4 text-gray-800" />;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">Ảnh</th>
            
            <th onClick={() => handleSort("name")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-48 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Tên Tour {renderSortIcon("name")}</div>
            </th>
            <th onClick={() => handleSort("category")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-32 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Danh mục {renderSortIcon("category")}</div>
            </th>
            <th onClick={() => handleSort("createdBy")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-32 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Người tạo {renderSortIcon("createdBy")}</div>
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedTours.map((tour, index) => (
            <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4">
                <img src={tour.thumbnail || tour.image} alt="tour" className="w-10 h-10 rounded-md object-cover border" />
              </td>
              <td className="py-3 px-4 font-medium text-gray-900 truncate">
                {tour.name.length > 100 ? tour.name.substring(0, 50) + "..." : tour.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{tour.category}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {tour.createdBy ? (getAccountName(tour.createdBy) || `NV #${tour.createdBy}`) : "Hệ thống"}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  
                  {hasPermission("VIEW_TOUR") && (
                    <button onClick={() => onView(tour)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors" title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  {hasPermission("UPDATE_TOUR") && (
                    <Link to={`/admin/tours/edit/${tour.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                  
                  {hasPermission("DELETE_TOUR") && (
                    <button onClick={() => onDelete(tour.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Chuyển vào thùng rác">
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

export function TourTrashTable({ tours, onRestore, onPermanentDelete, getAccountName }) {
  const { hasPermission } = usePermission();
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedTours = useMemo(() => {
    const sorted = [...tours];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";
        if (sortConfig.key === "name") {
          aValue = a.title || a.name || "";
          bValue = b.title || b.name || "";
        }
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [tours, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />;
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4 text-gray-800" /> : <ChevronDown className="w-4 h-4 text-gray-800" />;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th onClick={() => handleSort("name")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-48 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Tên Tour {renderSortIcon("name")}</div>
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Người tạo</th>
            <th onClick={() => handleSort("deletedAt")} className="py-3 px-4 text-sm font-semibold text-gray-600 w-40 cursor-pointer select-none group">
              <div className="flex items-center gap-1.5">Ngày xóa {renderSortIcon("deletedAt")}</div>
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Người xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedTours.map((tour, index) => (
            <tr key={tour.id} className="hover:bg-gray-50 transition-colors opacity-75">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4 font-medium text-gray-500">{tour.title || tour.name}</td>
              <td className="py-3 px-4 text-xs text-gray-600">
                {tour.createdBy ? (getAccountName(tour.createdBy) || `NV #${tour.createdBy}`) : "Hệ thống"}
              </td>
              <td className="py-3 px-4 text-xs text-red-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  {tour.deletedAt ? new Date(tour.deletedAt).toLocaleString('vi-VN') : "—"}
                </div>
              </td>
              <td className="py-3 px-4 text-xs text-gray-700">
                <div className="flex items-center gap-1.5 font-semibold">
                  <UserX className="w-3 h-3 text-red-400" />
                  {tour.deletedBy ? (getAccountName(tour.deletedBy) || `NV #${tour.deletedBy}`) : "Hệ thống"}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  {hasPermission("DELETE_TOUR") && (
                    <>
                      <button onClick={() => onRestore(tour.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Khôi phục">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={() => onPermanentDelete(tour.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa vĩnh viễn">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
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