import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    (typeof error.response?.data === "string" ? error.response.data : "") ||
    error.message ||
    fallback
  );
}

export function ClientProfilePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
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
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.email, user?.fullName, user?.id]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await authService.updateProfile(user.id, {
        fullName: profile.fullName.trim(),
        email: profile.email,
        phone: profile.phone.trim(),
      });
      const updatedUser = {
        ...user,
        fullName: updated.fullName || profile.fullName.trim(),
        email: updated.email || profile.email,
        phone: updated.phone ?? profile.phone.trim(),
        avatar: updated.avatar || user.avatar,
      };
      localStorage.setItem("client_travelgo_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Cập nhật thông tin thành công");
      navigate("/home");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể cập nhật thông tin"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <header className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-semibold text-gray-900">Cập nhật thông tin</h1>
            <p className="mt-0.5 text-sm text-gray-500">Quản lý thông tin tài khoản của bạn.</p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 p-8 text-sm text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
            <span>Đang tải thông tin...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label htmlFor="client-profile-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Tên người dùng
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

            <footer className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Đang lưu...
                  </span>
                ) : "Lưu thay đổi"}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
