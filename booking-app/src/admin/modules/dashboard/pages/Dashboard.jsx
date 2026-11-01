import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";
import { StatCards } from "../components/StatCards";
import { RevenueChart, BookingStatusChart } from "../components/DashboardCharts";
import { TopToursTable } from "../components/TopToursTable";
import { getDashboardData } from "../services/dashboardService";

const today = new Date();
const localDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekRangeLabel = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const monday = new Date(year, month - 1, day);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${monday.toLocaleDateString("vi-VN")} - ${sunday.toLocaleDateString("vi-VN")}`;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("month");
  const [selectedDate, setSelectedDate] = useState(localDateString(today));
  const [refreshKey, setRefreshKey] = useState(0);
  const yearOptions = Array.from(
    { length: today.getFullYear() - 1999 },
    (_, index) => String(today.getFullYear() - index),
  );

  const queryDate = period === "month"
    ? `${selectedDate.slice(0, 7)}-01`
    : period === "year"
      ? `${selectedDate.slice(0, 4)}-01-01`
      : selectedDate;

  useEffect(() => {
    let isCurrentRequest = true;
    setLoading(true);
    setError(null);

    getDashboardData(period, queryDate)
      .then((data) => {
        if (isCurrentRequest) setDashboardData(data);
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu dashboard:", err);
        if (isCurrentRequest) {
          setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [period, queryDate, refreshKey]);

  const handleDateChange = (value) => {
    if (!value) return;
    if (period === "month") {
      setSelectedDate(`${value}-01`);
    } else if (period === "year") {
      setSelectedDate(`${value}-01-01`);
    } else {
      setSelectedDate(value);
    }
  };

  const dateInputValue = period === "month"
    ? selectedDate.slice(0, 7)
    : period === "year"
      ? selectedDate.slice(0, 4)
      : selectedDate;

  return (
    <div className="w-full max-w-full space-y-6 overflow-hidden p-6 lg:p-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-600">Bảng điều khiển</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tổng quan</h1>
          <p className="mt-1 text-sm text-gray-500">Theo dõi tình hình kinh doanh và đặt tour.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="min-w-40">
            <label htmlFor="dashboard-period" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Xem theo
            </label>
            <select
              id="dashboard-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          <div className="min-w-48">
            <label htmlFor="dashboard-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {period === "week" ? "Chọn một ngày trong tuần" : period === "year" ? "Chọn năm" : period === "month" ? "Chọn tháng" : "Chọn ngày"}
            </label>
            <div className="relative">
              <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              {period === "year" ? (
                <select
                  id="dashboard-date"
                  value={dateInputValue}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              ) : (
                <input
                  id="dashboard-date"
                  type={period === "month" ? "month" : "date"}
                  value={dateInputValue}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              )}
            </div>
            {period === "week" && (
              <p className="mt-1.5 text-xs text-gray-500">Tuần {getWeekRangeLabel(selectedDate)}</p>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton variant="dashboard" />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="font-medium text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : dashboardData ? (
        <>
          <StatCards data={dashboardData.statCards} periodLabel={dashboardData.periodLabel} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={dashboardData.revenueData} periodLabel={dashboardData.periodLabel} />
            </div>
            <div className="lg:col-span-1">
              <BookingStatusChart data={dashboardData.bookingStatus} />
            </div>
          </div>

          <TopToursTable tours={dashboardData.topTours} />
        </>
      ) : null}
    </div>
  );
}
