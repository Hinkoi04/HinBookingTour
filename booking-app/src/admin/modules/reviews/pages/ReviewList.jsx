import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { reviewService } from "../services/reviewService";
import { ReviewTable } from "../components";
import Pagination from "../../../components/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";
import { toastDeleted } from "../../../utils/notifications";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";

export default function ReviewList() {
  const { searchQuery } = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("active");
  
  const [actionId, setActionId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionReview, setActionReview] = useState(null);

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
  }, [searchQuery, activeTab]);

  const handleToggleVisibility = (review) => {
    if (!canUpdate) return;
    setActionId(review.id);
    setActionType("toggleVisibility");
    setActionReview(review);
  };

  const executeAction = async () => {
    if (!actionId) return;
    try {
      if (actionType === 'softDelete' && canDelete) {
        await reviewService.delete(actionId);
        toastDeleted("Đã chuyển vào thùng rác");
      } else if (actionType === 'restore' && canUpdate) {
        await reviewService.restore(actionId);
        toast.success("Đã khôi phục đánh giá");
      } else if (actionType === 'hardDelete' && canDelete) {
        await reviewService.hardDelete(actionId);
        toastDeleted("Đã xóa vĩnh viễn");
      } else if (actionType === "toggleVisibility" && canUpdate) {
        const updatedReview = await reviewService.toggleVisibility(actionId);
        setReviews(prev => prev.map(review => (
          review.id === actionId ? { ...review, isApproved: updatedReview.isApproved, updatedAt: updatedReview.updatedAt, approvedByName: updatedReview.approvedByName } : review
        )));
        toast.success(updatedReview.isApproved ? "Đã hiển thị đánh giá" : "Đã ẩn đánh giá");
      }
      if (actionType !== "toggleVisibility") {
        setReviews(prev => prev.filter(r => r.id !== actionId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    } finally {
      setActionId(null);
      setActionType(null);
      setActionReview(null);
    }
  };

  const cancelAction = () => {
    setActionId(null);
    setActionType(null);
    setActionReview(null);
  };

  const confirmation = actionType === "toggleVisibility"
    ? actionReview?.isApproved
      ? {
          title: "Xác nhận ẩn đánh giá",
          message: "Đánh giá này sẽ không còn hiển thị công khai. Bạn có muốn tiếp tục?",
          confirmText: "Ẩn đánh giá",
          variant: "warning",
        }
      : {
          title: "Xác nhận hiển thị đánh giá",
          message: "Đánh giá này sẽ được hiển thị công khai trên hệ thống. Bạn có muốn tiếp tục?",
          confirmText: "Hiển thị",
          variant: "success",
        }
    : actionType === "restore"
      ? {
          title: "Xác nhận khôi phục",
          message: "Đánh giá này sẽ được khôi phục khỏi thùng rác.",
          confirmText: "Khôi phục",
          variant: "info",
        }
      : actionType === "hardDelete"
        ? {
            title: "Xác nhận xóa vĩnh viễn",
            message: "Hành động này không thể hoàn tác. Đánh giá sẽ bị xóa vĩnh viễn.",
            confirmText: "Xóa vĩnh viễn",
            variant: "danger",
          }
        : {
            title: "Xác nhận xóa đánh giá",
            message: "Đánh giá sẽ được chuyển vào thùng rác.",
            confirmText: "Chuyển vào thùng rác",
            variant: "danger",
          };

  const filteredReviews = reviews.filter(review =>
    (review.userFullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      


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
          {loading ? (
            <LoadingSkeleton variant="table" />
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

      <ConfirmModal
        isOpen={actionId !== null}
        onConfirm={executeAction}
        onCancel={cancelAction}
        {...confirmation}
      />
    </div>
  );
}