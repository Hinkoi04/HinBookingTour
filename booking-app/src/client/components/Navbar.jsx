import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown, Phone, Menu, X, Shield, Sparkles, User, LogIn, LogOut,
  MapPin, Globe, Award
} from "lucide-react";
import logoImg from "../../assets/Client/images/logotravelgo.png";
import { authService } from "../modules/auth/services/authService";
import { toast } from "sonner";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [userDropdown, setUserDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setUserDropdown(false);
    toast.success("Đã đăng xuất tài khoản thành công");
  };

  const domesticSubmenu = [
    { title: "Tour Miền Bắc", desc: "Hà Nội, Vịnh Hạ Long, Sapa, Ninh Bình", query: "Tour Miền Bắc" },
    { title: "Tour Miền Trung", desc: "Đà Nẵng, Hội An, Huế, Nha Trang, Quy Nhơn", query: "Tour Miền Trung" },
    { title: "Tour Miền Nam", desc: "Phú Quốc, TP.HCM, Cần Thơ, Mũi Né", query: "Tour Miền Nam" },
    { title: "Tour Tây Nguyên", desc: "Đà Lạt, Buôn Ma Thuột, Pleiku", query: "Tây Nguyên" },
  ];

  const internationalSubmenu = [
    { title: "Tour Đông Nam Á", desc: "Thái Lan, Singapore, Malaysia, Bali Indonesia", query: "Đông Nam Á" },
    { title: "Tour Đông Bắc Á", desc: "Nhật Bản, Hàn Quốc, Đài Loan, Trung Quốc", query: "Đông Bắc Á" },
    { title: "Tour Châu Âu", desc: "Pháp, Ý, Thụy Sĩ, Đức, Hà Lan", query: "Châu Âu" },
    { title: "Tour Châu Úc & Mỹ", desc: "Sydney, Melbourne Úc, Bờ Đông Bờ Tây Mỹ", query: "Châu Mỹ" },
  ];

  const handleSelectCategory = (query) => {
    setActiveDropdown(null);
    setIsOpen(false);
    navigate(`/home?category=${encodeURIComponent(query)}`);
    const el = document.getElementById("search-results");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      {/* Top bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-yellow-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Ưu đãi mùa du lịch - Giảm đến 30%
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Cam kết giá tốt & chất lượng hàng đầu
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:18001234" className="flex items-center gap-1.5 text-white hover:text-yellow-400 font-bold transition-colors">
              <Phone className="w-3.5 h-3.5 text-yellow-400" /> 1800 1234
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="flex items-center gap-1 hover:text-white transition-colors text-slate-400 hover:text-slate-200">
              <User className="w-3.5 h-3.5" /> Quản trị Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo with image */}
        <Link to="/home" className="flex items-center gap-3 group">
          <img
            src={logoImg}
            alt="TravelGo Logo"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            to="/home"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === "/home" || location.pathname === "/"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Trang chủ
          </Link>

          <a
            href="/home#flash-sale"
            className="px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            Flash Sale 🔥
          </a>

          {/* Tour Trong Nước Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("domestic")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                activeDropdown === "domestic"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Tour trong nước
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "domestic" ? "rotate-180 text-blue-600" : "text-gray-400"}`} />
            </button>

            {activeDropdown === "domestic" && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 space-y-1 animate-fadeIn z-50">
                <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Điểm đến Việt Nam
                </div>
                {domesticSubmenu.map((sub) => (
                  <button
                    key={sub.title}
                    type="button"
                    onClick={() => handleSelectCategory(sub.query)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 transition-colors group cursor-pointer"
                  >
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {sub.title}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {sub.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tour Quốc Tế Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("international")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                activeDropdown === "international"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Tour quốc tế
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "international" ? "rotate-180 text-blue-600" : "text-gray-400"}`} />
            </button>

            {activeDropdown === "international" && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 space-y-1 animate-fadeIn z-50">
                <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-600" /> Khám phá thế giới
                </div>
                {internationalSubmenu.map((sub) => (
                  <button
                    key={sub.title}
                    type="button"
                    onClick={() => handleSelectCategory(sub.query)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 transition-colors group cursor-pointer"
                  >
                    <p className="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {sub.title}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {sub.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/home#blogs"
            className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            Cẩm nang
          </a>

          <a
            href="/home#contact"
            className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            Liên hệ
          </a>
        </nav>

        {/* Action Button: Đăng nhập / User Profile */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 px-3 rounded-full transition-all cursor-pointer"
              >
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-xs font-bold text-gray-800 max-w-[120px] truncate">
                  {currentUser.fullName || currentUser.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 space-y-1 animate-fadeIn z-50">
                  <div className="p-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800 truncate">{currentUser.fullName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{currentUser.email || "Thành viên TravelGo"}</p>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" /> Trang quản trị
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4" /> Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600 text-sm font-bold px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <Link
            to="/home"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Trang chủ
          </Link>

          <a
            href="/home#flash-sale"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Flash Sale Giờ Vàng 🔥
          </a>

          {/* Domestic sub */}
          <div className="py-2 border-y border-gray-100">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Tour trong nước
            </p>
            {domesticSubmenu.map((sub) => (
              <button
                key={sub.title}
                type="button"
                onClick={() => handleSelectCategory(sub.query)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center justify-between"
              >
                <span>{sub.title}</span>
                <span className="text-xs text-gray-400">Xem →</span>
              </button>
            ))}
          </div>

          {/* International sub */}
          <div className="py-2 border-b border-gray-100">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Tour quốc tế
            </p>
            {internationalSubmenu.map((sub) => (
              <button
                key={sub.title}
                type="button"
                onClick={() => handleSelectCategory(sub.query)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg flex items-center justify-between"
              >
                <span>{sub.title}</span>
                <span className="text-xs text-gray-400">Xem →</span>
              </button>
            ))}
          </div>

          <a
            href="/home#blogs"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-50"
          >
            Cẩm nang
          </a>

          <a
            href="/home#contact"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-50"
          >
            Liên hệ
          </a>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-bold text-gray-800">{currentUser.fullName}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm"
                >
                  <LogIn className="w-4 h-4" /> Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-gray-100 text-gray-800 font-bold py-2.5 rounded-xl text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
