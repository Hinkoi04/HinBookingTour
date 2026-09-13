import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Loader2, Lock } from "lucide-react";
import { TourTable, TourTrashTable } from "../components/TourTable";
import { TourDetailModal } from "../components/TourDetailModal"; 
import { tourService } from "../services/tourService";
import { accountService } from "../../users/services/accountService";

import Pagination from "../../../components/Pagination";
import { usePermission } from "../../../hooks/usePermission";

import ConfirmModal from "../../../components/ConfirmModal";
import AlertModal from "../../../components/AlertModal";

export function TourList() {
  const { hasPermission } = usePermission();

  const isAdmin = useMemo(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return false;
      const user = JSON.parse(userString);
      return user.role && String(user.role).toLowerCase() === "admin";
    } catch (e) { return false; }
  }, []);

  const [tours, setTours] = useState([]);
  const [deletedTours, setDeletedTours] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedTour, setSelectedTour] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false, title: "", message: "", variant: "info", action: null
  });

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false, title: "", message: "", variant: "info"
  });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, trashSearchTerm, activeTab]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [toursData, categoriesData, trashData, accountsData] = await Promise.all([
          tourService.getAll().catch(() => []),      
          tourService.getCategories().catch(() => []),
          isAdmin ? tourService.getAllTrash().catch(() => []) : Promise.resolve([]),
          accountService.getAllActive().catch(() => [])
        ]);

        const safeTours = Array.isArray(toursData) ? toursData : [];
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];
        const safeTrash = Array.isArray(trashData) ? trashData : []; 
        const safeAccounts = Array.isArray(accountsData) ? accountsData : [];

        setAccountList(safeAccounts);

        const mapCategoryInfo = (tour) => {
          const foundCategory = safeCategories.find(
            cat => Number(cat.id) === Number(tour.categoryId)
          );
          return {
            ...tour,
            category: foundCategory ? foundCategory.title : `Danh mục #${tour.categoryId}`
          };
        };

        setTours(safeTours.map(mapCategoryInfo));
        setDeletedTours(safeTrash.map(mapCategoryInfo));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAdmin, activeTab]);

  const getAccountName = (id) => {
    if (!id) return null;
    const account = accountList.find(acc => String(acc.id) === String(id));
    return account ? account.fullName : null;
  };

  const filteredTours = tours.filter((tour) =>
    (tour.title || tour.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedTours = deletedTours.filter((tour) =>
    (tour.title || tour.name || "").toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const currentList = activeTab === "active" ? filteredTours : filteredDeletedTours;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setIsDetailOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa tour này? Tour sẽ được chuyển vào thùng rác.",
      variant: "danger",
      action: async () => {
        try {
          await tourService.delete(id);
          const tour = tours.find((t) => t.id === id);
          if (tour) {
            setDeletedTours([
              ...deletedTours,
              { ...tour, deletedBy: localStorage.getItem("userId"), deletedAt: new Date().toISOString() },
            ]);
            setTours(tours.filter((t) => t.id !== id));
          }
          showAlert("Thành công", "Đã chuyển tour vào thùng rác.", "success");
        } catch (err) {
          showAlert("Lỗi", "Lỗi khi xóa: " + err.message, "danger");
        }
      }
    });
  };

  const handleRestore = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Khôi phục Tour",
      message: "Bạn có chắc chắn muốn khôi phục tour này về danh sách hoạt động?",
      variant: "info",
      action: async () => {
        try {
          await tourService.restore(id); 
          const tour = deletedTours.find((t) => t.id === id);
          if (tour) {
            const { deletedBy: _deletedBy, deletedAt: _deletedAt, ...restTour } = tour;
            setTours([...tours, restTour]);
            setDeletedTours(deletedTours.filter((t) => t.id !== id));
          }
          showAlert("Thành công", "Đã khôi phục tour thành công.", "success");
        } catch (err) {
          showAlert("Lỗi", "Lỗi khi khôi phục: " + err.message, "danger");
        }
      }
    });
  };

  const handlePermanentDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      message: "Bạn có chắc chắn muốn xóa vĩnh viễn tour này? Hành động này không thể hoàn tác.",
      variant: "danger",
      action: async () => {
        try {
          await tourService.hardDelete(id);
          setDeletedTours(deletedTours.filter((t) => t.id !== id));
          showAlert("Thành công", "Đã xóa vĩnh viễn tour.", "success");
        } catch (err) {
          showAlert("Lỗi", "Lỗi khi xóa vĩnh viễn: " + err.message, "danger");
        }
      }
    });
  };

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tour</h1>
        </div>
        
        {hasPermission("CREATE_TOUR") && (
          <Link
            to="/admin/tours/new"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm Tour mới
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tour ({tours.length})
          </button>
          
          <button
            onClick={() => isAdmin && setActiveTab("trash")}
            disabled={!isAdmin}
            title={!isAdmin ? "Bạn cần quyền Admin để xem Thùng rác" : ""}
            className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              !isAdmin
                ? "opacity-50 cursor-not-allowed text-gray-400" 
                : activeTab === "trash"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!isAdmin && <Lock className="w-3.5 h-3.5" />}
            Thùng rác {isAdmin && `(${deletedTours.length})`}
          </button>
        </div>

        <div>
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "active" ? "Tìm kiếm tour..." : "Tìm kiếm trong thùng rác..."}
              value={activeTab === "active" ? searchTerm : trashSearchTerm}
              onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {activeTab === "active" ? (
                <TourTable 
                  tours={paginatedList} 
                  onView={handleViewDetail} 
                  onDelete={handleDelete} 
                  getAccountName={getAccountName} 
                />
              ) : (
                <TourTrashTable
                  tours={paginatedList}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                  getAccountName={getAccountName}
                />
              )}
              
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}

        </div>
      </div>

      <TourDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        selectedTour={selectedTour}
        getAccountName={getAccountName}
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