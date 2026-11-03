import * as XLSX from 'xlsx';

const buildDepartureRows = (departure, passengers, stats) => {
  if (!departure) throw new Error("Không có thông tin chuyến đi để xuất.");
  const formatDate = (dateString) => dateString
    ? new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    })
    : "—";
  const getPassengerTypeName = (type) => {
    const lower = String(type || "adult").toLowerCase();
    if (lower === "child" || lower === "children") return "Trẻ em";
    if (lower === "baby") return "Em bé";
    return "Người lớn";
  };
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
      "Họ và tên hành khách",
      "Giới tính",
      "Ngày sinh",
      "Số điện thoại",
      "Số CCCD / Hộ chiếu",
      "Loại khách",
      "Người đại diện đặt",
      "Ghi chú"
    ]
  ];

  passengers.forEach((p, idx) => {
    rows.push([
      idx + 1,
      p.fullName || "—",
      p.gender || "—",
      p.dob || "—",
      p.phone || "—",
      p.identityCard || "—",
      getPassengerTypeName(p.passengerType),
      p.bookerName || "—",
      p.note || ""
    ]);
  });

  return rows;
};

const getExportFileBaseName = (departure) => {
  const tourTitleClean = (departure.tourTitle || "Tour")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 25);
  const dateClean = departure.startTime ? departure.startTime.split("T")[0] : "Ngay";
  return `Danh_Sach_Khach_${tourTitleClean}_${dateClean}`;
};

export const exportDeparturePassengersToExcel = (departure, passengers = [], stats = {}) => {
  const rows = buildDepartureRows(departure, passengers, stats);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 6 },   // STT
    { wch: 26 },  // Họ tên
    { wch: 12 },  // Giới tính
    { wch: 14 },  // Ngày sinh
    { wch: 16 },  // SĐT
    { wch: 22 },  // CCCD
    { wch: 15 },  // Loại khách
    { wch: 24 },  // Người đặt
    { wch: 25 }   // Ghi chú
  ];

  XLSX.utils.book_append_sheet(wb, ws, "DanhSachHanhKhach");
  XLSX.writeFile(wb, `${getExportFileBaseName(departure)}.xlsx`);
};

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const buildPrintableDocument = (departure, passengers, stats) => {
  const rows = buildDepartureRows(departure, passengers, stats);
  const [title, exportDate, , tripHeading, ...rest] = rows;
  const passengerHeadingIndex = rest.findIndex((row) =>
    row[0] === "II. DANH SÁCH CHI TIẾT HÀNH KHÁCH"
  );
  const tripRows = rest.slice(0, passengerHeadingIndex);
  const passengerColumns = rest[passengerHeadingIndex + 1] || [];
  const passengerRows = rest.slice(passengerHeadingIndex + 2);
  const infoHtml = tripRows
    .filter((row) => row.length)
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("");
  const columnsHtml = passengerColumns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join("");
  const passengerHtml = passengerRows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");

  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(getExportFileBaseName(departure))}</title>
<style>
body{font-family:Arial,sans-serif;color:#222;font-size:12px;margin:24px}
h1{font-size:18px;text-align:center;margin:0 0 8px}
.date{text-align:center;color:#666;margin-bottom:20px}
h2{font-size:14px;margin:18px 0 8px}
table{width:100%;border-collapse:collapse;margin-bottom:14px}
th,td{border:1px solid #bbb;padding:6px;text-align:left;vertical-align:top}
thead th,.columns th{background:#eee}
.info th{width:190px;background:#f7f7f7}
@media print{body{margin:12mm}table{page-break-inside:auto}tr{page-break-inside:avoid}}
</style></head><body>
<h1>${escapeHtml(title[0])}</h1>
<div class="date">${escapeHtml(exportDate[0])}</div>
<h2>${escapeHtml(tripHeading[0])}</h2><table class="info">${infoHtml}</table>
<h2>II. DANH SÁCH CHI TIẾT HÀNH KHÁCH</h2>
<table><thead class="columns"><tr>${columnsHtml}</tr></thead>
<tbody>${passengerHtml}</tbody></table>
</body></html>`;
};

export const exportDeparturePassengersToWord = (departure, passengers = [], stats = {}) => {
  const documentHtml = buildPrintableDocument(departure, passengers, stats);
  const blob = new Blob(["\ufeff", documentHtml], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getExportFileBaseName(departure)}.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const printDeparturePassengersToPdf = (departure, passengers = [], stats = {}) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("Trình duyệt đã chặn cửa sổ in. Hãy cho phép cửa sổ bật lên rồi thử lại.");

  printWindow.document.open();
  printWindow.onload = () => printWindow.print();
  printWindow.document.write(buildPrintableDocument(departure, passengers, stats));
  printWindow.document.close();
  printWindow.focus();
};
