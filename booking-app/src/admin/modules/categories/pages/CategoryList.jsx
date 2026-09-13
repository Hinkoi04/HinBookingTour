import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Lock, Loader2 } from "lucide-react";
import { CategoryTable, CategoryTrashTable } from "../components/CategoryTable";
import { CategoryModal } from "../components/CategoryModal";
import { CategoryDetailModal } from "../components/CategoryDetailModal";
import { categoryService } from "../services/categoryApi";
import { accountService } from "../../users/services/accountService"; 
import Pagination from "../../../components/Pagination";
import { usePermission } from "../../../hooks/usePermission";
import ConfirmModal from "../../../components/ConfirmModal";
import AlertModal from "../../../components/AlertModal";

const initialFormState = { title: "", description: "", parentId: "" };

export default function CategoryList() {
  const { hasPermission } = usePermission();

  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [viewCategory, setViewCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", variant: "info", action: null });
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", variant: "info" });

  const isAdmin = useMemo(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return false;
      const user = JSON.parse(userString);
      return user.role && String(user.role).toLowerCase() === "admin";
    } catch (e) { return false; }
  }, []);

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
    const fetchAccounts = async () => {
      try {
        const accData = await accountService.getAllActive(); 
        setAccounts(accData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (activeTab === "active") {
        const data = await categoryService.getAllActive();
        setCategories(data);
      } else if (isAdmin) {
        const trashData = await categoryService.getAllTrash();
        setDeletedCategories(trashData);
      }
    } catch (error) {
      showAlert("Lỗi", "Không thể tải dữ liệu: " + error.message, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const filteredCategories = categories.filter(cat =>
    cat.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedCategories = deletedCategories.filter(cat =>
    cat.title?.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const currentList = activeTab === "active" ? filteredCategories : filteredDeletedCategories;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      return showAlert("Cảnh báo", "Vui lòng nhập tên danh mục!", "warning");
    }
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        status: formData.status || "active",
        parentId: formData.parentId ? Number(formData.parentId) : null
      };

      if (editCategory) {
        await categoryService.update(editCategory.id, payload);
        showAlert("Thành công", "Cập nhật thành công!", "success");
      } else {
        await categoryService.create(payload);
        showAlert("Thành công", "Thêm mới thành công!", "success");
      }
      
      setIsDialogOpen(false);
      setFormData(initialFormState);
      setEditCategory(null);
      fetchData();
    } catch (error) {
      showAlert("Lỗi", "Lỗi: " + error.message, "danger");
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setFormData({ 
      title: category.title, 
      description: category.description,
      parentId: category.parentId || "",
      status: category.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận xóa",
      message: "Chuyển danh mục này vào thùng rác?",
      variant: "danger",
      action: async () => {
        try {
          await categoryService.softDelete(id);
          fetchData();
          showAlert("Thành công", "Đã chuyển danh mục vào thùng rác.", "success");
        } catch (error) {
          showAlert("Lỗi", "Lỗi: " + error.message, "danger");
        }
      }
    });
  };

  const handleRestore = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận khôi phục",
      message: "Khôi phục danh mục này?",
      variant: "info",
      action: async () => {
        try {
          await categoryService.restore(id);
          fetchData();
          showAlert("Thành công", "Đã khôi phục danh mục thành công.", "success");
        } catch (error) {
          showAlert("Lỗi", "Lỗi: " + error.message, "danger");
        }
      }
    });
  };

  const handlePermanentDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      message: "Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.",
      variant: "danger",
      action: async () => {
        try {
          await categoryService.hardDelete(id);
          fetchData();
          showAlert("Thành công", "Đã xóa vĩnh viễn danh mục.", "success");
        } catch (error) {
          showAlert("Lỗi", "Lỗi: " + error.message, "danger");
        }
      }
    });
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
        
        {hasPermission("CREATE_CATEGORY") && (
          <button 
            onClick={() => { setFormData(initialFormState); setEditCategory(null); setIsDialogOpen(true); }} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Thêm danh mục
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button onClick={() => setActiveTab("active")} 
                  className={`py-2 px-6 font-medium text-sm rounded-lg transition-all ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            Danh mục ({categories.length})
          </button>
          <button onClick={() => isAdmin && setActiveTab("trash")} 
                  disabled={!isAdmin}
                  className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all ${!isAdmin ? "opacity-50 cursor-not-allowed" : activeTab === "trash" ? "bg-red-50 text-red-700 shadow-sm" : "text-gray-500"}`}>
            {!isAdmin && <Lock className="w-3.5 h-3.5" />}
            Thùng rác {isAdmin && `(${deletedCategories.length})`}
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm..." value={activeTab === "active" ? searchTerm : trashSearchTerm} 
                   onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)}
                   className="w-full pl-9 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {activeTab === "active" ? (
                <CategoryTable 
                  categories={paginatedList} 
                  startIndex={startIndex} 
                  onView={setViewCategory} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                />
              ) : (
                <CategoryTrashTable 
                  categories={paginatedList} 
                  startIndex={startIndex} 
                  accounts={accounts} 
                  onRestore={handleRestore} 
                  onPermanentDelete={handlePermanentDelete}
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

      <CategoryModal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} isEdit={!!editCategory} categories={categories} currentCategoryId={editCategory?.id} />
      <CategoryDetailModal isOpen={!!viewCategory} category={viewCategory} categories={categories} accounts={accounts} onClose={() => setViewCategory(null)} />
      
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