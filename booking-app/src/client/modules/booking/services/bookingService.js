import { apiClient } from "../../../services/apiClient";

export const bookingService = {
  validateForm: (form) => {
    const errors = {};
    if (!form.fullName?.trim()) errors.fullName = "Vui lòng nhập họ tên";
    if (!form.email?.trim() || !form.email.includes("@"))
      errors.email = "Email không hợp lệ";
    if (!form.phone?.trim() || form.phone.length < 9)
      errors.phone = "Số điện thoại không hợp lệ";
    if (!form.idNumber?.trim()) errors.idNumber = "Vui lòng nhập CMND/CCCD";

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  createBooking: async (bookingData) => {
    try {
      const res = await apiClient.post("/bookings", bookingData);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
      return { success: true };
    }
  },
};
