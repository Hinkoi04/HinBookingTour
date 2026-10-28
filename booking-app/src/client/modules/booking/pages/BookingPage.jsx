import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, AlertCircle } from "lucide-react";
import { bookingService } from "../services/bookingService";
import { BookingSteps, BookingForm, BookingOrderSummary, BookingPolicy } from "../components";
import { toast } from "sonner";

export function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    notes: "",
  });

  const tour = state?.tour;
  const date = state?.date;
  const adults = Number(state?.adults) || 1;
  const children = Number(state?.children) || 0;
  const babies = Number(state?.babies) || 0;
  const unitPrice = state?.unitPrice || tour?.price || 0;
  const childPrice = state?.childPrice || Math.round(unitPrice * 0.5);
  const babyPrice = state?.babyPrice || 0;
  const totalPrice = state?.totalPrice || (adults * unitPrice + children * childPrice + babies * babyPrice);

  // Khởi tạo danh sách hành khách theo đúng số lượng từng loại khách
  const [passengers, setPassengers] = useState(() => {
    const list = [];
    let idCounter = 1;

    for (let i = 0; i < adults; i++) {
      list.push({
        id: `adult_${idCounter++}`,
        type: "adult",
        typeLabel: "Người lớn (≥ 12 tuổi)",
        fullName: "",
        gender: "Nam",
        dob: "",
        idCard: "",
        phone: "",
        sameAsContact: i === 0, // Mặc định người lớn đầu tiên là người liên hệ
      });
    }

    for (let i = 0; i < children; i++) {
      list.push({
        id: `child_${idCounter++}`,
        type: "children",
        typeLabel: "Trẻ em (5-11 tuổi)",
        fullName: "",
        gender: "Nam",
        dob: "",
        idCard: "",
        phone: "",
        sameAsContact: false,
      });
    }

    for (let i = 0; i < babies; i++) {
      list.push({
        id: `baby_${idCounter++}`,
        type: "baby",
        typeLabel: "Em bé (< 5 tuổi)",
        fullName: "",
        gender: "Nam",
        dob: "",
        idCard: "",
        phone: "",
        sameAsContact: false,
      });
    }

    return list;
  });

  // Hình thức thanh toán: "half" (cọc 50%), "full" (thanh toán hết), "cod" (thanh toán khi nhận vé)
  const [paymentPlan, setPaymentPlan] = useState("half");
  const [errors, setErrors] = useState({});

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-lg text-gray-500 font-medium">Không có thông tin đặt tour</p>
        <Link to="/home" className="text-blue-600 hover:underline font-medium">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  // Tính toán số tiền cần trả theo hình thức cọc/thanh toán
  let amountToPay = 0;
  let remainingAmount = 0;
  if (paymentPlan === "half") {
    amountToPay = Math.round(totalPrice * 0.5);
    remainingAmount = totalPrice - amountToPay;
  } else if (paymentPlan === "full") {
    amountToPay = totalPrice;
    remainingAmount = 0;
  } else if (paymentPlan === "cod") {
    amountToPay = 0;
    remainingAmount = totalPrice;
  }

  const handleSubmit = () => {
    // Tự động gán thông tin người đặt tour cho hành khách #1 nếu checkbox sameAsContact được bật
    const updatedPassengers = passengers.map((p, idx) => {
      if (idx === 0 && p.sameAsContact) {
        return {
          ...p,
          fullName: form.fullName || p.fullName,
          idCard: form.idNumber || p.idCard,
          phone: form.phone || p.phone,
        };
      }
      return p;
    });

    const { isValid, errors: validationErrors } = bookingService.validateBooking(form, updatedPassengers);
    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Vui lòng điền đầy đủ họ tên cho tất cả hành khách và thông tin liên hệ");
      return;
    }

    navigate("/payment", {
      state: {
        tour,
        date,
        adults,
        children,
        babies,
        unitPrice,
        childPrice,
        babyPrice,
        totalPrice,
        paymentPlan,
        amountToPay,
        remainingAmount,
        deposit: amountToPay,
        customer: form,
        passengers: updatedPassengers,
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/home" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/tour/${encodeURIComponent(tour.slug || tour.id)}`} className="hover:text-blue-600 line-clamp-1">
            {tour.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Đặt tour & Điền thông tin</span>
        </div>
      </div>

      {/* Progress */}
      <BookingSteps currentStep={1} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <BookingForm
              form={form}
              setForm={setForm}
              passengers={passengers}
              setPassengers={setPassengers}
              errors={errors}
              setErrors={setErrors}
              adults={adults}
              children={children}
              babies={babies}
            />

            <BookingPolicy />

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-colors text-base shadow-lg shadow-blue-500/20 cursor-pointer active:scale-98"
            >
              Tiến hành thanh toán ({paymentPlan === "cod" ? "Thanh toán COD" : paymentPlan === "half" ? "Đặt cọc 50%" : "Thanh toán hết"}) →
            </button>
          </div>

          {/* Order summary */}
          <div>
            <BookingOrderSummary
              tour={tour}
              date={date}
              adults={adults}
              children={children}
              babies={babies}
              totalPrice={totalPrice}
              paymentPlan={paymentPlan}
              onSelectPaymentPlan={setPaymentPlan}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
