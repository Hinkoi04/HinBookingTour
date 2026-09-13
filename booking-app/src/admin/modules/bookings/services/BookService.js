import axios from "axios";
import { apiClient } from "../../login/services/authService";

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

  cancelBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/status`, {
      status: "cancelled",
    });
    return response.data.data;
  },

  notifyStatusChange: async (bookingId, status, paymentStatus) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/booking/admin/update-status",
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
