import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Users,
  Calendar,
  MapPin,
  Bus,
  UserCheck,
  Phone,
  Mail,
  Search,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  User,
  Baby,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { departureService } from '../services/departureService';
import { exportDeparturePassengersToExcel } from '../utils/departureExportUtils';
import { toast } from 'sonner';

export function DeparturePassengersModal({ isOpen, onClose, departure, pageMode = false }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchPassengers = async () => {
    if (!departure?.id) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await departureService.getPassengers(departure.id);
      setData(res);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách khách hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && departure?.id) {
      setSearchTerm('');
      setTypeFilter('ALL');
      fetchPassengers();
    } else {
      setData(null);
    }
  }, [isOpen, departure?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleCopy = (text, id) => {
    if (!text || text === '—') return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      const depInfo = data?.departure || departure;
      const passengerList = data?.passengers || [];
      const stats = {
        totalAdults: data?.totalAdults,
        totalChildren: data?.totalChildren,
        totalBabies: data?.totalBabies
      };

      if (passengerList.length === 0) {
        toast.warning('Chuyến đi hiện chưa có hành khách để xuất file!');
      }

      exportDeparturePassengersToExcel(depInfo, passengerList, stats);
      toast.success('Xuất file Excel thành công!');
    } catch (err) {
      toast.error('Lỗi xuất file Excel: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter passengers
  const filteredPassengers = useMemo(() => {
    if (!data?.passengers) return [];
    return data.passengers.filter((p) => {
      // Search
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        (p.fullName && p.fullName.toLowerCase().includes(term)) ||
        (p.phone && p.phone.toLowerCase().includes(term)) ||
        (p.identityCard && p.identityCard.toLowerCase().includes(term)) ||
        (p.bookingCode && p.bookingCode.toLowerCase().includes(term)) ||
        (p.bookerName && p.bookerName.toLowerCase().includes(term));

      // Type filter
      let matchType = true;
      const pType = (p.passengerType || 'adult').toLowerCase();
      if (typeFilter === 'ADULT') matchType = pType === 'adult';
      else if (typeFilter === 'CHILD') matchType = pType === 'child' || pType === 'children';
      else if (typeFilter === 'BABY') matchType = pType === 'baby';

      return matchSearch && matchType;
    });
  }, [data?.passengers, searchTerm, typeFilter]);

  if (!isOpen || !departure) return null;

  const currentDep = data?.departure || departure;

  return (
    <div className={pageMode ? "w-full p-6 lg:p-8" : "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"}>
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200/80 w-full ${pageMode ? "max-w-7xl min-h-[calc(100vh-4rem)] mx-auto" : "max-w-7xl max-h-[94vh] transform transition-all"} flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/15 shadow-inner shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight truncate">
                  Danh sách khách hàng chuyến đi
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 whitespace-nowrap">
                  Mã lịch #{currentDep.id}
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5 truncate max-w-xl" title={currentDep.tourTitle}>
                {currentDep.tourTitle || `Tour #${currentDep.tourId}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all border border-emerald-400/40 disabled:opacity-50 whitespace-nowrap"
              title="Xuất file Excel danh sách khách hàng"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>{isExporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
              <Download className="w-3.5 h-3.5 opacity-80 hidden sm:inline" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
          {/* Trip Summary & Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Card 1: Trip Info */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Thông tin chuyến đi</h3>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Điểm đi:</span>
                  <span className="font-semibold text-gray-800 text-right truncate">{currentDep.departureFrom || '—'}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Khởi hành:</span>
                  <span className="font-semibold text-blue-600 text-right whitespace-nowrap">{formatDate(currentDep.startTime)}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Ngày về:</span>
                  <span className="font-semibold text-blue-600 text-right whitespace-nowrap">{formatDate(currentDep.endDate)}</span>
                </div>
                <div className="flex justify-between items-start gap-2 pt-1 border-t border-dashed border-gray-100">
                  <span className="text-gray-500 font-medium shrink-0">Phương tiện:</span>
                  <span className="font-medium text-gray-700 inline-flex items-center gap-1 text-right truncate">
                    <Bus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {currentDep.vehicleName || 'Tự túc'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Guide Info */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Hướng dẫn viên</h3>
                </div>
                {currentDep.guideName ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                    Đã phân công
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                    Chưa phân công
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Họ tên HDV:</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                    {currentDep.guideName || <span className="text-gray-400 font-normal italic">Chưa có</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-gray-500 font-medium inline-flex items-center gap-1 shrink-0">
                    <Phone className="w-3 h-3 text-gray-400" /> SĐT liên hệ:
                  </span>
                  <span className="font-semibold text-emerald-700 whitespace-nowrap">
                    {currentDep.guidePhone ? (
                      <button
                        onClick={() => handleCopy(currentDep.guidePhone, 'guide_phone')}
                        className="hover:underline inline-flex items-center gap-1 text-emerald-700"
                        title="Click để sao chép"
                      >
                        {currentDep.guidePhone}
                        {copiedId === 'guide_phone' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 opacity-60" />
                        )}
                      </button>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-gray-500 font-medium inline-flex items-center gap-1 shrink-0">
                    <Mail className="w-3 h-3 text-gray-400" /> Email:
                  </span>
                  <span className="text-gray-700 truncate max-w-[160px]" title={currentDep.guideEmail || ''}>
                    {currentDep.guideEmail || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Quick Stats */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Thống kê hành khách</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100/80 text-center">
                  <div className="text-gray-500 text-[11px]">Tổng số khách</div>
                  <div className="text-base sm:text-lg font-extrabold text-blue-700 mt-0.5">
                    {data?.totalPassengers ?? (data?.passengers?.length || 0)}
                  </div>
                </div>
                <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100/80 text-center">
                  <div className="text-gray-500 text-[11px]">Số đơn đặt</div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-700 mt-0.5">
                    {data?.totalBookings ?? 0}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-600 pt-1 border-t border-dashed border-gray-100">
                <span>Người lớn: <strong className="text-gray-900">{data?.totalAdults ?? 0}</strong></span>
                <span>Trẻ em: <strong className="text-gray-900">{data?.totalChildren ?? 0}</strong></span>
                <span>Em bé: <strong className="text-gray-900">{data?.totalBabies ?? 0}</strong></span>
              </div>
            </div>
          </div>

          {/* Search, Filter & Toolbar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên khách, SĐT, CCCD, mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs overflow-x-auto">
                <button
                  onClick={() => setTypeFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    typeFilter === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Tất cả ({data?.passengers?.length || 0})
                </button>
                <button
                  onClick={() => setTypeFilter('ADULT')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    typeFilter === 'ADULT' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Người lớn ({data?.totalAdults ?? 0})
                </button>
                <button
                  onClick={() => setTypeFilter('CHILD')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    typeFilter === 'CHILD' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Trẻ em ({data?.totalChildren ?? 0})
                </button>
                <button
                  onClick={() => setTypeFilter('BABY')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    typeFilter === 'BABY' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Em bé ({data?.totalBabies ?? 0})
                </button>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác nhận đơn
              </span>

              <button
                onClick={fetchPassengers}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors shrink-0"
                title="Làm mới danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Passenger Table Container */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 text-sm font-medium">Đang tải danh sách hành khách...</p>
              </div>
            ) : error ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={fetchPassengers}
                  className="mt-2 px-4 py-1.5 bg-blue-50 text-blue-700 font-medium rounded-lg text-xs hover:bg-blue-100"
                >
                  Thử lại
                </button>
              </div>
            ) : filteredPassengers.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  {searchTerm || typeFilter !== 'ALL'
                    ? 'Không tìm thấy hành khách phù hợp với bộ lọc'
                    : 'Chuyến đi này hiện chưa có khách hàng nào đặt chỗ'}
                </div>
                {(searchTerm || typeFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('ALL');
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-gray-50/90 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                      <th className="py-3.5 px-3 text-center w-14 whitespace-nowrap">STT</th>
                      <th className="py-3.5 px-4 w-36 whitespace-nowrap">Mã đơn</th>
                      <th className="py-3.5 px-4 w-52 whitespace-nowrap">Họ và tên khách</th>
                      <th className="py-3.5 px-4 w-40 whitespace-nowrap">Số điện thoại</th>
                      <th className="py-3.5 px-4 w-48 whitespace-nowrap">Số CCCD / Hộ chiếu</th>
                      <th className="py-3.5 px-4 w-32 whitespace-nowrap">Giới tính</th>
                      <th className="py-3.5 px-4 w-32 whitespace-nowrap">Loại khách</th>
                      <th className="py-3.5 px-4 w-48 whitespace-nowrap">Người đặt tour</th>
                      <th className="py-3.5 px-4 w-36 whitespace-nowrap">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredPassengers.map((p, index) => {
                      const pType = (p.passengerType || 'adult').toLowerCase();
                      const isAdult = pType === 'adult';
                      const isChild = pType === 'child' || pType === 'children';
                      const isBaby = pType === 'baby';

                      return (
                        <tr key={p.id ? `p-${p.id}` : `b-${p.bookingId}-${index}`} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-3 text-center text-gray-500 font-semibold whitespace-nowrap">
                            {index + 1}
                          </td>

                          {/* Booking Code - Always on one line */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/80 whitespace-nowrap">
                              {p.bookingCode || `#${p.bookingId}`}
                            </span>
                          </td>

                          {/* Customer Name */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isAdult ? 'bg-blue-100 text-blue-700' : isChild ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {(p.fullName || 'K').charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-900" title={p.fullName}>
                                {p.fullName || 'Chưa cập nhật'}
                              </span>
                            </div>
                          </td>

                          {/* Phone - Always on one line */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {p.phone ? (
                              <button
                                onClick={() => handleCopy(p.phone, `phone-${index}`)}
                                className="inline-flex items-center gap-1.5 font-medium text-gray-800 hover:text-blue-600 group whitespace-nowrap"
                                title="Sao chép SĐT"
                              >
                                <Phone className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 shrink-0" />
                                <span>{p.phone}</span>
                                {copiedId === `phone-${index}` ? (
                                  <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                )}
                              </button>
                            ) : (
                              <span className="text-gray-400 italic">—</span>
                            )}
                          </td>

                          {/* CCCD / Identity Card - Always on one line */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {p.identityCard ? (
                              <button
                                onClick={() => handleCopy(p.identityCard, `cccd-${index}`)}
                                className="inline-flex items-center gap-1.5 font-mono font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 group whitespace-nowrap"
                                title="Sao chép CCCD"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{p.identityCard}</span>
                                {copiedId === `cccd-${index}` ? (
                                  <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                )}
                              </button>
                            ) : (
                              <span className="text-gray-400 italic">Chưa có CCCD</span>
                            )}
                          </td>

                          {/* Gender & DOB */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
                            <span className="font-medium">{p.gender || '—'}</span>
                            {p.dob && <span className="text-[11px] text-gray-400 block">{p.dob}</span>}
                          </td>

                          {/* Passenger Type - Always on one line */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
                              isAdult
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : isChild
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {isAdult ? 'Người lớn' : isChild ? 'Trẻ em' : isBaby ? 'Em bé' : 'Người lớn'}
                            </span>
                          </td>

                          {/* Booker Info */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-medium text-gray-800" title={p.bookerName}>
                              {p.bookerName || '—'}
                            </div>
                            {p.bookerPhone && p.bookerPhone !== p.phone && (
                              <div className="text-[11px] text-gray-400">SĐT: {p.bookerPhone}</div>
                            )}
                          </td>

                          {/* Status - Always on one line */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              p.bookingStatus === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : p.bookingStatus === 'completed'
                                ? 'bg-blue-100 text-blue-700'
                                : p.bookingStatus === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {p.bookingStatus === 'confirmed'
                                ? 'Đã xác nhận'
                                : p.bookingStatus === 'completed'
                                ? 'Hoàn thành'
                                : p.bookingStatus === 'cancelled'
                                ? 'Đã hủy'
                                : 'Chờ xác nhận'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 shrink-0">
          <div>
            Hiển thị <strong className="text-gray-900">{filteredPassengers.length}</strong> /{' '}
            <strong className="text-gray-900">{data?.passengers?.length || 0}</strong> hành khách trong chuyến
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              disabled={isExporting || (data?.passengers?.length || 0) === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Xuất file Excel</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-lg hover:bg-black transition-colors whitespace-nowrap"
            >
              {pageMode ? "Quay lại lịch khởi hành" : "Đóng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeparturePassengersModal;
