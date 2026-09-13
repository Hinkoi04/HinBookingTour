import { X, Map, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getSchedulesByTourId } from "../services/scheduleService"; 

export function TourDetailModal({ isOpen, onClose, selectedTour, getAccountName }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedTour?.id) {
      setLoading(true);
      getSchedulesByTourId(selectedTour.id)
        .then((res) => {
          const data = Array.isArray(res) ? res : res.data || [];
          setSchedules(data);
        })
        .catch((err) => {
          console.error("Lỗi khi tải lộ trình:", err);
          setSchedules([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSchedules([]);
    }
  }, [isOpen, selectedTour]);

  if (!isOpen || !selectedTour) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết Tour</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <img
              src={selectedTour.thumbnail || selectedTour.image}
              alt={selectedTour.title || selectedTour.name}
              className="w-full h-72 object-cover rounded-xl shadow-sm border border-gray-100"
            />
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tên Tour</p>
                <p className="font-semibold text-gray-900 text-lg">{selectedTour.title || selectedTour.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Thời gian</p>
                <p className="font-medium text-gray-900">{selectedTour.time || selectedTour.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTour.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedTour.status === "active" ? "Hoạt động" : "Tạm dừng"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900 text-lg">Lộ trình chi tiết</h3>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-6 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-blue-500" />
                <span>Đang tải lộ trình...</span>
              </div>
            ) : schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.map((schedule, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                    <div className="bg-blue-50/50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-blue-800">
                        Ngày {schedule.dayNumber}: {schedule.title}
                      </span>
                      {schedule.status === 'inactive' && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Đã ẩn</span>
                      )}
                    </div>
                    <div 
                      className="p-5 text-sm text-gray-700 prose max-w-none prose-sm prose-blue"
                      dangerouslySetInnerHTML={{ __html: schedule.content }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 italic border border-dashed border-gray-200">
                Tour này chưa có thông tin lộ trình chi tiết.
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Thông tin hệ thống</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Ngày tạo</p>
                <p className="font-medium text-gray-900">{formatDate(selectedTour.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Người tạo</p>
                <p className="font-medium text-gray-900">
                  {selectedTour.createdBy ? (getAccountName ? getAccountName(selectedTour.createdBy) : `Account #${selectedTour.createdBy}`) : "Hệ thống"}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-200/60">
                <p className="text-gray-500 mb-1">Lần cập nhật cuối</p>
                <p className="font-medium text-gray-900">{formatDate(selectedTour.updatedAt)}</p>
              </div>
              <div className="pt-2 border-t border-gray-200/60">
                <p className="text-gray-500 mb-1">Người cập nhật</p>
                <p className="font-medium text-gray-900">
                  {selectedTour.updatedBy ? (getAccountName ? getAccountName(selectedTour.updatedBy) : `Account #${selectedTour.updatedBy}`) : "Chưa có lượt cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}