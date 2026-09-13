import { useState, useEffect, useMemo } from "react";
import { Plus, Search, RefreshCw, Trash2, Lock, Loader2 } from "lucide-react";
import { VehicleTable, VehicleTrashTable } from "../components/VehicleTable";
import { VehicleModal } from "../components/VehicleModal";
import { vehicleService } from "../services/vehicleService";
import { accountService } from "../../users/services/accountService";

import ConfirmModal from "../../../components/ConfirmModal";
import AlertModal from "../../../components/AlertModal";

const initialFormState = {
  name: "",
  vehicleType: "BUS" 
};

export default function VehicleList() {
  const userPermissions = useMemo(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return [];
      const user = JSON.parse(userString);
      return user.permissions || [];
    } catch (e) {
      return [];
    }
  }, []);

  const canCreate = userPermissions.includes("CREATE_OPERATIONS");
  const canUpdate = userPermissions.includes("UPDATE_OPERATIONS");
  const canDelete = userPermissions.includes("DELETE_OPERATIONS");
  const canManageTrash = canDelete;

  const [vehicles, setVehicles] = useState([]);
  const [deletedVehicles, setDeletedVehicles] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", variant: "info", action: null });
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", variant: "info" });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  
  const executeConfirmAction = async () => {
    if (confirmConfig.action) {
      await confirmConfig.action();
    }
    closeConfirm();
  };

  const showAlert = (title, message, variant = "info") => {
    setAlertConfig({ isOpen: true, title, message, variant });
  };
  
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const [vData, trashData, accData] = await Promise.all([
        vehicleService.getAll().catch(() => []),
        canManageTrash ? vehicleService.getAllTrash().catch(() => []) : Promise.resolve([]),
        accountService.getAllActive().catch(() => [])
      ]);
      
      setVehicles(Array.isArray(vData) ? vData : []);
      setDeletedVehicles(Array.isArray(trashData) ? trashData : []);
      setAccountList(Array.isArray(accData) ? accData : []);
    } catch (error) {
      showAlert("Lỗi", "Lỗi tải dữ liệu: " + error.message, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditVehicle(null);
  };

  useEffect(() => {
    fetchVehicles();
  }, [canManageTrash, activeTab]);

  const getAccountName = (id) => {
    if (!id) return null;
    const account = accountList.find(acc => String(acc.id) === String(id));
    return account ? account.fullName : null;
  };

  const filteredVehicles = vehicles.filter(v =>
    v.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedVehicles = deletedVehicles.filter(v =>
    v.name?.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showAlert("Cảnh báo", "Vui lòng nhập tên phương tiện!", "warning");
      return;
    }

    try {
      if (editVehicle) {
        await vehicleService.update(editVehicle.id, formData);
        showAlert("Thành công", "Cập nhật phương tiện thành công!", "success");
      } else {
        await vehicleService.create(formData);
        showAlert("Thành công", "Thêm phương tiện mới thành công!", "success");
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchVehicles(); 
    } catch (error) {
      showAlert("Lỗi", "Lỗi khi lưu dữ liệu: " + error.message, "danger");
    }
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      vehicleType: vehicle.vehicleType
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (!canDelete) return;
    const vehicle = vehicles.find(v => v.id === id);
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn chuyển phương tiện "${vehicle?.name}" vào thùng rác?`,
      variant: "danger",
      action: async () => {
        try {
          await vehicleService.delete(id);
          showAlert("Thành công", "Đã chuyển vào thùng rác thành công!", "success");
          fetchVehicles();
        } catch (error) {
          showAlert("Lỗi", "Lỗi khi xóa: " + error.message, "danger");
        }
      }
    });
  };

  const handleRestore = (id) => {
    if (!canUpdate) return;
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận khôi phục",
      message: "Bạn có chắc chắn muốn khôi phục phương tiện này?",
      variant: "info",
      action: async () => {
        try {
          await vehicleService.restore(id);
          showAlert("Thành công", "Khôi phục thành công!", "success");
          fetchVehicles();
        } catch (error) {
          showAlert("Lỗi", "Lỗi khi khôi phục: " + error.message, "danger");
        }
      }
    });
  };

  const handlePermanentDelete = (id) => {
    if (!canDelete) return;
    setConfirmConfig({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      message: "Hành động này sẽ xóa vĩnh viễn dữ liệu. Bạn có chắc chắn không?",
      variant: "danger",
      action: async () => {
        try {
          await vehicleService.hardDelete(id);
          showAlert("Thành công", "Đã xóa vĩnh viễn!", "success");
          fetchVehicles();
        } catch (error) {
          showAlert("Lỗi", "Lỗi khi xóa vĩnh viễn: " + error.message, "danger");
        }
      }
    });
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phương tiện</h1>
          <p className="text-gray-500 mt-1">Danh mục các loại xe, tàu, máy bay</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setIsLoading(true); fetchVehicles(); }} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          
          {activeTab === "active" && canCreate && (
            <button 
              onClick={openNewDialog} 
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm phương tiện
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => { setIsLoading(true); setActiveTab("active"); }} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >Đang hoạt động
          </button>
          
          <button 
            onClick={() => { if (canManageTrash) { setIsLoading(true); setActiveTab("trash"); } }} 
            disabled={!canManageTrash}
            title={!canManageTrash ? "Bạn cần quyền xóa (DELETE_VEHICLE) để xem Thùng rác" : ""}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              !canManageTrash 
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : activeTab === "trash" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!canManageTrash ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            Thùng rác {canManageTrash && `(${deletedVehicles.length})`}
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === "active" ? "Tìm kiếm phương tiện..." : "Tìm kiếm trong thùng rác..."} 
              value={activeTab === "active" ? searchTerm : trashSearchTerm} 
              onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all" 
            />
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : activeTab === "active" ? (
            <VehicleTable 
              vehicles={filteredVehicles} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              getAccountName={getAccountName}
              canUpdate={canUpdate}
              canDelete={canDelete}
            />
          ) : (
            <VehicleTrashTable 
              vehicles={filteredDeletedVehicles} 
              onRestore={handleRestore} 
              onPermanentDelete={handlePermanentDelete} 
              getAccountName={getAccountName}
              canUpdate={canUpdate}
              canDelete={canDelete}
            />
          )}
        </div>
      </div>

      <VehicleModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleSubmit}
        formData={formData} 
        setFormData={setFormData} 
        isEdit={!!editVehicle} 
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        onCancel={closeConfirm}
        onConfirm={executeConfirmAction}
      />

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={closeAlert}
      />
      
    </div>
  );
}