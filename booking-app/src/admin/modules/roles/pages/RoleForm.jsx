import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { roleService } from "../services/roleService";

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoleData();
    }
  }, [id]);

  const loadRoleData = async () => {
    try {
      const data = await roleService.getById(id);
      setFormData({ 
        name: data.name || "", 
        description: data.description || "" 
      });
    } catch (error) {
      toast.error("Không tìm thấy dữ liệu vai trò!");
      navigate("/admin/roles");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Vui lòng nhập tên vai trò");
    
    setIsLoading(true);
    try {
      if (id) {
        await roleService.update(id, formData);
        toast.success("Cập nhật vai trò thành công");
      } else {
        await roleService.create(formData);
        toast.success("Tạo vai trò mới thành công");
      }
      navigate("/admin/roles");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu vai trò");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <button 
        onClick={() => navigate("/admin/roles")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {id ? "Chỉnh sửa Vai trò" : "Thêm Vai trò mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên vai trò <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Quản lý chi nhánh, Nhân viên kinh doanh..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chức năng, nhiệm vụ của vai trò này..."
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate("/admin/roles")}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Đang xử lý..." : "Lưu Vai trò"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;