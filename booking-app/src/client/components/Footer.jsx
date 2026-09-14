import { Link } from "react-router-dom";
import { Compass, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ShieldCheck, CreditCard, Award } from "lucide-react";
import logoImg from "../../assets/Client/images/logotravelgo.png";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/home" className="inline-flex items-center gap-2">
              <img src={logoImg} alt="TravelGo Logo" className="h-10 w-auto object-contain bg-white/10 rounded-xl p-1 backdrop-blur-sm" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nền tảng đặt tour du lịch hàng đầu Việt Nam. Cam kết chất lượng tour vượt trội, giá cả minh bạch và dịch vụ hỗ trợ tận tâm 24/7.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-2 rounded-lg text-slate-300">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Bảo hiểm 100%
              </div>
              <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-2 rounded-lg text-slate-300">
                <Award className="w-4 h-4 text-yellow-400" /> Uy tín 10 năm
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Tour Phổ Biến</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="/home#domestic" className="hover:text-blue-400 transition-colors">Tour Vịnh Hạ Long</a></li>
              <li><a href="/home#domestic" className="hover:text-blue-400 transition-colors">Tour Đà Nẵng - Hội An</a></li>
              <li><a href="/home#domestic" className="hover:text-blue-400 transition-colors">Tour Đảo Ngọc Phú Quốc</a></li>
              <li><a href="/home#domestic" className="hover:text-blue-400 transition-colors">Tour Sapa Fansipan</a></li>
              <li><a href="/home#international" className="hover:text-blue-400 transition-colors">Tour Nhật Bản Mùa Hoa</a></li>
              <li><a href="/home#international" className="hover:text-blue-400 transition-colors">Tour Thái Lan Bangkok</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Chính Sách & Điều Khoản</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/home" className="hover:text-blue-400 transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link to="/home" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/home" className="hover:text-blue-400 transition-colors">Quy định đặt cọc & hoàn hủy</Link></li>
              <li><Link to="/home" className="hover:text-blue-400 transition-colors">Bảo hiểm du lịch</Link></li>
              <li><Link to="/home" className="hover:text-blue-400 transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Cổng dành cho Quản trị</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:18001234" className="hover:text-white font-semibold text-white">1800 1234 (Miễn phí)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>hotro@travelgo.vn</span>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-slate-500 mb-2">Chấp nhận thanh toán:</p>
              <div className="flex items-center gap-2 text-xl">
                <span>🏦</span>
                <span>💳</span>
                <span>💜</span>
                <span>💙</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TravelGo. Bản quyền thuộc về HinBookingTour.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">Chính sách quyền riêng tư</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Sơ đồ trang web</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
