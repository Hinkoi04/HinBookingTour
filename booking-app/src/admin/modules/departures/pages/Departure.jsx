import { useState, useEffect } from "react";
import { Plus, Lock, Loader2, Trash2 } from "lucide-react"; 
import { DepartureTable, DepartureTrashTable } from "../components/DepartureTable";
import { DepartureModal } from "../components/DepartureModal";
import { DepartureDetailModal } from "../components/DepartureDetailModal"; 
import { departureService } from "../services/departureService";
import { vehicleService } from "../../vehicles/services/vehicleService"; 
import { tourService } from "../../tours/services/tourService";
import { accountService } from "../../users/services/accountService"; 

import Pagination from "../../../components/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";
import { usePermission } from "../../../hooks/usePermission"; 

const initialFormState = {
  tourId: "", vehicleId: "", guideId: "", startTime: "", endDate: "", departureFrom: "", 
  priceAdult: "", priceChildren: "", priceBaby: "",
  stockAdult: "", stockChildren: "", stockBaby: "", status: "active", discount: 0
};

const getCurrentUserId = () => {
  const id = localStorage.getItem("userId"); 
  return id ? parseInt(id) : null;
};

export default function DepartureList() {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("CREATE_OPERATIONS");
  const canManageTrash = hasPermission("OPERATIONS_TRASH");

  const [departures, setDepartures] = useState([]);
  const [trashDepartures, setTrashDepartures] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [vehicles, setVehicles] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [tourList, setTourList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDeparture, setEditDeparture] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [accountList, setAccountList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
    action: null
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleViewDetail = (departureData) => {
    setSelectedDeparture(departureData);
    setIsDetailModalOpen(true);
  };
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [depData, trashData, vehData, tourData, accData] = await Promise.all([
        departureService.getAll(),
        canManageTrash ? departureService.getAllTrash().catch(() => []) : Promise.resolve([]), 
        vehicleService.getAll(),
        tourService.getAll(),
        accountService.getAllActive().catch(() => [])
      ]);
      
      setDepartures(depData);
      setTrashDepartures(trashData);
      setVehicles(vehData);
      setTourList(tourData);
      setAccountList(accData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [canManageTrash, activeTab]);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditDeparture(null);
  };

  const closeConfirm = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  const executeConfirmAction = async () => {
    if (confirmConfig.action) {
      await confirmConfig.action();
    }
    closeConfirm();
  };

  const handleSubmit = () => {
    setConfirmConfig({
      isOpen: true,
      title: editDeparture ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
      message: editDeparture ? "Bạn có chắc chắn muốn lưu các thay đổi cho chuyến đi này?" : "Bạn có chắc chắn muốn tạo lịch khởi hành mới?",
      variant: "info",
      action: async () => {
        try {
          const userId = getCurrentUserId();
          const payload = {
            tourId: parseInt(formData.tourId),
            vehicleId: formData.vehicleId ? parseInt(formData.vehicleId) : null,
            guideId: formData.guideId ? parseInt(formData.guideId) : null,
            startTime: formData.startTime,
            endDate: formData.endDate,
            departureFrom: formData.departureFrom,
            priceAdult: parseFloat(formData.priceAdult) || 0,
            priceChildren: parseFloat(formData.priceChildren) || 0,
            priceBaby: parseFloat(formData.priceBaby) || 0,
            stockAdult: parseInt(formData.stockAdult) || 0,
            stockChildren: parseInt(formData.stockChildren) || 0,
            stockBaby: parseInt(formData.stockBaby) || 0,
            discount: parseInt(formData.discount) || 0,
            status: formData.status,
            createdBy: editDeparture ? undefined : userId,
            updatedBy: editDeparture ? userId : undefined
          };

          if (editDeparture) {
            await departureService.update(editDeparture.id, payload);
          } else {
            await departureService.create(payload);
          }
          
          setIsDialogOpen(false);
          resetForm();
          fetchData(); 
        } catch (error) {
          alert("Lỗi: " + error.message);
        }
      }
    });
  };

  const handleEdit = (departure) => {
    setEditDeparture(departure);
    setFormData({
      tourId: departure.tourId || "", 
      vehicleId: departure.vehicleId || "", 
      guideId: departure.guideId || "",
      startTime: departure.startTime,
      endDate: departure.endDate || "",
      departureFrom: departure.departureFrom || "", 
      discount: departure.discount || 0,
      priceAdult: departure.priceAdult,
      priceChildren: departure.priceChildren,
      priceBaby: departure.priceBaby,
      stockAdult: departure.stockAdult,
      stockChildren: departure.stockChildren,
      stockBaby: departure.stockBaby,
      status: departure.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Hủy chuyến đi",
      message: "Bạn có chắc chắn muốn hủy chuyến đi này?",
      variant: "warning",
      action: async () => {
        try {
          await departureService.delete(id);
          alert("Đã hủy thành công");
          fetchData(); 
        } catch (error) {
          alert("Lỗi: " + error.message);
        }
      }
    });
  };

  const handleRestore = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Khôi phục chuyến đi",
      message: "Bạn có chắc chắn muốn khôi phục lịch khởi hành này từ thùng rác?",
      variant: "info",
      action: async () => {
        try {
          await departureService.restore(id);
          alert("Khôi phục thành công!");
          fetchData();
        } catch (error) {
          alert("Lỗi: " + error.message);
        }
      }
    });
  };

  const handlePermanentDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      message: "Hành động này không thể khôi phục. Bạn có chắc chắn muốn xóa vĩnh viễn chuyến đi này?",
      variant: "danger",
      action: async () => {
        try {
          await departureService.hardDelete(id);
          alert("Đã xóa vĩnh viễn!");
          fetchData();
        } catch (error) {
          alert("Lỗi: " + error.message);
        }
      }
    });
  };

  const getAccountName = (id) => {
    const account = accountList.find(acc => acc.id === id);
    return account ? account.fullName : null; 
  };

  const currentList = activeTab === "active" ? departures : trashDepartures;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch khởi hành</h1>
        </div>
        <div className="flex gap-2">
          {canCreate && (
            <button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm">
              <Plus className="w-4 h-4" /> Thêm lịch
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Lịch đang mở ({departures.length})
          </button>
          {canManageTrash && (
            <button 
              onClick={() => setActiveTab("trash")} 
              className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all ${
                activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Thùng rác ({trashDepartures.length})
            </button>
          )}
        </div>

        <div className="p-6 pt-2 min-h-[300px] flex flex-col justify-start">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <p className="text-red-500 font-medium mb-1">Không thể tải dữ liệu</p>
              <p className="text-gray-400 text-xs">{error}</p>
            </div>
          ) : (
            <>
              {activeTab === "active" ? (
                <DepartureTable 
                  departures={paginatedList} 
                  onView={handleViewDetail} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ) : (
                <DepartureTrashTable 
                  departures={paginatedList} 
                  onRestore={handleRestore} 
                  onPermanentDelete={handlePermanentDelete} 
                  getAccountName={getAccountName} 
                />
              )}
              {totalPages > 0 && (
                <div className="mt-4">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <DepartureModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleSubmit} 
        formData={formData} 
        setFormData={setFormData} 
        isEdit={!!editDeparture}
        editDepartureId={editDeparture ? editDeparture.id : null}
        vehicles={vehicles}
        tourList={tourList}
      />
      <DepartureDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        departure={selectedDeparture} 
        accountList={accountList}
      />
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        onCancel={closeConfirm}
        onConfirm={executeConfirmAction}
      />
    </div>
  );
}