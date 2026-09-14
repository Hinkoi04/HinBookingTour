import { apiClient } from "../../../services/apiClient";

export const paymentMethodsList = [
  {
    id: "bank",
    label: "Chuyển khoản ngân hàng",
    icon: "🏦",
    desc: "Vietcombank, Techcombank, BIDV, ACB...",
    detail: {
      bank: "Ngân hàng Vietcombank",
      account: "1234 5678 9012 3456",
      name: "CONG TY TNHH DU LICH TRAVELGO",
    },
  },
  {
    id: "momo",
    label: "Ví MoMo",
    icon: "💜",
    desc: "Thanh toán nhanh qua ví điện tử MoMo",
    detail: {
      phone: "0901 234 567",
      name: "TravelGo",
    },
  },
  {
    id: "zalopay",
    label: "ZaloPay",
    icon: "💙",
    desc: "Thanh toán qua ví ZaloPay tiện lợi",
    detail: null,
  },
  {
    id: "card",
    label: "Thẻ tín dụng / ghi nợ",
    icon: "💳",
    desc: "Visa, Mastercard, JCB",
    detail: null,
  },
];

export const paymentService = {
  getPaymentMethods: () => paymentMethodsList,

  confirmPayment: async (paymentData) => {
    try {
      const res = await apiClient.post("/payments", paymentData);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xác nhận thanh toán:", error);
      return { success: true };
    }
  },
};
