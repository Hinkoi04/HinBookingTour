import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPageShell from "../../../components/DetailPageShell";
import { accountService } from "../../users/services/accountService";
import { CouponDetailModal } from "../components/CouponDetailModal";
import { couponService } from "../services/couponService";

export default function CouponDetailPage() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const couponId = Number(id);
    if (!Number.isInteger(couponId) || couponId <= 0) {
      setError("Mã giảm giá không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    Promise.all([couponService.getById(couponId), accountService.getAllActive()])
      .then(([couponData, accountData]) => {
        if (!active) return;
        setCoupon(couponData);
        setAccounts(accountData);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết mã giảm giá.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const getAccountName = (accountId) =>
    accounts.find((account) => String(account.id) === String(accountId))?.fullName || `Nhân viên #${accountId}`;

  return (
    <DetailPageShell backTo="/admin/discounts" backLabel="Quay lại danh sách mã giảm giá" loading={loading} error={error}>
      <CouponDetailModal isOpen pageMode coupon={coupon} getAccountName={getAccountName} />
    </DetailPageShell>
  );
}
