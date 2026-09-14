import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, Check, AlertCircle } from "lucide-react";
import { paymentService } from "../services/paymentService";
import {
  PaymentMethods,
  BankTransferDetail,
  MoMoDetail,
  PaymentSuccess,
  PaymentOrderSummary,
} from "../components";
import { BookingSteps } from "../../booking/components";
import { toast } from "sonner";

export function PaymentPage() {
  const location = useLocation();
  const state = location.state;

  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!state?.tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-lg text-gray-500 font-medium">Không có thông tin thanh toán</p>
        <Link to="/home" className="text-blue-600 hover:underline font-medium">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const { tour, date, adults, children, totalPrice, deposit, customer } = state;
  const orderId = `TG${Date.now().toString().slice(-8)}`;
  const paymentMethods = paymentService.getPaymentMethods();
  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod);

  const handleConfirm = async () => {
    if (!agreed) {
      toast.error("Vui lòng đồng ý điều khoản để tiếp tục");
      return;
    }

    await paymentService.confirmPayment({
      orderId,
      tourId: tour.id,
      date,
      adults,
      children,
      totalPrice,
      deposit,
      customer,
      paymentMethod: selectedMethod,
    });

    setSuccess(true);
  };

  if (success) {
    return (
      <PaymentSuccess
        orderId={orderId}
        tour={tour}
        date={date}
        customer={customer}
        deposit={deposit}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/home" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/tour/${tour.id}`} className="hover:text-blue-600 line-clamp-1">
            {tour.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Thanh toán</span>
        </div>
      </div>

      {/* Progress */}
      <BookingSteps currentStep={2} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">
            <PaymentMethods
              methods={paymentMethods}
              selectedMethod={selectedMethod}
              onSelect={setSelectedMethod}
            />

            {/* Bank detail */}
            {selectedMethod === "bank" && currentMethod?.detail && (
              <BankTransferDetail
                detail={currentMethod.detail}
                deposit={deposit}
                orderId={orderId}
              />
            )}

            {/* MoMo detail */}
            {selectedMethod === "momo" && (
              <MoMoDetail deposit={deposit} orderId={orderId} />
            )}

            {/* Card / ZaloPay placeholder */}
            {(selectedMethod === "zalopay" || selectedMethod === "card") && (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center py-12">
                <p className="text-4xl mb-3">{currentMethod.icon}</p>
                <p className="text-gray-600 font-medium">
                  Bạn sẽ được chuyển đến cổng thanh toán {currentMethod.label}
                </p>
                <p className="text-sm text-gray-400 mt-1">Sau khi xác nhận đặt hàng</p>
              </div>
            )}

            {/* Terms */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreed((v) => !v)}
                  className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    agreed ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  }`}
                >
                  {agreed && <Check className="w-3 h-3 text-white" />}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tôi đã đọc và đồng ý với{" "}
                  <span className="text-blue-600 font-semibold">điều khoản sử dụng</span> và{" "}
                  <span className="text-blue-600 font-semibold">chính sách hoàn hủy tour</span> của TravelGo.
                </p>
              </label>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full font-black py-4 rounded-xl transition-all text-base ${
                agreed
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 cursor-pointer active:scale-98"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Xác nhận thanh toán
            </button>
          </div>

          {/* RIGHT — order summary */}
          <div>
            <PaymentOrderSummary
              tour={tour}
              date={date}
              customer={customer}
              totalPrice={totalPrice}
              deposit={deposit}
              orderId={orderId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
