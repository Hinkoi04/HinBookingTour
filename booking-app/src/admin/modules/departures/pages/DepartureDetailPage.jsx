import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { DepartureDetailModal } from "../components/DepartureDetailModal";
import { accountService } from "../../users/services/accountService";
import { departureService } from "../services/departureService";

export default function DepartureDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departure, setDeparture] = useState(null);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const departureId = Number(id);
    if (!Number.isInteger(departureId) || departureId <= 0) {
      setError("Mã lịch khởi hành không hợp lệ.");
      setIsLoading(false);
      return;
    }

    const fetchDeparture = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [departureData, accounts] = await Promise.all([
          departureService.getById(departureId),
          accountService.getAllActive(),
        ]);
        setDeparture(departureData);
        setAccountList(accounts);
      } catch (fetchError) {
        setError(fetchError.message || "Không thể tải chi tiết lịch khởi hành.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeparture();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
        <p className="text-sm text-gray-500">Đang tải chi tiết lịch khởi hành...</p>
      </div>
    );
  }

  if (error || !departure) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Không thể mở chi tiết lịch khởi hành</p>
            <p className="mt-1 text-sm">{error || "Không tìm thấy lịch khởi hành."}</p>
            <button
              type="button"
              onClick={() => navigate("/admin/departures")}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DepartureDetailModal
      isOpen
      pageMode
      departure={departure}
      accountList={accountList}
      onClose={() => navigate("/admin/departures")}
      onViewPassengers={() => navigate(`/admin/departures/${departure.id}/passengers`)}
    />
  );
}
