import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Lock, Loader2 } from "lucide-react"; 

import { roleService, permissionService } from "../services/roleService";
import PermissionMatrix from "../components/PermissionMatrix";
import { RoleTable } from "../components/RoleTable"; 
import { RoleDetailModal } from "../components/RoleDetailModal";

import ConfirmModal from "../../../components/ConfirmModal";
import AlertModal from "../../../components/AlertModal";

const RolePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("roles"); 
  const [searchTerm, setSearchTerm] = useState("");
  
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", variant: "info", action: null });
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", variant: "info" });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  
  const executeConfirmAction = async () => {
    if (confirmConfig.action) {
      await confirmConfig.action();
    }
    closeConfirm();
  };

  const showAlert = (title, message, variant = "info") => {
    setAlertConfig({ isOpen: true, title, message, variant });
  };
  
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const { isAdmin, canManagePermissions, canCreateRole } = useMemo(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return { isAdmin: false, canManagePermissions: false, canCreateRole: false };
      
      const user = JSON.parse(userString);
      const isSuperAdmin = user.role && String(user.role).toUpperCase() === "ADMIN";
      
      const permissions = user.permissions || []; 

      return {
        isAdmin: isSuperAdmin,
        canManagePermissions: isSuperAdmin || permissions.includes("UPDATE_ROLE"), 
        canCreateRole: isSuperAdmin || permissions.includes("CREATE_ROLE"),      
      };
    } catch (e) {
      return { isAdmin: false, canManagePermissions: false, canCreateRole: false };
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getAll(),
        canManagePermissions ? permissionService.getAll() : Promise.resolve([])
      ]);
      setRoles(rolesRes);
      setAllPermissions(permsRes);
      
      const permMap = {};
      rolesRes.forEach(r => {
        permMap[r.id] = (r.permissions || []).map(p => p.id);
      });
      setRolePermissions(permMap);
    } catch (error) {
      showAlert("Lỗi", "Lỗi khi tải dữ liệu. Vui lòng thử lại!", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [canManagePermissions]);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenNew = () => navigate("/admin/roles/new");
  const handleOpenEdit = (id) => navigate(`/admin/roles/edit/${id}`);
  const handleOpenDetail = (role) => {
    setSelectedRoleForDetail(role);
    setIsDetailOpen(true);
  };

  const handleToggleLock = (role) => {
    if (!canManagePermissions) return showAlert("Cảnh báo", "Bạn không có quyền thực hiện thao tác này!", "warning");

    const isCurrentlyLocked = role.deleted === 1; 
    const actionText = isCurrentlyLocked ? "mở khóa" : "khóa";
    
    setConfirmConfig({
      isOpen: true,
      title: `Xác nhận ${actionText}`,
      message: `Bạn có chắc chắn muốn ${actionText} vai trò "${role.name}"?`,
      variant: isCurrentlyLocked ? "info" : "danger",
      action: async () => {
        try {
          if (isCurrentlyLocked) {
            await roleService.unlock(role.id);
          } else {
            await roleService.lock(role.id);
          }
          showAlert("Thành công", `Đã ${actionText} vai trò "${role.name}" thành công!`, "success");
          loadData(); 
        } catch (error) {
          showAlert("Lỗi", error.response?.data?.message || `Lỗi khi ${actionText} vai trò`, "danger");
        }
      }
    });
  };

  const handleSavePermissions = async (roleId, selectedPermIds) => {
    setIsLoading(true);
    try {
      await roleService.updatePermissions(roleId, selectedPermIds);
      showAlert("Thành công", "Cập nhật phân quyền thành công!", "success");
      loadData();
    } catch (error) {
      showAlert("Lỗi", "Lỗi khi lưu phân quyền", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân quyền Hệ thống</h1>
        </div>
        
        <button
          onClick={handleOpenNew}
          disabled={!canCreateRole}
          title={!canCreateRole ? "Bạn không có quyền thêm vai trò mới" : ""}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors ${
            canCreateRole 
              ? "bg-black text-white hover:bg-gray-600" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {!canCreateRole ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          Thêm vai trò
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button 
            onClick={() => setActiveTab("roles")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
                activeTab === "roles" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>Vai trò ({roles.length})</button>
            <button 
            onClick={() => canManagePermissions && setActiveTab("permissions")} 
            disabled={!canManagePermissions}
            title={!canManagePermissions ? "Cần quyền Cập nhật vai trò để chỉnh sửa phân quyền" : ""}
            className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              !canManagePermissions 
                ? "opacity-50 cursor-not-allowed text-gray-400" 
                : activeTab === "permissions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!canManagePermissions && <Lock className="w-3.5 h-3.5" />}
            Phân quyền
          </button>
        </div>
        {activeTab === "roles" && (
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm vai trò (ID, Tên)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 text-sm transition-colors"
            />
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <span className="text-sm font-medium text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : activeTab === "roles" ? (
          <RoleTable 
            roles={filteredRoles} 
            onView={handleOpenDetail}
            onEdit={handleOpenEdit} 
            onToggleLock={handleToggleLock}
          />
        ) : (
          <PermissionMatrix 
            roles={roles} 
            allPermissions={allPermissions} 
            rolePermissions={rolePermissions}
            onSave={handleSavePermissions}
            isLoading={isLoading}
          />
        )}
      </div>

      <RoleDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        role={selectedRoleForDetail}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        onCancel={closeConfirm}
        onConfirm={executeConfirmAction}
      />

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={closeAlert}
      />
    </div>
  );
};

export default RolePage;