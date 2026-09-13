import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import { blogService } from "../services/blogService";
import ConfirmModal from "../../../components/ConfirmModal"; 

export default function BlogForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    status: "published",
  });

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const blog = await blogService.getById(id);
        setFormData({
          title:       blog.title || "",
          description: blog.description || "",
          content:     blog.content || "",
          thumbnail:   blog.thumbnail || "",
          status:      blog.status || "published",
        });
      } catch (err) {
        alert("Không tìm thấy bài viết: " + err.message);
        navigate("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, isEdit, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Ảnh không được vượt quá 5MB"); return; }
    
    setThumbnailFile(file);
    setFormData(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) { alert("Vui lòng nhập tiêu đề"); return; }
    if (!formData.content) { alert("Vui lòng nhập nội dung"); return; }

    try {
      setSubmitting(true);
      
      const payload = {
        title:       formData.title,
        description: formData.description,
        content:     formData.content,
        status:      formData.status,
        thumbnail:   thumbnailFile ? null : formData.thumbnail, 
      };

      if (isEdit) {
        await blogService.update(id, payload, thumbnailFile);
        setSuccessModal({ open: true, message: "Cập nhật bài viết thành công!" });
      } else {
        await blogService.create(payload, thumbnailFile);
        setSuccessModal({ open: true, message: "Thêm bài viết mới thành công!" });
      }
          } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <button
        type="button"
        onClick={() => setShowCancelConfirm(true)} 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Nội dung bài viết</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tiêu đề bài viết"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Mô tả ngắn hiển thị ngoài danh sách..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <div className="prose max-w-none border border-gray-200 rounded-xl overflow-hidden">
                    <Editor
                      apiKey='k5ysd87u5tqf2yutdbl7n3fcwvyjhwfuc32p5kzi50tytfb8'
                      value={formData.content || ''} 
                      init={{
                        height: 300, 
                        menubar: false,
                        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                      onEditorChange={(content) => setFormData({ ...formData, content: content })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Ảnh bìa</h2>
              </div>
              <div className="p-6">
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                  {formData.thumbnail ? (
                    <div className="relative">
                      <img src={formData.thumbnail} alt="Preview" className="w-full h-48 object-cover" />
                      {thumbnailFile && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="text-xs text-white truncate">{thumbnailFile.name}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => { setThumbnailFile(null); setFormData(prev => ({ ...prev, thumbnail: "" })); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                      <Upload className="w-6 h-6 text-blue-500 mb-2" />
                      <p className="text-sm font-semibold text-gray-700">Nhấn để chọn ảnh</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG · Tối đa 5MB</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                    </label>
                  )}
                </div>
                {formData.thumbnail && (
                  <label className="w-full mt-3 inline-flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" /> Đổi ảnh bìa
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                )}
              </div>
            </div>

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
                  <option value="published">Hoạt động</option>
                  <option value="draft">Khóa</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {submitting ? "Đang lưu..." : isEdit ? "Cập nhật bài viết" : "Đăng bài viết"}
              </button>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)} 
                disabled={submitting}
                className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmModal
        isOpen={showCancelConfirm}
        onConfirm={() => navigate("/admin/blogs")}
        onCancel={() => setShowCancelConfirm(false)}
        title="Xác nhận hủy"
        message="Bạn có chắc chắn muốn thoát? Các thay đổi chưa lưu sẽ bị mất."
        confirmText="Đồng ý thoát"
        cancelText="Ở lại"
        variant="warning"
      />

      <ConfirmModal
        isOpen={successModal.open}
        onConfirm={() => navigate("/admin/blogs")} 
        title="Thành công!"
        message={successModal.message}
        confirmText="Đóng"
        variant="info"
        hideCancel={true}
      />
    </div>
  );
}