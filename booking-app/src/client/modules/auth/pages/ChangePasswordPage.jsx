import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    (typeof error.response?.data === "string" ? error.response.data : "") ||
    error.message ||
    "Không thể đổi mật khẩu"
  );
}

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu mới xác nhận không khớp");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      authService.logout();
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-semibold text-gray-900">Đổi mật khẩu</h1>
            <p className="mt-0.5 text-sm text-gray-500">Xác nhận mật khẩu hiện tại để tiếp tục.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label htmlFor="client-current-password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Mật khẩu hiện tại
            </label>
            <input
              id="client-current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="client-new-password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <input
              id="client-new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={72}
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1.5 text-xs text-gray-500">Mật khẩu có độ dài từ 6 đến 72 ký tự.</p>
          </div>

          <div>
            <label htmlFor="client-confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="client-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={72}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Đang cập nhật...
                </span>
              ) : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
