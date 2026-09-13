import { X, Search, UserCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { departureService } from "../services/departureService";
import AlertModal from "../../../components/AlertModal";

export function DepartureModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit, editDepartureId, tourList = [], vehicles = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const dropdownRef = useRef(null);

  const [alertMessage, setAlertMessage] = useState("");

  const getTourTitle = (tour) => {
    if (!tour) return "";
    return tour.title || tour.name || tour.tourName || "";
  };

  const calculateEndDate = (startDateString, tourTimeString) => {
    if (!startDateString || !tourTimeString) return "";
    const match = tourTimeString.match(/(\d+)\s*(n|ng[aà]y)/i);
    let days = 1;
    if (match) days = Math.max(parseInt(match[1], 10), 1);
    
    const startDate = new Date(startDateString);
    if (isNaN(startDate.getTime())) return "";
    
    startDate.setDate(startDate.getDate() + (days - 1));
    startDate.setHours(23, 59, 0, 0);
    const tzoffset = startDate.getTimezoneOffset() * 60000;
    return new Date(startDate.getTime() - tzoffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (formData.startTime && formData.tourId && tourList.length > 0) {
      const selectedTour = tourList.find(t => String(t.id) === String(formData.tourId));
      if (selectedTour && selectedTour.duration) {
        const autoEndDate = calculateEndDate(formData.startTime, selectedTour.duration);
        if (autoEndDate && formData.endDate !== autoEndDate) {
          setFormData(prev => ({ ...prev, endDate: autoEndDate }));
        }
      }
    }
  }, [formData.startTime, formData.tourId, tourList]);

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoadingGuides(true);
      try {
        const guides = await departureService.getAvailableGuides(
          formData.startTime || null, 
          formData.endDate || null, 
          editDepartureId || null
        );
        setAvailableGuides(guides || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách HDV:", error);
      } finally {
        setIsLoadingGuides(false);
      }
    };

    if (isOpen) {
      fetchGuides();
    }
  }, [formData.startTime, formData.endDate, editDepartureId, isOpen]);

  useEffect(() => {
    if (formData.tourId && tourList.length > 0) {
      const selectedTour = tourList.find(t => t.id === formData.tourId);
      if (selectedTour) setSearchTerm(getTourTitle(selectedTour));
    } else {
      setSearchTerm("");
    }
  }, [formData.tourId, tourList, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTour = (tour) => {
    let newEndDate = formData.endDate;
    if (formData.startTime && tour && tour.duration) {
      newEndDate = calculateEndDate(formData.startTime, tour.duration);
    }
    setFormData({ ...formData, tourId: tour.id, endDate: newEndDate });
    setSearchTerm(getTourTitle(tour));
    setIsDropdownOpen(false);
  };

  const filteredTours = tourList.filter(t => {
    const safeTitle = getTourTitle(t);
    const safeSearch = searchTerm || "";
    return safeTitle.toLowerCase().includes(safeSearch.toLowerCase());
  });

  const handleLocalSubmit = () => {
    if (!formData.tourId) { setAlertMessage("Vui lòng chọn một Tour từ danh sách!"); return; }
    if (!formData.departureFrom) { setAlertMessage("Vui lòng nhập điểm khởi hành!"); return; }
    if (!formData.startTime) { setAlertMessage("Vui lòng chọn ngày khởi hành!"); return; }

    const pAdult = parseFloat(formData.priceAdult || 0);
    const pChild = parseFloat(formData.priceChildren || 0);
    const pBaby = parseFloat(formData.priceBaby || 0);
    const sAdult = parseInt(formData.stockAdult || 0);
    const sChild = parseInt(formData.stockChildren || 0);
    const sBaby = parseInt(formData.stockBaby || 0);
    const disc = parseInt(formData.discount || 0);

    if (pAdult < 0 || pChild < 0 || pBaby < 0) { setAlertMessage("⚠️ Giá vé không được là số âm!"); return; }
    if (sAdult < 0 || sChild < 0 || sBaby < 0) { setAlertMessage("⚠️ Số lượng chỗ không được là số âm!"); return; }
    if (disc < 0 || disc > 100) { setAlertMessage("⚠️ Khuyến mãi phải từ 0 đến 100%!"); return; }
    if (pChild > 0 && pAdult <= pChild) { setAlertMessage("⚠️ Giá vé NGƯỜI LỚN phải LỚN HƠN giá vé TRẺ EM!"); return; }
    if (pBaby > 0 && pChild <= pBaby) { setAlertMessage("⚠️ Giá vé TRẺ EM phải LỚN HƠN giá vé EM BÉ!"); return; }

    onSubmit();
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Chỉnh sửa lịch khởi hành" : "Thêm lịch khởi hành mới"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Hệ thống sẽ tự động tìm HDV rảnh dựa trên thời gian đi</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-700">Tên Tour <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  setIsDropdownOpen(true);
                  const exactMatch = tourList.find(t => getTourTitle(t).toLowerCase() === val.toLowerCase());
                  if (exactMatch) {
                    let newEndDate = formData.endDate;
                    if (formData.startTime && exactMatch.duration) {
                      newEndDate = calculateEndDate(formData.startTime, exactMatch.duration);
                    }
                    setFormData({ ...formData, tourId: exactMatch.id, endDate: newEndDate, guideId: "" });
                  } else {
                    if (formData.tourId !== "") {
                      setFormData({ ...formData, tourId: "", endDate: "", guideId: "" });
                    }
                  }
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Gõ tên để tìm kiếm Tour..."
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            {!formData.tourId && searchTerm && (
              <p className="text-xs text-red-500 font-medium animate-pulse mt-1">⚠️ Vui lòng nhấp chọn một Tour từ danh sách bên dưới!</p>
            )}
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg max-h-48 overflow-y-auto">
                {filteredTours.length > 0 ? (
                  filteredTours.map((tour, index) => (
                    <li 
                      key={tour.id || index} 
                      onMouseDown={(e) => { e.preventDefault(); handleSelectTour(tour); }} 
                      className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-0"
                    >
                      <div className="font-bold text-gray-800">{getTourTitle(tour) || "Chưa có tên"}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Thời gian: {tour.duration || "Chưa rõ"}</div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-gray-500 text-center">Không tìm thấy Tour nào!</li>
                )}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Điểm khởi hành <span className="text-red-500">*</span></label>
              <input type="text" value={formData.departureFrom || ""} onChange={(e) => setFormData({ ...formData, departureFrom: e.target.value })} placeholder="VD: TP. Hồ Chí Minh" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngày đi <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={formData.startTime || ""} onChange={(e) => {
                setFormData(prev => ({ ...prev, startTime: e.target.value }));
              }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngày về (Tự động)</label>
              <input type="datetime-local" value={formData.endDate || ""} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phương tiện</label>
              <select value={formData.vehicleId || ""} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value ? parseInt(e.target.value) : null })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" >
                <option value="">-- Tự túc --</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.vehicleType})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                Hướng dẫn viên {isLoadingGuides && <span className="text-xs text-blue-500 animate-pulse">(Đang tìm...)</span>}
              </label>
              <div className="relative">
                <select 
                  value={formData.guideId || ""} 
                  onChange={(e) => setFormData({ ...formData, guideId: e.target.value ? parseInt(e.target.value) : null })} 
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">-- Chưa xếp HDV --</option>
                  {availableGuides.map(g => (
                    <option key={g.id} value={g.id} disabled={!g.available}>
                      {g.fullName} {g.available ? "" : "- (Đang kẹt tour khác)"}
                    </option>
                  ))}
                </select>
                <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <select value={formData.status || "active"} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" >
                <option value="active">Mở bán (OPEN)</option>
                <option value="inactive">Đóng (CLOSED)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Khuyến mãi (%)</label>
              <input type="number" min="0" max="100" placeholder="VD: 10" value={formData.discount || 0} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Người lớn</label>
              <input type="number" min="0" placeholder="Giá vé (VNĐ)" value={formData.priceAdult} onChange={(e) => setFormData({ ...formData, priceAdult: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
              <input type="number" min="0" step="1" placeholder="Số chỗ" value={formData.stockAdult} onChange={(e) => setFormData({ ...formData, stockAdult: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Trẻ em</label>
              <input type="number" min="0" placeholder="Giá vé (VNĐ)" value={formData.priceChildren} onChange={(e) => setFormData({ ...formData, priceChildren: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
              <input type="number" min="0" step="1" placeholder="Số chỗ" value={formData.stockChildren} onChange={(e) => setFormData({ ...formData, stockChildren: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Em bé</label>
              <input type="number" min="0" placeholder="Giá vé (VNĐ)" value={formData.priceBaby} onChange={(e) => setFormData({ ...formData, priceBaby: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
              <input type="number" min="0" step="1" placeholder="Số chỗ" value={formData.stockBaby} onChange={(e) => setFormData({ ...formData, stockBaby: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
          <button onClick={handleLocalSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>

      </div>
    </div>
    <AlertModal 
        isOpen={!!alertMessage} 
        message={alertMessage} 
        onClose={() => setAlertMessage("")} 
      />
    </>
  );
}