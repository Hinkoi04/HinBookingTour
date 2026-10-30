import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FolderTree, Calendar, Ticket, BusFront,
  ShoppingCart, FileText, Users, MessageSquare,
  LogOut, Settings, KeyRound, Search, X, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";

import { getMeService } from "../modules/login/services/authService"; 
import UserProfileModal from "../modules/users/components/UserProfileModal";
import { accountService } from "../modules/users/services/accountService";
import { BRAND_LOGO_URL } from "../../services/branding";

import ConfirmModal from "../components/ConfirmModal";

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý Tour", href: "/admin/tours", icon: MapPin },
  { name: "Danh mục", href: "/admin/categories", icon: FolderTree },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Lịch khởi hành", href: "/admin/departures", icon: Calendar },
  { name: "Phương tiện", href: "/admin/vehicles", icon: BusFront },
  { name: "Mã giảm giá", href: "/admin/discounts", icon: Ticket },
  { name: "Đơn đặt vé", href: "/admin/bookings", icon: ShoppingCart },
  { name: "Bài viết", href: "/admin/blogs", icon: FileText },
  { name: "Đánh giá", href: "/admin/reviews", icon: MessageSquare },
  { name: "Liên hệ", href: "/admin/contacts", icon: MessageSquare },
  { name: "Phân quyền", href: "/admin/roles", icon: KeyRound },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const dropdownRef = useRef(null);
  const currentPage = [...navigation]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => location.pathname === item.href || location.pathname.startsWith(`${item.href}/`))
    || (location.pathname === "/admin/change-password" ? { name: "Đổi mật khẩu" } : null);

  const fetchUser = async () => {
    try {
      const me = await getMeService(); 
      if (me?.id) {
        const fullUser = await accountService.getById(me.id).catch(() => me);
        setUser(fullUser || me);
      } else if (me) {
        setUser(me);
      }
    } catch (error) {
      console.error("Không thể lấy thông tin người dùng", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [confirmCofig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const closeConfirm=()=>{
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận đăng xuất",
      message: "Bạn có chắc chắn muốn đăng xuất không?",
      variant: "warning",
      action:()=>{
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("refreshToken"); 
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("roleName");

      navigate("/admin/login");
    }});
  };

  const openProfileModal = () => {
    setIsDropdownOpen(false);
    setIsProfileOpen(true);
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    navigate("/admin/change-password");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <div className={`bg-white border-r border-gray-200 flex flex-col h-full shrink-0 transition-all duration-200 ${isSidebarCollapsed ? "w-16 px-2" : "w-64 px-4"}`}>
        <div className="flex flex-col h-full relative">
          <div className={`mt-4 flex w-full items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {!isSidebarCollapsed && (
              <Link to="/admin" className="flex min-w-0">
                <img className="logo__img max-h-12 max-w-[180px] w-auto object-contain" src={BRAND_LOGO_URL} alt="TRAVELGO" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
              aria-expanded={!isSidebarCollapsed}
              title={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center rounded-lg py-3 text-sm transition-all duration-200 font-medium w-full ${
                        isSidebarCollapsed ? "justify-center px-0" : "gap-4 px-3"
                      } ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      title={isSidebarCollapsed ? item.name : undefined}
                      aria-label={isSidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {!isSidebarCollapsed && <span className="text-base font-medium">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
        <header className="sticky top-0 z-30 flex min-h-20 items-center gap-6 border-b border-gray-200 bg-white px-5 py-3 shadow-sm sm:px-8">
          <div className="hidden min-w-40 sm:block">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentPage?.name || "Quản trị"}
            </h1>
          </div>

          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm kiếm nội dung trang..."
              aria-label="Tìm kiếm nội dung trang"
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Xóa nội dung tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="shrink-0 rounded-xl border border-gray-200 p-3 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            title="Tải lại trang"
            aria-label="Tải lại trang"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <div className="relative ml-auto shrink-0" ref={dropdownRef}>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-col py-1">
                  <button
                    onClick={openProfileModal}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    Cập nhật thông tin
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <KeyRound className="h-4 w-4 text-gray-500" />
                    Đổi mật khẩu
                  </button>
                  <div className="my-1 h-px bg-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 rounded-lg p-1.5 text-left transition-colors ${isDropdownOpen ? "bg-gray-100" : "hover:bg-gray-50"}`}
              aria-expanded={isDropdownOpen}
              aria-label="Tài khoản"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-200 bg-blue-100 font-bold text-blue-600">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0)?.toUpperCase() || "U"
                )}
              </span>
              <span className="hidden min-w-0 md:block">
                <span className="block max-w-36 truncate text-sm font-semibold text-gray-900">
                  {user ? user.fullName : "Đang tải..."}
                </span>
                <span className="block max-w-36 truncate text-xs text-gray-500">
                  {user ? user.email : ""}
                </span>
              </span>
            </button>
          </div>
        </header>
        <Outlet context={{ searchQuery }} />
      </main>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
        onUpdateSuccess={fetchUser} 
      />
      <ConfirmModal
        isOpen={confirmCofig.isOpen}
        title={confirmCofig.title}
        message={confirmCofig.message}
        variant={confirmCofig.variant}
        onConfirm={() => {
          if (confirmCofig.action) confirmCofig.action();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
      
    </div>
  );
}