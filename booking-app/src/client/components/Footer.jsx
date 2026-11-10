import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, CreditCard, Award, Landmark, Wallet, Banknote } from "lucide-react";
import { BRAND_LOGO_URL } from "../../services/branding";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="client-footer">
      <div className="client-footer__inner">
        {/* Main Grid */}
        <div className="client-footer__grid">
          {/* Brand Col */}
          <div className="client-footer__brand">
            <Link to="/home" className="client-footer__logo">
              <img src={BRAND_LOGO_URL} alt="TravelGo Logo" />
            </Link>
            <p className="client-footer__description">
              Nền tảng đặt tour du lịch hàng đầu Việt Nam. Cam kết chất lượng tour vượt trội, giá cả minh bạch và dịch vụ hỗ trợ tận tâm 24/7.
            </p>
            <div className="client-footer__badges">
              <div>
                <ShieldCheck aria-hidden="true" /> Bảo hiểm 100%
              </div>
              <div>
                <Award aria-hidden="true" /> Uy tín 10 năm
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="client-footer__column">
            <h4>Tour Phổ Biến</h4>
            <ul>
              <li><a href="/home#domestic">Tour Vịnh Hạ Long</a></li>
              <li><a href="/home#domestic">Tour Đà Nẵng - Hội An</a></li>
              <li><a href="/home#domestic">Tour Đảo Ngọc Phú Quốc</a></li>
              <li><a href="/home#domestic">Tour Sapa Fansipan</a></li>
              <li><a href="/home#international">Tour Nhật Bản Mùa Hoa</a></li>
              <li><a href="/home#international">Tour Thái Lan Bangkok</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="client-footer__column">
            <h4>Chính Sách & Điều Khoản</h4>
            <ul>
              <li><Link to="/home">Điều khoản dịch vụ</Link></li>
              <li><Link to="/home">Chính sách bảo mật</Link></li>
              <li><Link to="/home">Quy định đặt cọc & hoàn hủy</Link></li>
              <li><Link to="/home">Bảo hiểm du lịch</Link></li>
              <li><Link to="/home">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link to="/admin">Cổng dành cho Quản trị</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="client-footer__column client-footer__contact">
            <h4>Liên Hệ</h4>
            <ul>
              <li>
                <MapPin aria-hidden="true" />
                <span>123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href="tel:18001234">1800 1234 (Miễn phí)</a>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <span>hotro@travelgo.vn</span>
              </li>
            </ul>

            <div className="client-footer__payments">
              <p>Chấp nhận thanh toán:</p>
              <div>
                <Landmark className="w-5 h-5" aria-hidden="true" />
                <CreditCard className="w-5 h-5" aria-hidden="true" />
                <Wallet className="w-5 h-5" aria-hidden="true" />
                <Banknote className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="client-footer__bottom">
          <p>© {new Date().getFullYear()} TravelGo. Bản quyền thuộc về HinBookingTour.</p>
          <div>
            <a href="#">Chính sách quyền riêng tư</a>
            <span>•</span>
            <a href="#">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="#">Sơ đồ trang web</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
