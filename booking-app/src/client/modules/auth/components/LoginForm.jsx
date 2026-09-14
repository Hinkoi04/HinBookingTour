import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, CheckCircle } from "lucide-react";
import { authService } from "../services/authService";
import { toast } from "sonner";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ username, password });
      if (res.success) {
        toast.success(`Chào mừng bạn quay trở lại, ${res.user.fullName}!`);
        window.dispatchEvent(new Event("auth-changed"));
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Tên đăng nhập hoặc Email *
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="nguyenvana hoặc email@example.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Mật khẩu *
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Vui lòng liên hệ hotline 1800 1234 để lấy lại mật khẩu.");
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-gray-600">Ghi nhớ đăng nhập</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm active:scale-98 cursor-pointer"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-4 h-4" /> Đăng nhập
          </>
        )}
      </button>

      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-gray-200 w-full" />
        <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">hoặc tiếp tục với</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            toast.success("Đăng nhập Google thành công!");
            authService.login({ username: "Google User", email: "user@gmail.com" });
            window.dispatchEvent(new Event("auth-changed"));
            navigate(from, { replace: true });
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-base">🌐</span> Google
        </button>
        <button
          type="button"
          onClick={() => {
            toast.success("Đăng nhập Facebook thành công!");
            authService.login({ username: "FB User", email: "fb_user@facebook.com" });
            window.dispatchEvent(new Event("auth-changed"));
            navigate(from, { replace: true });
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-base text-blue-600">📘</span> Facebook
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 pt-2">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-bold text-blue-600 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
