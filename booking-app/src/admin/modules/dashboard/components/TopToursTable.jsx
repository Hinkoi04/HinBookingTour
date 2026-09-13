export function TopToursTable({ tours }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Top 5 Tour bán chạy</h3>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-16">STT</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-auto">Tên Tour</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-32">Số lượt đặt</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-48 text-right">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours.map((tour, index) => (
              <tr key={tour.name} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{tour.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  <span className="font-medium">{tour.bookings}</span> lượt
                </td>
                <td className="py-4 px-6 text-sm font-bold text-green-600 text-right">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}