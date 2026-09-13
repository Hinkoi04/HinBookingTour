import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FolderTree, Calendar, Ticket, BusFront,
  ShoppingCart, FileText, Users, MessageSquare, Image as ImageIcon, 
  LogOut, Settings, KeyRound
} from "lucide-react";

import { getMeService } from "../modules/login/services/authService"; 
import UserProfileModal from "../modules/users/components/UserProfileModal";
import { accountService } from "../modules/users/services/accountService";
import logoTravelGo from "../../assets/Client/images/logotravelgo.png";

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
  
  const dropdownRef = useRef(null);

  const fetchUser = async () => {
    try {
      const me = await getMeService(); 
    const fullUser = await accountService.getById(me.id);
    setUser(fullUser);
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

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận đăng xuất",
      message: "Bạn có chắc chắn muốn đăng xuất không?",
      variant: "danger",
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
    alert("Chức năng Đổi mật khẩu đang được phát triển.");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 px-4">
        <div className="flex flex-col h-full relative">
          <Link to="/admin" className="flex mt-4 w-full">
            <img className="logo__img " src={logoTravelGo} alt="TRAVELGO" />
          </Link>
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-4 py-3 px-3 rounded-lg text-sm transition-all duration-200 font-medium w-full ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-base font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-gray-200 py-4 shrink-0 relative" ref={dropdownRef}>
            
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex flex-col py-1">
                  <button 
                    onClick={openProfileModal}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Cập nhật thông tin
                  </button>
                  <button 
                    onClick={handleChangePassword}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                  >
                    <KeyRound className="w-4 h-4 text-gray-500" />
                    Đổi mật khẩu
                  </button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-left w-full ${isDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 overflow-hidden border border-blue-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? user.fullName : "Đang tải..."}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user ? user.email : ""}
                </p>
              </div>
            </button>
          </div>

        </div>
      </div>

      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
        <Outlet />
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