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

  validateBooking: (form, passengers = []) => {
    const errors = {};
    if (!form.fullName?.trim()) errors.fullName = "Vui lòng nhập họ tên người liên hệ";
    if (!form.email?.trim() || !form.email.includes("@"))
      errors.email = "Email không hợp lệ";
    if (!form.phone?.trim() || form.phone.length < 9)
      errors.phone = "Số điện thoại không hợp lệ";
    if (!form.idNumber?.trim()) errors.idNumber = "Vui lòng nhập CMND/CCCD";

    passengers.forEach((p, idx) => {
      if (!p.fullName?.trim()) {
        errors[`passenger_${idx}_fullName`] = `Vui lòng nhập họ tên cho hành khách ${idx + 1}`;
      }
      if ((p.type === "children" || p.type === "baby") && !p.dob) {
        errors[`passenger_${idx}_dob`] = `Vui lòng chọn ngày sinh để xác minh độ tuổi`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  createBooking: async (bookingData) => {
    const res = await apiClient.post("/bookings", bookingData);
    return res.data;
  },

  getMyBookings: async () => {
    const res = await apiClient.get("/bookings/my");
    return res.data.data;
  },
};
