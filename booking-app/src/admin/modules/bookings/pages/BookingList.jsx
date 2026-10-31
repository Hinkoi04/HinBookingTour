import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarCheck2, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bookingService } from "../services/BookService";
import { paymentService } from "../services/paymentService";
import { passengerService } from "../services/passengerService";
import { BookingTable } from "../components/BookingTable";
import { BookingDetailModal, getOverallPaymentStatus } from "../components/BookingDetailModal";
import ConfirmModal from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";
import { accountService } from "../../users/services/accountService";

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};
const PAYMENT_STATUS_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

export default function BookingList() {
  const { searchQuery } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [accountMap, setAccountMap] = useState({});
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isAscending, setIsAscending] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState({isOpen: false,title: "",message: "",variant: "info",action: null});

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

  const canUpdate = userPermissions.includes("UPDATE_BOOKING");

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, accounts] = await Promise.all([
        bookingService.getAll(),
        accountService.getAllActive(),
      ]);
      setBookings(data);
      const map = {};
      accounts.forEach(acc => { map[acc.id] = acc.fullName; });
      setAccountMap(map);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, isAscending]);

  const closeConfirm = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  const executeConfirmAction = async () => {
    if (confirmConfig.action) {
      await confirmConfig.action();
    }
    closeConfirm();
  };

  const handleChangeStatus = (id, newStatus) => {
    if (!canUpdate) return;
    const booking = bookings.find(b => b.id === id);
    if (!booking || booking.status === newStatus) return;

    setConfirmConfig({
      isOpen: true,
      title: "Đổi trạng thái đơn hàng",
      message: `Xác nhận đổi trạng thái đơn "${booking.bookingCode}" sang "${STATUS_LABELS[newStatus] || newStatus}"?`,
      variant: newStatus === "cancelled" ? "danger" : "info",
      action: async () => {
        try {
          if (newStatus === "cancelled") {
            await bookingService.cancelBooking(id);
          } else {
            await bookingService.updateStatus(id, newStatus);
          }
          bookingService.notifyStatusChange(id, newStatus, getOverallPaymentStatus(booking.payments));
          toast.success("Đã cập nhật trạng thái đơn hàng");
          setSelectedBookingIds(ids => ids.filter(selectedId => selectedId !== id));
          loadData();
        } catch (error) {
          toast.error(error.message || "Thao tác thất bại");
        }
      }
    });
  };

  const handleToggleBooking = (bookingId) => {
    setSelectedBookingIds(ids => ids.includes(bookingId)
      ? ids.filter(id => id !== bookingId)
      : [...ids, bookingId]);
  };

  const handleToggleAllBookings = (bookingIds) => {
    const allSelected = bookingIds.every(id => selectedBookingIds.includes(id));
    setSelectedBookingIds(ids => allSelected
      ? ids.filter(id => !bookingIds.includes(id))
      : [...new Set([...ids, ...bookingIds])]);
  };

  const handleBulkConfirm = () => {
    if (!canUpdate || selectedBookingIds.length === 0) return;

    const bookingIds = [...selectedBookingIds];
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận nhiều đơn đặt vé",
      message: `Bạn có chắc chắn muốn xác nhận ${bookingIds.length} đơn đang chờ xác nhận?`,
      variant: "success",
      action: async () => {
        try {
          await bookingService.bulkConfirm(bookingIds);
          bookingIds.forEach(id => {
            const booking = bookings.find(item => item.id === id);
            if (booking) {
              bookingService.notifyStatusChange(id, "confirmed", getOverallPaymentStatus(booking.payments));
            }
          });
          setSelectedBookingIds([]);
          toast.success(`Đã xác nhận ${bookingIds.length} đơn đặt vé`);
          loadData();
        } catch (error) {
          toast.error(error.message || "Không thể xác nhận các đơn đã chọn");
        }
      }
    });
  };

  const handleCompleteOverdue = () => {
    if (!canUpdate) return;

    setConfirmConfig({
      isOpen: true,
      title: "Hoàn thành chuyến nhanh",
      message: "Tất cả đơn chưa bị hủy có ngày khởi hành trước hôm nay sẽ được chuyển sang trạng thái hoàn thành. Bạn có muốn tiếp tục?",
      variant: "success",
      action: async () => {
        try {
          const completedBookingIds = await bookingService.completeOverdue();
          completedBookingIds.forEach(id => {
            const booking = bookings.find(item => item.id === id);
            if (booking) {
              bookingService.notifyStatusChange(id, "completed", getOverallPaymentStatus(booking.payments));
            }
          });
          setSelectedBookingIds([]);
          toast.success(completedBookingIds.length
            ? `Đã hoàn thành ${completedBookingIds.length} đơn đặt vé`
            : "Không có đơn nào cần hoàn thành");
          loadData();
        } catch (error) {
          toast.error(error.message || "Không thể hoàn thành các chuyến đã qua");
        }
      }
    });
  };

  const handleChangePaymentStatus = (paymentId, newStatus) => {
    if (!canUpdate) return;
    setConfirmConfig({
      isOpen: true,
      title: "Đổi trạng thái thanh toán",
      message: `Xác nhận đổi trạng thái thanh toán sang "${PAYMENT_STATUS_LABELS[newStatus] || newStatus}"?`,
      variant: newStatus === "failed" || newStatus === "refunded" ? "danger" : "info",
      action: async () => {
        try {
          if (newStatus === "paid") {
            await paymentService.confirmPayment(paymentId);
          } else {
            await paymentService.updateStatus(paymentId, newStatus);
          }
          toast.success("Đã cập nhật trạng thái thanh toán");
          loadData();
          if (selectedBooking) {
            const updatedBooking = await bookingService.getById(selectedBooking.id);
            setSelectedBooking(updatedBooking);
            bookingService.notifyStatusChange(updatedBooking.id, updatedBooking.status, newStatus);
          }
        } catch (error) {
          toast.error(error.message || "Thao tác thất bại");
        }
      }
    });
  };

  const handleUpdatePassenger = async (passengerId, passengerData) => {
    if (!canUpdate) return;
    try {
      await passengerService.update(passengerId, passengerData);
      toast.success("Cập nhật thông tin hành khách thành công!");
      loadData();
      if (selectedBooking) {
        const updatedBooking = await bookingService.getById(selectedBooking.id);
        setSelectedBooking(updatedBooking);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật hành khách");
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.tourTitle && booking.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    return matchesSearch && matchesTab;
  });

  filteredBookings.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return isAscending ? timeA - timeB : timeB - timeA;
  });

  const getCount = (status) => bookings.filter(b => b.status === status).length;

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 w-full relative">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="flex gap-2 border-b border-gray-100 mb-4 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "all" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            Tất cả ({bookings.length})
          </button>
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "pending" ? "bg-yellow-50 text-yellow-700" : "text-gray-500 hover:text-gray-700"}`}>
            Chờ xác nhận ({getCount("pending")})
          </button>
          <button onClick={() => setActiveTab("confirmed")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "confirmed" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
            Đã xác nhận ({getCount("confirmed")})
          </button>
          <button onClick={() => setActiveTab("cancelled")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "cancelled" ? "bg-red-50 text-red-700" : "text-gray-500 hover:text-gray-700"}`}>
            Đã hủy ({getCount("cancelled")})
          </button>
          <button onClick={() => setActiveTab("completed")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "completed" ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
            Hoàn thành ({getCount("completed")})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <span className="text-sm font-medium text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {canUpdate && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleBulkConfirm}
                    disabled={selectedBookingIds.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <CheckCheck className="w-5 h-5" />
                    Xác nhận hàng loạt
                    {selectedBookingIds.length > 0 && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{selectedBookingIds.length}</span>
                    )}
                  </button>
                  <span className="text-sm text-gray-500">Chọn các đơn chờ xác nhận trong bảng</span>
                </div>
                <button
                  onClick={handleCompleteOverdue}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-green-700"
                >
                  <CalendarCheck2 className="w-5 h-5" />
                  Hoàn thành chuyến nhanh
                </button>
              </div>
            )}
            <BookingTable 
              data={paginatedBookings} 
              onView={handleView}
              onChangeStatus={handleChangeStatus}
              canUpdate={canUpdate}
              selectedBookingIds={selectedBookingIds}
              onToggleBooking={handleToggleBooking}
              onToggleAllBookings={handleToggleAllBookings}
              isAscending={isAscending}
              onSort={() => setIsAscending(!isAscending)}
            />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
      </div>

      {isDetailOpen && selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking} 
          onClose={() => setIsDetailOpen(false)} 
          onChangePaymentStatus={handleChangePaymentStatus}
          onUpdatePassenger={handleUpdatePassenger}
          canUpdate={canUpdate}
          accountMap={accountMap}
        />
      )}

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