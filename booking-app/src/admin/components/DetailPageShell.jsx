import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

export default function DetailPageShell({ backTo, backLabel, loading, error, children }) {
  if (loading) {
    return (
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <LoadingSkeleton variant="detail" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Không thể mở chi tiết</p>
            <p className="mt-1 text-sm">{error}</p>
            <Link
              to={backTo}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="px-6 pt-6 lg:px-8">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
      {children}
    </main>
  );
}
