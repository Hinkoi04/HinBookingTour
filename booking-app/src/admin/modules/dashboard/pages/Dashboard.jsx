import { useState, useEffect } from "react";
import { StatCards } from "../components/StatCards";
import { RevenueChart, BookingStatusChart } from "../components/DashboardCharts";
import { TopToursTable } from "../components/TopToursTable";
import { getDashboardData } from "../services/dashboardService";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardData()
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu dashboard:", err);
        setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);


  if (error) {
    return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Thống kê tổng quan hệ thống quản lý tour</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-sm font-medium text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : (<>
      {/* Truyền dữ liệu vào StatCards */}
      <StatCards data={dashboardData.statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={dashboardData.revenueData} />
        </div>
        <div className="lg:col-span-1">
          <BookingStatusChart data={dashboardData.bookingStatus} />
        </div>
      </div>

      <TopToursTable tours={dashboardData.topTours} />
      </>)}
    </div>
  );
}
