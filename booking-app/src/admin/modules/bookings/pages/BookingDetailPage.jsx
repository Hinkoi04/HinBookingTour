import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import DetailPageShell from "../../../components/DetailPageShell";
import ConfirmModal from "../../../components/ConfirmModal";
import { accountService } from "../../users/services/accountService";
import { BookingDetailModal } from "../components/BookingDetailModal";
import { bookingService } from "../services/BookService";
import { passengerService } from "../services/passengerService";
import { paymentService } from "../services/paymentService";
import { usePermission } from "../../../hooks/usePermission";

const PAYMENT_STATUS_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("UPDATE_BOOKING");
  const [booking, setBooking] = useState(null);
  const [accountMap, setAccountMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
    action: null,
  });

  const loadData = useCallback(async (bookingId) => {
    setBooking(await bookingService.getById(bookingId));
  }, []);

  useEffect(() => {
    const bookingId = Number(id);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      setError("Mã đơn đặt vé không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    Promise.all([bookingService.getById(bookingId), accountService.getAllActive()])
      .then(([bookingData, accounts]) => {
        if (!active) return;
        setBooking(bookingData);
        setAccountMap(Object.fromEntries(accounts.map((account) => [account.id, account.fullName])));
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết đơn đặt vé.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

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
          await loadData(Number(id));
          if (booking) {
            bookingService.notifyStatusChange(booking.id, booking.status, newStatus);
          }
          toast.success("Đã cập nhật trạng thái thanh toán");
        } catch (actionError) {
          toast.error(actionError.message || "Thao tác thất bại");
        }
      },
    });
  };

  const handleUpdatePassenger = async (passengerId, passengerData) => {
    if (!canUpdate) return;
    try {
      await passengerService.update(passengerId, passengerData);
      await loadData(Number(id));
      toast.success("Cập nhật thông tin hành khách thành công!");
    } catch (actionError) {
      toast.error(actionError.message || "Lỗi khi cập nhật hành khách");
    }
  };

  const executeConfirmAction = async () => {
    await confirmConfig.action?.();
    setConfirmConfig((current) => ({ ...current, isOpen: false }));
  };

  return (
    <>
      <DetailPageShell
        backTo="/admin/bookings"
        backLabel="Quay lại danh sách đơn đặt vé"
        loading={loading}
        error={error}
      >
        <BookingDetailModal
          booking={booking}
          pageMode
          onChangePaymentStatus={canUpdate ? handleChangePaymentStatus : undefined}
          onUpdatePassenger={canUpdate ? handleUpdatePassenger : undefined}
          accountMap={accountMap}
        />
      </DetailPageShell>
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        onCancel={() => setConfirmConfig((current) => ({ ...current, isOpen: false }))}
        onConfirm={executeConfirmAction}
      />
    </>
  );
}
