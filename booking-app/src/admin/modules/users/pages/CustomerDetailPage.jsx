import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPageShell from "../../../components/DetailPageShell";
import { UserDetailModal } from "../components/UserDetailModal";
import { userService } from "../services/userService";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const customerId = Number(id);
    if (!Number.isInteger(customerId) || customerId <= 0) {
      setError("Mã khách hàng không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    userService.getById(customerId)
      .then((customerData) => {
        if (!active) return;
        setCustomer({ ...customerData, role: "customer" });
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết khách hàng.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  return (
    <DetailPageShell backTo="/admin/users" backLabel="Quay lại danh sách khách hàng" loading={loading} error={error}>
      <UserDetailModal isOpen pageMode user={customer} />
    </DetailPageShell>
  );
}
