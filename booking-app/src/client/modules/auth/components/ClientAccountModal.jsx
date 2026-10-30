import { useEffect, useState } from "react";
import { KeyRound, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    (typeof error.response?.data === "string" ? error.response.data : "") ||
    error.message ||
    fallback
  );
}

export function ClientAccountModal({ user, mode, onClose, onProfileUpdated, onPasswordChanged }) {
  const [profile, setProfile] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    phone: "",
  });
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== "profile") return undefined;
    let active = true;
    authService.getProfile(user.id)
      .then((data) => {
        if (active) {
          setProfile({
            fullName: data.fullName || user.fullName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
          });
        }
      })
      .catch((error) => {
        if (active) toast.error(getErrorMessage(error, "Không thể tải thông tin tài khoản"));
      });

    return () => {
      active = false;
    };
  }, [mode, user.email, user.fullName, user.id]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile(user.id, {
        fullName: profile.fullName.trim(),
        email: profile.email,
        phone: profile.phone.trim(),
      });
      onProfileUpdated({
        ...user,
        fullName: updated.fullName || profile.fullName.trim(),
        email: updated.email || profile.email,
        phone: updated.phone ?? profile.phone.trim(),
        avatar: updated.avatar || user.avatar,
      });
      toast.success("Cập nhật thông tin thành công");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể cập nhật thông tin"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Mật khẩu mới xác nhận không khớp");
      return;
    }
    if (password.currentPassword === password.newPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(password.currentPassword, password.newPassword);
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      onPasswordChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể đổi mật khẩu"));
    } finally {
      setLoading(false);
    }
  };

  const isProfile = mode === "profile";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-account-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {isProfile ? <UserRound className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
            </span>
            <div>
              <h2 id="client-account-title" className="font-bold text-gray-900">
                {isProfile ? "Cập nhật thông tin" : "Đổi mật khẩu"}
              </h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Đóng"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {isProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4 p-6">
            <div>
              <label htmlFor="client-profile-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                id="client-profile-name"
                required
                value={profile.fullName}
                onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="client-profile-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email đăng nhập
              </label>
              <input
                id="client-profile-email"
                type="email"
                readOnly
                value={profile.email}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="client-profile-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                id="client-profile-phone"
                type="tel"
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <footer className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </footer>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 p-6">
            {[
              ["currentPassword", "Mật khẩu hiện tại", "current-password"],
              ["newPassword", "Mật khẩu mới", "new-password"],
              ["confirmPassword", "Xác nhận mật khẩu mới", "new-password"],
            ].map(([name, label, autoComplete]) => (
              <div key={name}>
                <label htmlFor={`client-${name}`} className="mb-1.5 block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  id={`client-${name}`}
                  name={name}
                  type="password"
                  autoComplete={autoComplete}
                  required
                  minLength={name === "currentPassword" ? undefined : 6}
                  maxLength={name === "currentPassword" ? undefined : 72}
                  value={password[name]}
                  onChange={(event) => setPassword((current) => ({ ...current, [name]: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
            <footer className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}

export default ClientAccountModal;
