import axios from "axios";
import { apiClient } from "../../login/services/authService";
import { BOOKING_STATUS_SYNC_URL } from "../../../../services/apiConfig";

export const bookingService = {
  getAll: async () => {
    const response = await apiClient.get("/bookings");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data.data;
  },

  updateStatus: async (id, statusValue) => {
    const response = await apiClient.put(`/bookings/${id}/status`, {
      status: statusValue,
    });
    return response.data.data;
  },

  bulkConfirm: async (bookingIds) => {
    const response = await apiClient.put("/bookings/bulk-confirm", bookingIds);
    return response.data.data;
  },

  completeOverdue: async () => {
    const response = await apiClient.put("/bookings/complete-overdue");
    return response.data.data;
  },

  cancelBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/status`, {
      status: "cancelled",
    });
    return response.data.data;
  },

  notifyStatusChange: async (bookingId, status, paymentStatus) => {
    if (!BOOKING_STATUS_SYNC_URL) return;

    try {
      const response = await axios.post(
        BOOKING_STATUS_SYNC_URL,
        {
          bookingId,
          status,
          payment_status: paymentStatus,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đồng bộ trạng thái sang hệ thống khác:", error);
    }
  },
};
