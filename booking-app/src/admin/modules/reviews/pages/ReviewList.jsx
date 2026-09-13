import { useState, useEffect, useMemo } from "react";
import { Search, Lock } from "lucide-react";
import { toast } from "sonner";
import { reviewService } from "../services/reviewService";
import { ReviewTable } from "../components/ReviewTable";
import Pagination from "../../../components/Pagination";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activeTab, setActiveTab] = useState("active");
  const [trashSearch, setTrashSearch] = useState("");
  
  const [actionId, setActionId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const canUpdate = userPermissions.includes("UPDATE_REVIEW");
  const canDelete = userPermissions.includes("DELETE_REVIEW");
  const canViewTrash = canDelete;

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === "trash") {
        const data = await reviewService.getTrash();
        setReviews(data);
      } else {
        const data = await reviewService.getAll();
        setReviews(data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, canViewTrash]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, trashSearch, activeTab]);

  const handleToggleVisibility = async (id) => {
    if (!canUpdate) return;
    try {
      const updatedReview = await reviewService.toggleVisibility(id);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: updatedReview.isApproved } : r));
      toast.success(updatedReview.isApproved ? "Đã hiển thị đánh giá" : "Đã ẩn đánh giá");
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const executeAction = async () => {
    if (!actionId) return;
    try {
      if (actionType === 'softDelete' && canDelete) {
        await reviewService.delete(actionId);
        toast.success("Đã chuyển vào thùng rác");
      } else if (actionType === 'restore' && canUpdate) {
        await reviewService.restore(actionId);
        toast.success("Đã khôi phục đánh giá");
      } else if (actionType === 'hardDelete' && canDelete) {
        await reviewService.hardDelete(actionId);
        toast.success("Đã xóa vĩnh viễn");
      }
      setReviews(prev => prev.filter(r => r.id !== actionId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    } finally {
      setActionId(null);
      setActionType(null);
    }
  };

  const currentSearch = activeTab === "active" ? searchTerm : trashSearch;
  
  const filteredReviews = reviews.filter(review =>
    (review.userFullName || "").toLowerCase().includes(currentSearch.toLowerCase()) ||
    (review.content || "").toLowerCase().includes(currentSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
          <p className="text-gray-500 mt-1">Kiểm duyệt và quản lý đánh giá từ khách hàng</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đang hoạt động
          </button>
          
          <button 
            onClick={() => canViewTrash && setActiveTab("trash")} 
            disabled={!canViewTrash}
            title={!canViewTrash ? "Cần quyền Xóa (DELETE_REVIEW) để xem Thùng rác" : ""}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              !canViewTrash ? "opacity-50 cursor-not-allowed text-gray-400" :
              activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!canViewTrash ? <Lock className="w-4 h-4" /> : null}
            Thùng rác
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "active" ? "Tìm kiếm theo khách hàng hoặc nội dung..." : "Tìm kiếm trong thùng rác..."}
              value={activeTab === "active" ? searchTerm : trashSearch}
              onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">Đang tải dữ liệu...</div>
          ) : (
            <ReviewTable
              reviews={paginatedList}
              isTrashView={activeTab === "trash"}
              onToggleVisibility={handleToggleVisibility}
              onDelete={(id) => { setActionId(id); setActionType('softDelete'); }}
              onRestore={(id) => { setActionId(id); setActionType('restore'); }}
              onHardDelete={(id) => { setActionId(id); setActionType('hardDelete'); }}
              canUpdate={canUpdate}
              canDelete={canDelete}
            />
          )}

          {totalPages > 0 && !loading && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {actionId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900">
              {actionType === 'softDelete' ? "Xác nhận xóa đánh giá" : actionType === 'restore' ? "Xác nhận khôi phục" : "Xác nhận xóa vĩnh viễn"}
            </h3>
            <p className="text-sm text-gray-500">
              {actionType === 'softDelete' 
                ? "Đánh giá sẽ được chuyển vào thùng rác." 
                : actionType === 'restore' 
                ? "Đánh giá này sẽ được hiển thị lại trên hệ thống."
                : "Hành động này không thể hoàn tác. Đánh giá sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu."}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setActionId(null); setActionType(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors shadow-sm ${
                  actionType === 'restore' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'restore' ? "Khôi phục" : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}