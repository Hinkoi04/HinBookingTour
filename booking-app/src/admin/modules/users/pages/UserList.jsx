import { useState, useEffect } from "react";
import { Plus, Search, Lock } from "lucide-react";
import { CustomerTable } from "../components/UserTable";
import { EmployeeTable } from "../components/AccountTable";
import { TrashTable } from "../components/TrashTable";
import { UserDetailModal } from "../components/UserDetailModal";
import { EmployeeFormModal } from "../components/EmployeeFormModal";
import { accountService } from "../services/accountService";
import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import Pagination from "../../../components/Pagination";
import { usePermission } from "../../../hooks/usePermission";

import ConfirmModal from "../../../components/ConfirmModal";
import AlertModal from "../../../components/AlertModal";

export default function UserManagement() {
  const { hasPermission } = usePermission();

  const canViewEmployee = hasPermission("VIEW_USER"); 
  const canManageTrash = hasPermission("ACCOUNT_TRASH");

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  
  const defaultEmployeeForm = {
    fullName: "", email: "", phone: "", password: "", jobTitle: "", roleId: null, status: "active"
  };
  const [employeeFormData, setEmployeeFormData] = useState(defaultEmployeeForm);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [customerSearch, employeeSearch, activeTab]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllActive();
      setCustomers(data);
    } catch (error) {
      showAlert("Lỗi", error.message || "Lỗi tải danh sách khách hàng", "danger");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAllActive();
      setEmployees(data);
    } catch (error) {
      showAlert("Lỗi", error.message || "Lỗi tải danh sách nhân viên", "danger");
    } finally {
      setLoading(false);
    }
  };

  const loadTrash = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAllTrash();
      setTrashItems(data);
    } catch (error) {
      showAlert("Lỗi", error.message || "Lỗi tải thùng rác", "danger");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getAll();
      setRoles(data);
      const defaultRole = data.find((r) => r.name.toLowerCase() !== "admin") || data[0];
      if (defaultRole) {
        setEmployeeFormData((prev) => ({ ...prev, roleId: defaultRole.id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (canViewEmployee || true) { 
      loadEmployees();
      loadRoles();
    }
  }, [canViewEmployee]);

  useEffect(() => {
    if (activeTab === "trash") {
      loadTrash();
    }
  }, [activeTab]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.phone && customer.phone.includes(customerSearch))
  );

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    (employee.phone && employee.phone.includes(employeeSearch))
  );

  const currentList = activeTab === "customers" 
    ? filteredCustomers 
    : activeTab === "employees" 
      ? filteredEmployees 
      : trashItems;

  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleLock = (id, userType, currentStatus) => {
    const actionText = currentStatus === "active" ? "khóa" : "mở khóa";
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    setConfirmConfig({
      isOpen: true,
      title: `Xác nhận ${actionText}`,
      message: `Bạn có chắc chắn muốn ${actionText} tài khoản này không?`,
      variant: currentStatus === "active" ? "danger" : "info",
      action: async () => {
        try {
          if (userType === "customer") {
            const user = await userService.getById(id);
            const payload = {
              fullName: user.name,
              email: user.email,
              phone: user.phone || "",
              status: newStatus,
              password: ""
            };
            await userService.update(id, payload);
            loadCustomers();
          } else {
            const account = await accountService.getById(id);
            const payload = {
              fullName: account.fullName,
              email: account.email,
              phone: account.phone || "",
              jobTitle: account.jobTitle || "",
              roleId: account.roleId,
              status: newStatus,
              password: ""
            };
            await accountService.update(id, payload);
            loadEmployees();
          }
          showAlert("Thành công", `Đã ${actionText} tài khoản thành công!`, "success");
        } catch (error) {
          showAlert("Lỗi", error.message || `Lỗi khi ${actionText} tài khoản`, "danger");
        }
      }
    });
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone || "",
      password: "",
      jobTitle: employee.jobTitle || "",
      roleId: employee.roleId,
      status: employee.status || "active"
    });
    setIsEditMode(true);
    setIsEmployeeFormOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!employeeFormData.fullName || !employeeFormData.email) {
      showAlert("Cảnh báo", "Vui lòng điền đầy đủ thông tin bắt buộc", "warning");
      return;
    }
    try {
      const payload = {
        fullName: employeeFormData.fullName,
        email: employeeFormData.email,
        phone: employeeFormData.phone || "",
        jobTitle: employeeFormData.jobTitle || "",
        roleId: Number(employeeFormData.roleId),
        status: employeeFormData.status || "active",
        password: employeeFormData.password || "" 
      };
      await accountService.update(editingEmployee.id, payload);
      showAlert("Thành công", "Cập nhật nhân viên thành công!", "success");
      setIsEmployeeFormOpen(false);
      setIsEditMode(false);
      setEditingEmployee(null);
      setEmployeeFormData(defaultEmployeeForm);
      loadEmployees();
      loadTrash();
    } catch (error) {
      showAlert("Lỗi", error.message || "Cập nhật thất bại", "danger");
    }
  };

  const handleDeleteEmployee = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Chuyển vào thùng rác",
      message: "Bạn có chắc chắn muốn đưa nhân viên này vào thùng rác?",
      variant: "danger",
      action: async () => {
        try {
          await accountService.softDelete(id);
          loadEmployees();
          showAlert("Thành công", "Đã chuyển nhân viên vào thùng rác!", "success");
        } catch (error) {
          showAlert("Lỗi", error.message || "Lỗi xóa nhân viên", "danger");
        }
      }
    });
  };

  const handleRestoreEmployee = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Khôi phục nhân viên",
      message: "Bạn có chắc chắn muốn khôi phục nhân viên này?",
      variant: "info",
      action: async () => {
        try {
          await accountService.restore(id);
          await loadTrash();
          await loadEmployees();
          showAlert("Thành công", "Khôi phục nhân viên thành công!", "success");
        } catch (error) {
          showAlert("Lỗi", error.message || "Khôi phục thất bại", "danger");
        }
      }
    });
  };

  const handleForceDeleteEmployee = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      message: "Bạn có chắc chắn muốn xóa vĩnh viễn nhân viên này? Hành động không thể hoàn tác!",
      variant: "danger",
      action: async () => {
        try {
          await accountService.hardDelete(id);
          await loadTrash();
          showAlert("Thành công", "Đã xóa vĩnh viễn nhân viên!", "success");
        } catch (error) {
          showAlert("Lỗi", error.message || "Xóa vĩnh viễn thất bại", "danger");
        }
      }
    });
  };

  const viewDetail = (user, type) => {
    setSelectedUser({ ...user, role: type });
    setIsDetailOpen(true);
  };

  const handleCreateEmployee = async () => {
    if (!employeeFormData.fullName || !employeeFormData.email || !employeeFormData.password) {
      showAlert("Cảnh báo", "Vui lòng điền đầy đủ các thông tin bắt buộc (*)", "warning");
      return;
    }
    try {
      await accountService.create({
        fullName: employeeFormData.fullName,
        email: employeeFormData.email,
        password: employeeFormData.password,
        phone: employeeFormData.phone,
        jobTitle: employeeFormData.jobTitle,
        roleId: Number(employeeFormData.roleId),
        status: "active"
      });
      showAlert("Thành công", "Đã tạo tài khoản nhân viên thành công!", "success");
      setIsEmployeeFormOpen(false);
      setEmployeeFormData(defaultEmployeeForm);
      loadEmployees();
      loadRoles();
    } catch (error) {
      showAlert("Lỗi", error.message || "Tạo tài khoản thất bại", "danger");
    }
  };

  return (
    <div className="p-8 w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("customers")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "customers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Khách hàng ({customers.length})
          </button>
          
          <button
            onClick={() => setActiveTab("employees")}
            className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "employees"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Nhân viên ({employees.length})
          </button>

          {canManageTrash && (
            <button
              onClick={() => setActiveTab("trash")}
              className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
                activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Thùng rác ({trashItems.length})
            </button>
          )}
        </div>

        {activeTab === "customers" ? (
          <div className="animate-in fade-in duration-300">
            <div className="relative max-w-sm mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên, email hoặc SĐT..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
              />
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải dữ liệu khách hàng...</div>
            ) : (
              <CustomerTable
                data={paginatedList}
                startIndex={startIndex}
                onView={(user) => viewDetail(user, 'customer')}
                onToggleLock={handleToggleLock}
              />
            )}
          </div>
        ) : activeTab === "employees" ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
                />
              </div>
              
              {hasPermission("CREATE_USER") && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setEditingEmployee(null);
                    setEmployeeFormData(defaultEmployeeForm);
                    setIsEmployeeFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Tạo tài khoản nhân viên
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải dữ liệu nhân viên...</div>
            ) : (
              <EmployeeTable
                data={paginatedList}
                startIndex={startIndex}
                accounts={employees}
                onView={(user) => viewDetail(user, 'employee')}
                onToggleLock={handleToggleLock}
                onDelete={handleDeleteEmployee}
                onEdit={handleEditEmployee}
              />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải thùng rác...</div>
            ) : (
              <TrashTable
                data={paginatedList}
                startIndex={startIndex}
                accounts={employees}
                onRestore={handleRestoreEmployee}
                onForceDelete={handleForceDeleteEmployee}
              />
            )}
          </div>
        )}

        {totalPages > 0 && !loading && (
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>

      <UserDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
        accounts={employees}
        onEdit={(user) => {
          if (user.role === "employee") {
            setIsDetailOpen(false);
            handleEditEmployee(user);
          }
        }}
      />

      <EmployeeFormModal
        isOpen={isEmployeeFormOpen}
        onClose={() => {
          setIsEmployeeFormOpen(false);
          setIsEditMode(false);
          setEditingEmployee(null);
          setEmployeeFormData(defaultEmployeeForm);
        }}
        formData={employeeFormData}
        setFormData={setEmployeeFormData}
        onSubmit={isEditMode ? handleUpdateEmployee : handleCreateEmployee}
        roles={roles}
        isEdit={isEditMode}
        loading={false}
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
}