import { Link } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import logoImg from "../../../../assets/Client/images/logotravelgo.png";
import { ShieldCheck, Gift, Check } from "lucide-react";

export function RegisterPage() {
  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 flex items-center justify-center p-4 sm:p-8 py-12 sm:py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20">
        {/* Left Side: Brand & Value Prop */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-6">
            <Link to="/home" className="inline-flex items-center gap-2.5">
              <img src={logoImg} alt="TravelGo Logo" className="h-10 w-auto bg-white/10 rounded-xl p-1 backdrop-blur-sm" />
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Travel<span className="text-yellow-400">Go</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-200">
                  Hệ thống Đặt Tour
                </span>
              </div>
            </Link>

            <div className="space-y-4 pt-4">
              <span className="inline-flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-400/30">
                <Gift className="w-3.5 h-3.5" /> Quà tặng thành viên mới
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Tạo tài khoản nhận ngay Voucher 200K
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Ưu đãi độc quyền cho từng chuyến du lịch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Quản lý & thay đổi lịch trình linh hoạt</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Tích lũy dặm thưởng đổi quà hấp dẫn</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/15">
            <p className="text-xs text-blue-200 leading-relaxed">
              TravelGo cam kết bảo mật tuyệt đối dữ liệu khách hàng theo tiêu chuẩn an ninh quốc tế.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Đăng ký tài khoản
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Điền thông tin bên dưới để bắt đầu chuyến hành trình của bạn
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
