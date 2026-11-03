import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPageShell from "../../../components/DetailPageShell";
import { accountService } from "../../users/services/accountService";
import { tourService } from "../services/tourService";
import { TourDetailModal } from "../components/TourDetailModal";

export default function TourDetailPage() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const tourId = Number(id);
    if (!Number.isInteger(tourId) || tourId <= 0) {
      setError("Mã tour không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    Promise.all([tourService.getById(tourId), accountService.getAllActive()])
      .then(([tourData, accountData]) => {
        if (!active) return;
        setTour(tourData);
        setAccounts(accountData);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết tour.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const getAccountName = (accountId) =>
    accounts.find((account) => String(account.id) === String(accountId))?.fullName;

  return (
    <DetailPageShell backTo="/admin/tours" backLabel="Quay lại danh sách tour" loading={loading} error={error}>
      <TourDetailModal isOpen pageMode selectedTour={tour} getAccountName={getAccountName} />
    </DetailPageShell>
  );
}
