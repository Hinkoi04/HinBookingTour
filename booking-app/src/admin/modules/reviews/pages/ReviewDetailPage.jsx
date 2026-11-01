import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { reviewService } from "../services/reviewService";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const reviewId = Number(id);
    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      setError("Mã đánh giá không hợp lệ.");
      setLoading(false);
      return;
    }

    let isCurrentRequest = true;
    reviewService.getById(reviewId)
      .then((data) => {
        if (isCurrentRequest) setReview(data);
      })
      .catch((fetchError) => {
        if (isCurrentRequest) {
          setError(fetchError.response?.data?.message || "Không thể tải chi tiết đánh giá.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-4xl"><LoadingSkeleton variant="detail" /></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Không thể mở chi tiết đánh giá</p>
            <p className="mt-1 text-sm">{error || "Không tìm thấy đánh giá."}</p>
            <Link
              to="/admin/reviews"
              className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => (
    dateString ? new Date(dateString).toLocaleString("vi-VN") : "—"
  );
  const visibilityStatus = review.isApproved
    ? "Đang hiển thị"
    : review.approvedBy
      ? "Đã ẩn"
      : "Chờ duyệt";

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Link
        to="/admin/reviews"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách đánh giá
      </Link>

      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <header className="border-b border-gray-100 px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-blue-600">Đánh giá #{review.id}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Chi tiết đánh giá</h1>
        </header>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Khách hàng</p>
              <p className="mt-1 font-medium text-gray-900">{review.userFullName || `Khách hàng #${review.userId}`}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tour</p>
              <p className="mt-1 font-medium text-gray-900">{review.tourTitle || `Tour #${review.tourId}`}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Đơn đặt</p>
              <p className="mt-1 font-medium text-gray-900">{review.bookingId ? `#${review.bookingId}` : "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Đánh giá</p>
              <div className="mt-1 flex items-center gap-1" aria-label={`${review.rating} trên 5 sao`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-700">{review.rating}/5</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Nội dung nhận xét</p>
            <p className="whitespace-pre-wrap break-words leading-7 text-gray-800">
              {review.content || "Không có nội dung nhận xét."}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-gray-800">Thông tin kiểm duyệt</h2>
            <div className="grid gap-6 border-t border-gray-100 pt-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</p>
                <p className="mt-1 text-sm font-medium text-gray-800">{visibilityStatus}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ngày tạo</p>
                <p className="mt-1 text-sm text-gray-800">{formatDate(review.createdAt)}</p>
              </div>
              {review.isApproved && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Người duyệt</p>
                    <p className="mt-1 text-sm text-gray-800">{review.approvedByName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ngày duyệt</p>
                    <p className="mt-1 text-sm text-gray-800">{formatDate(review.updatedAt)}</p>
                  </div>
                </>
              )}
              {review.deletedByName && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Người xóa</p>
                  <p className="mt-1 text-sm text-gray-800">{review.deletedByName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
