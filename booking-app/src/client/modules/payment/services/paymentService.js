import { apiClient } from "../../../services/apiClient";
import { Building2, Wallet, CreditCard, Banknote } from "lucide-react";

export const paymentMethodsList = [
  {
    id: "bank",
    label: "Chuyển khoản ngân hàng",
    icon: Building2,
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
    icon: Wallet,
    desc: "Thanh toán nhanh qua ví điện tử MoMo",
    detail: {
      phone: "0901 234 567",
      name: "TravelGo",
    },
  },
  {
    id: "zalopay",
    label: "ZaloPay",
    icon: Wallet,
    desc: "Thanh toán qua ví ZaloPay tiện lợi",
    detail: null,
  },
  {
    id: "card",
    label: "Thẻ tín dụng / ghi nợ",
    icon: CreditCard,
    desc: "Visa, Mastercard, JCB",
    detail: null,
  },
  {
    id: "cod",
    label: "Thanh toán khi nhận vé (COD)",
    icon: Banknote,
    desc: "Thanh toán tiền mặt cho nhân viên giao vé hoặc tại quầy trước giờ khởi hành",
    detail: {
      address: "Giao vé tận nhà hoặc tại quầy TravelGo",
      note: "Nhân viên sẽ liên hệ xác nhận chuyến đi trong vòng 2 giờ.",
    },
  },
];

export const paymentService = {
  getPaymentMethods: () => paymentMethodsList,

  confirmPayment: async (paymentData) => {
    const res = await apiClient.post("/payments", paymentData);
    return res.data?.data ?? res.data;
  },
};
