import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TourItinerary } from "../components/TourItinerary";
import { TourImageUpload } from "../components/TourImageUpload";
import { tourService } from "../services/tourService";
import { saveSchedules, getSchedulesByTourId } from "../services/scheduleService";

import AlertModal from "../../../components/AlertModal"; 

export default function TourForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "", category: "", duration: "",
    description: "", image: "", status: "active",
  });

  const [itinerary, setItinerary] = useState([
    { dayNumber: 1, title: "", content: "", status: "active" }
  ]);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
    onCloseAction: null 
  });

  const showAlert = (title, message, variant = "info", onCloseAction = null) => {
    setAlertConfig({ isOpen: true, title, message, variant, onCloseAction });
  };

  const handleCloseAlert = () => {
    if (alertConfig.onCloseAction) {
      alertConfig.onCloseAction(); 
    }
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [galleryPreviews]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await tourService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const fetchTour = async () => {
      try {
        setLoading(true);
        const tour = await tourService.getById(id);
        setFormData({
          name:        tour.name || "",
          category:    tour.categoryId ? String(tour.categoryId) : "",
          duration:    tour.duration || "",
          description: tour.description || "",
          image:       tour.image || "",
          status:      tour.status || "active",
        });
        if (Array.isArray(tour.images) && tour.images.length > 0) {
          setGalleryPreviews(tour.images);
        }
        try {
          const scheduleData = await getSchedulesByTourId(id);
          const validSchedules = Array.isArray(scheduleData)
            ? scheduleData
            : (scheduleData.data || []);
          if (validSchedules.length > 0) setItinerary(validSchedules);
        } catch (scheduleErr) {
          console.log(scheduleErr);
        }
      } catch (err) {
        showAlert("Lỗi", "Không tìm thấy tour: " + err.message, "danger", () => navigate("/admin/tours"));
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id, isEdit, navigate]);

  const handleThumbnailChange = (file, previewUrl) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        showAlert("Lỗi định dạng", "Vui lòng chọn file ảnh (PNG, JPG, WEBP...)", "warning");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showAlert("Dung lượng quá lớn", "Ảnh không được vượt quá 5MB", "warning");
        return;
      }
      setImageFile(file);
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    } else {
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleThumbnailRemove = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        showAlert("Lỗi định dạng", `File ${file.name} không phải là ảnh!`, "warning");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showAlert("Dung lượng quá lớn", `Ảnh ${file.name} vượt quá 5MB`, "warning");
        return false;
      }
      return true;
    });

    if (galleryPreviews.length + validFiles.length > 5) {
      showAlert("Vượt quá giới hạn", "Bạn chỉ có thể tải lên tối đa 5 ảnh phụ!", "warning");
      return;
    }

    setGalleryFiles(prev => [...prev, ...validFiles].slice(0, 5));
    setGalleryPreviews(prev =>
      [...prev, ...validFiles.map(f => URL.createObjectURL(f))].slice(0, 5)
    );
  };

  const handleGalleryRemove = (index) => {
    const removedUrl = galleryPreviews[index];

    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    if (removedUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(removedUrl);

      const blobPreviews = galleryPreviews.filter(u => u.startsWith("blob:"));
      const blobIndex = blobPreviews.indexOf(removedUrl);
      if (blobIndex !== -1) {
        setGalleryFiles(prev => prev.filter((_, i) => i !== blobIndex));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      showAlert("Thiếu thông tin", "Vui lòng điền đầy đủ thông tin bắt buộc (*)", "warning");
      return;
    }
    if (!isEdit && !imageFile && !formData.image) {
      showAlert("Thiếu hình ảnh", "Vui lòng chọn ảnh cho tour", "warning");
      return;
    }
    const existingImageUrls = galleryPreviews.filter(url => !url.startsWith("blob:"));
    const payload = {
      title:       formData.name,
      time:        formData.duration,
      categoryId:  Number(formData.category),
      description: formData.description,
      status:      formData.status,
      thumbnail:   imageFile ? null : formData.image,
      existingImages: existingImageUrls,
    };

    try {
      setSubmitting(true);
      if (isEdit) {
        await tourService.update(id, payload, imageFile, galleryFiles);
        await saveSchedules(id, itinerary);
        showAlert("Thành công", "Cập nhật tour và lộ trình thành công!", "success", () => navigate("/admin/tours"));
      } else {
        const res = await tourService.create(payload, imageFile, galleryFiles);
        const newTourId = res.id || res.data?.id;
        if (newTourId) await saveSchedules(newTourId, itinerary);
        showAlert("Thành công", "Thêm tour mới thành công!", "success", () => navigate("/admin/tours"));
      }
    } catch (err) {
      showAlert("Lỗi xử lý", "Lỗi: " + err.message, "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const addItineraryDay = () =>
    setItinerary(prev => [...prev, { dayNumber: prev.length + 1, title: "", content: "", status: "active" }]);

  const removeItineraryDay = (indexToRemove) =>
    setItinerary(prev =>
      prev.filter((_, i) => i !== indexToRemove).map((item, i) => ({ ...item, dayNumber: i + 1 }))
    );

  const updateItinerary = (index, field, value) =>
    setItinerary(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Đang tải dữ liệu tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6"
        onClick={() => navigate("/admin/tours")}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Chỉnh sửa Tour" : "Thêm Tour mới"}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? "Cập nhật thông tin chi tiết của tour" : "Điền thông tin để tạo tour du lịch mới"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Tour <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    >
                      <option value="" disabled>Chọn danh mục...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title || cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Ví dụ: 3 Ngày 2 Đêm"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <TourItinerary
              itinerary={itinerary}
              onAddDay={addItineraryDay}
              onRemoveDay={removeItineraryDay}
              onUpdateDay={updateItinerary}
            />
          </div>
          <div className="space-y-8">
            <TourImageUpload
              thumbnail={formData.image}
              imageFile={imageFile}
              onThumbnailChange={handleThumbnailChange}
              onThumbnailRemove={handleThumbnailRemove}
              galleryFiles={galleryFiles}
              galleryPreviews={galleryPreviews}
              onGalleryChange={handleGalleryChange}
              onGalleryRemove={handleGalleryRemove}
            />

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Trạng thái</h2>
              </div>
              <div className="p-6">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none font-medium"
                >
                  <option value="active">🟢 Hoạt động</option>
                  <option value="inactive">⚪ Tạm dừng</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {submitting ? "Đang lưu..." : isEdit ? "Cập nhật Tour" : "Đăng Tour mới"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/tours")}
                disabled={submitting}
                className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </form>

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={handleCloseAlert}
      />
    </div>
  );
}