import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPageShell from "../../../components/DetailPageShell";
import { RoleDetailModal } from "../components/RoleDetailModal";
import { roleService } from "../services/roleService";

export default function RoleDetailPage() {
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const roleId = Number(id);
    if (!Number.isInteger(roleId) || roleId <= 0) {
      setError("Mã vai trò không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    roleService.getById(roleId)
      .then((data) => { if (active) setRole(data); })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết vai trò.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  return (
    <DetailPageShell backTo="/admin/roles" backLabel="Quay lại danh sách vai trò" loading={loading} error={error}>
      <RoleDetailModal isOpen pageMode role={role} />
    </DetailPageShell>
  );
}
