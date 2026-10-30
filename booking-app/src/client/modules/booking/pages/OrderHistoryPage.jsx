import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CalendarDays, ClipboardList, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../../auth/services/authService";
import { bookingService } from "../services/bookingService";

const statusLabels = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "Chưa cập nhật";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Chưa cập nhật"
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(parsedDate);
};

export function OrderHistoryPage() {
  const user = authService.getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;

    bookingService.getMyBookings()
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            error.response?.data?.message ||
            error.message ||
            "Không thể tải lịch sử đơn hàng"
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <header className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
          <p className="mt-1 text-sm text-gray-500">Theo dõi các đơn đặt tour của bạn.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
          <span>Đang tải lịch sử đơn hàng...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-gray-300" />
          <h2 className="mt-4 font-semibold text-gray-900">Bạn chưa có đơn hàng nào</h2>
          <p className="mt-1 text-sm text-gray-500">Các đơn đặt tour sẽ xuất hiện tại đây.</p>
          <Link to="/home" className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Khám phá tour
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Mã đơn: {booking.bookingCode || booking.id}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    {booking.tourTitle || "Tour du lịch"}
                  </h2>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    Khởi hành: {formatDate(booking.departureStartDate)}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {statusLabels[booking.status?.toLowerCase()] || booking.status || "Chưa cập nhật"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">
                  {booking.quantityAdult || 0} người lớn
                  {(booking.quantityChildren || 0) > 0 && ` · ${booking.quantityChildren} trẻ em`}
                  {(booking.quantityBaby || 0) > 0 && ` · ${booking.quantityBaby} em bé`}
                </p>
                <p className="text-right text-sm text-gray-500">
                  Tổng tiền
                  <span className="ml-2 text-base font-bold text-blue-700">{formatCurrency(booking.total)}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
