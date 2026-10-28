import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { loginService } from '../services/authService';

const DEMO_ACCOUNTS = [
  { label: "Admin",     role: "Toàn quyền hệ thống", email: "dovanhin04@gmail.com",  password: "password123" },
  { label: "Nhân viên 1", role: "Staff", email: "nhanvien.test@tour.com",   password: "password123" },
  { label: "Nhân viên 2",   role: "Staff",   email: "staff.test@tour.com", password: "password123" },
  { label: "Hướng dẫn viên",   role: "Guide",   email: "hdv1@gmail.com", password: "password123" },
];

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [prefill, setPrefill] = useState({ email: "", password: "" });

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginService(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      window.location.href = '/admin';
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng nhập tài khoản hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hidden md:flex flex-col justify-center w-2/5 bg-gray-50 border-r border-gray-100 p-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Chọn tài khoản
        </p>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = prefill.email === acc.email;
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => setPrefill({ email: acc.email, password: acc.password })}
                className={`
                  w-full text-left px-4 py-3 rounded-xl border transition-all duration-150
                  ${isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }
                `}
              >
                <p className="text-sm font-semibold">{acc.label}</p>
                <p className={`text-xs mt-0.5 ${isSelected ? "text-gray-400" : "text-gray-400"}`}>
                  {acc.role}
                </p>
                <p className={`text-[11px] mt-1 truncate ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                  {acc.email}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Vui lòng nhập thông tin để truy cập hệ thống.
            </p>
          </div>
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            prefillEmail={prefill.email}
            prefillPassword={prefill.password}
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;