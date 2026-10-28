import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { DeparturePassengersModal } from "../components/DeparturePassengersModal";

export default function DeparturePassengersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const departureId = Number(id);

  if (!Number.isInteger(departureId) || departureId <= 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Mã lịch khởi hành không hợp lệ.</p>
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
    <DeparturePassengersModal
      isOpen
      pageMode
      departure={{ id: departureId }}
      onClose={() => navigate("/admin/departures")}
    />
  );
}
