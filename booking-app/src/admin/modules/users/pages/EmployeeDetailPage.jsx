import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, BriefcaseBusiness, CalendarDays, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { accountService } from "../services/accountService";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";

const DEFAULT_EMPLOYEE_AVATAR =
  "https://res.cloudinary.com/dlxbhq8pw/image/upload/v1793504213/c6e56503cfdd87da299f72dc416023d4_iqj1br.jpg";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-1 break-words font-medium text-gray-900">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(DEFAULT_EMPLOYEE_AVATAR);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    const employeeId = Number(id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      setError("Mã nhân viên không hợp lệ.");
      setLoading(false);
      return;
    }

    let isCurrentRequest = true;
    setLoading(true);
    setError("");

    accountService.getById(employeeId)
      .then((data) => {
        if (isCurrentRequest) {
          setEmployee(data);
          setAvatarSrc(data.avatar || DEFAULT_EMPLOYEE_AVATAR);
          setAvatarFailed(false);
        }
      })
      .catch((fetchError) => {
        if (isCurrentRequest) setError(fetchError.message || "Không thể tải thông tin nhân viên.");
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl"><LoadingSkeleton variant="detail" /></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Không thể mở chi tiết nhân viên</p>
            <p className="mt-1 text-sm">{error || "Không tìm thấy nhân viên."}</p>
            <Link
              to="/admin/users"
              className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => (
    dateString ? new Date(dateString).toLocaleString("vi-VN") : "—"
  );
  const roleName = employee.roleName || (employee.roleId === 1 ? "Admin" : "Nhân viên");

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách nhân viên
      </Link>

      <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center sm:px-10">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl ring-1 ring-gray-200 sm:h-40 sm:w-40">
              {!avatarFailed ? (
                <img
                  src={avatarSrc}
                  alt={`Ảnh đại diện ${employee.fullName}`}
                  className="h-full w-full object-cover"
                  onError={() => {
                    if (avatarSrc !== DEFAULT_EMPLOYEE_AVATAR) {
                      setAvatarSrc(DEFAULT_EMPLOYEE_AVATAR);
                    } else {
                      setAvatarFailed(true);
                    }
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-700 text-5xl font-bold text-white">
                  {employee.fullName?.charAt(0).toUpperCase() || <UserRound className="h-14 w-14" />}
                </div>
              )}
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">{employee.fullName}</h1>
          <p className="mt-1 text-gray-500">{employee.jobTitle || roleName}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              employee.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${employee.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
              {employee.status === "active" ? "Đang hoạt động" : "Đã khóa"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {roleName}
            </span>
          </div>
        </div>

        <div className="space-y-8 border-t border-gray-100 bg-gray-50/60 p-6 sm:p-8">
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">Thông tin nhân viên</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={employee.email} />
              <InfoItem icon={Phone} label="Số điện thoại" value={employee.phone} />
              <InfoItem icon={BriefcaseBusiness} label="Chức vụ" value={employee.jobTitle} />
              <InfoItem icon={ShieldCheck} label="Vai trò" value={roleName} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">Thông tin tài khoản</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem icon={CalendarDays} label="Ngày tạo" value={formatDate(employee.createdAt)} />
              <InfoItem icon={CalendarDays} label="Cập nhật lần cuối" value={formatDate(employee.updatedAt)} />
              <InfoItem icon={UserRound} label="Người tạo" value={employee.createdByName || (employee.createdBy ? "Không xác định" : "Hệ thống")} />
              <InfoItem icon={UserRound} label="Người cập nhật" value={employee.updatedByName || (employee.updatedBy ? "Không xác định" : "—")} />
              {employee.deletedAt && (
                <>
                  <InfoItem icon={UserRound} label="Người xóa" value={employee.deletedByName || (employee.deletedBy ? "Không xác định" : "—")} />
                  <InfoItem icon={CalendarDays} label="Ngày xóa" value={formatDate(employee.deletedAt)} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
