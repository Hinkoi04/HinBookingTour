import * as XLSX from 'xlsx';

export const exportDeparturePassengersToExcel = (departure, passengers = [], stats = {}) => {
  if (!departure) return;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getPassengerTypeName = (type) => {
    if (!type) return "Người lớn";
    const lower = String(type).toLowerCase();
    if (lower === "child" || lower === "children") return "Trẻ em";
    if (lower === "baby") return "Em bé";
    return "Người lớn";
  };

  const getStatusName = (status) => {
    if (!status) return "—";
    const lower = String(status).toLowerCase();
    if (lower === "confirmed") return "Đã xác nhận";
    if (lower === "pending") return "Chờ xác nhận";
    if (lower === "completed") return "Hoàn thành";
    if (lower === "cancelled") return "Đã hủy";
    return status;
  };

  const wb = XLSX.utils.book_new();

  const totalAdults = stats.totalAdults ?? passengers.filter(p => !p.passengerType || p.passengerType === 'adult').length;
  const totalChildren = stats.totalChildren ?? passengers.filter(p => p.passengerType === 'child' || p.passengerType === 'children').length;
  const totalBabies = stats.totalBabies ?? passengers.filter(p => p.passengerType === 'baby').length;

  const rows = [
    ["DANH SÁCH ĐOÀN KHÁCH / HÀNH KHÁCH CHUYẾN ĐI"],
    [`Ngày xuất danh sách: ${new Date().toLocaleString('vi-VN')}`],
    [],
    ["I. THÔNG TIN CHUYẾN ĐI & HƯỚNG DẪN VIÊN"],
    ["Tên Tour:", departure.tourTitle || `Tour #${departure.tourId}`],
    ["Mã lịch khởi hành:", `#${departure.id}`],
    ["Điểm khởi hành:", departure.departureFrom || "—"],
    ["Thời gian khởi hành:", formatDate(departure.startTime)],
    ["Thời gian kết thúc:", formatDate(departure.endDate)],
    ["Phương tiện:", departure.vehicleName || "Tự túc"],
    ["Hướng dẫn viên phụ trách:", departure.guideName || "Chưa phân công"],
    ["Số điện thoại HDV:", departure.guidePhone || "—"],
    ["Email HDV:", departure.guideEmail || "—"],
    ["Tổng số khách:", `${passengers.length} khách (Người lớn: ${totalAdults} | Trẻ em: ${totalChildren} | Em bé: ${totalBabies})`],
    [],
    ["II. DANH SÁCH CHI TIẾT HÀNH KHÁCH"],
    [
      "STT",
      "Mã đơn hàng",
      "Họ và tên hành khách",
      "Giới tính",
      "Ngày sinh",
      "Số điện thoại",
      "Số CCCD / Hộ chiếu",
      "Loại khách",
      "Người đại diện đặt",
      "SĐT người đặt",
      "Trạng thái đơn",
      "Ghi chú"
    ]
  ];

  passengers.forEach((p, idx) => {
    rows.push([
      idx + 1,
      p.bookingCode || "—",
      p.fullName || "—",
      p.gender || "—",
      p.dob || "—",
      p.phone || "—",
      p.identityCard || "—",
      getPassengerTypeName(p.passengerType),
      p.bookerName || "—",
      p.bookerPhone || "—",
      getStatusName(p.bookingStatus),
      p.note || ""
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 6 },   // STT
    { wch: 15 },  // Mã đơn
    { wch: 26 },  // Họ tên
    { wch: 12 },  // Giới tính
    { wch: 14 },  // Ngày sinh
    { wch: 16 },  // SĐT
    { wch: 22 },  // CCCD
    { wch: 15 },  // Loại khách
    { wch: 24 },  // Người đặt
    { wch: 16 },  // SĐT người đặt
    { wch: 16 },  // Trạng thái
    { wch: 25 }   // Ghi chú
  ];

  XLSX.utils.book_append_sheet(wb, ws, "DanhSachHanhKhach");

  const tourTitleClean = (departure.tourTitle || "Tour")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 25);
  const dateClean = departure.startTime ? departure.startTime.split("T")[0] : "Ngay";
  const fileName = `Danh_Sach_Khach_${tourTitleClean}_${dateClean}.xlsx`;

  XLSX.writeFile(wb, fileName);
};
