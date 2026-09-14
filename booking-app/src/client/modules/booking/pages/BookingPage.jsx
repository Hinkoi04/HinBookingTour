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

  const [errors, setErrors] = useState({});

  if (!state?.tour) {
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

  const { tour, date, adults, children, totalPrice } = state;
  const deposit = totalPrice * 0.3;

  const handleSubmit = () => {
    const { isValid, errors: validationErrors } = bookingService.validateForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    navigate("/payment", {
      state: {
        tour,
        date,
        adults,
        children,
        totalPrice,
        deposit,
        customer: form,
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
          <Link to={`/tour/${tour.id}`} className="hover:text-blue-600 line-clamp-1">
            {tour.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Đặt tour</span>
        </div>
      </div>

      {/* Progress */}
      <BookingSteps currentStep={1} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <BookingForm
              form={form}
              setForm={setForm}
              errors={errors}
              setErrors={setErrors}
            />

            <BookingPolicy />

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-colors text-base shadow-lg shadow-blue-100 cursor-pointer active:scale-98"
            >
              Tiến hành thanh toán →
            </button>
          </div>

          {/* Order summary */}
          <div>
            <BookingOrderSummary
              tour={tour}
              date={date}
              adults={adults}
              children={children}
              totalPrice={totalPrice}
              deposit={deposit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
