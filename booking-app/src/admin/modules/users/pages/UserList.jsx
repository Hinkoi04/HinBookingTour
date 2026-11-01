import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Lock } from "lucide-react";
import { CustomerTable } from "../components/UserTable";
import { EmployeeTable } from "../components/AccountTable";
import { TrashTable } from "../components/TrashTable";
import { UserDetailModal } from "../components/UserDetailModal";
import { CustomerEditModal } from "../components/CustomerEditModal";
import { EmployeeFormModal } from "../components/EmployeeFormModal";
import { accountService } from "../services/accountService";
import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import Pagination from "../../../components/Pagination";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";
import { usePermission } from "../../../hooks/usePermission";

import ConfirmModal from "../../../components/ConfirmModal";
import AlertModal from "../../../components/AlertModal";

export default function UserManagement({ listMode = "customers" }) {
  const { searchQuery } = useOutletContext();
  const { hasPermission } = usePermission();

  const canManageTrash = hasPermission("ACCOUNT_TRASH");

  const [customers, setCustomers] = useState([]);
  const [customerTrashItems, setCustomerTrashItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState(listMode === "employees" ? "employees" : "customers");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
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

  const loadCustomerTrash = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllTrash();
      setCustomerTrashItems(data);
    } catch (error) {
      showAlert("Lỗi", error.message || "Lỗi tải thùng rác khách hàng", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message, variant = "info") => {
    setAlertConfig({ isOpen: true, title, message, variant });
  };

  const handleSaveCustomer = async (payload) => {
    if (!editingCustomer) return;
    try {
      setIsSavingCustomer(true);
      await userService.update(editingCustomer.id, payload);
      setEditingCustomer(null);
      await loadCustomers();
      showAlert("Thành công", "Cập nhật thông tin khách hàng thành công!", "success");
    } catch (error) {
      showAlert("Lỗi", error.message || "Cập nhật khách hàng thất bại", "danger");
    } finally {
      setIsSavingCustomer(false);
    }
  };

  const handleDeleteCustomer = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Chuyển khách hàng vào thùng rác",
      message: "Tài khoản khách hàng sẽ được chuyển vào thùng rác. Bạn có muốn tiếp tục?",
      variant: "danger",
      action: async () => {
        try {
          await userService.softDelete(id);
          await Promise.all([loadCustomers(), loadCustomerTrash()]);
          showAlert("Thành công", "Đã chuyển khách hàng vào thùng rác.", "success");
        } catch (error) {
          showAlert("Lỗi", error.message || "Không thể xóa khách hàng", "danger");
        }
      }
    });
  };

  const handleRestoreCustomer = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Khôi phục khách hàng",
      message: "Khách hàng sẽ được khôi phục về danh sách đang hoạt động.",
      variant: "info",
      action: async () => {
        try {
          await userService.restore(id);
          await Promise.all([loadCustomerTrash(), loadCustomers()]);
          showAlert("Thành công", "Đã khôi phục khách hàng.", "success");
        } catch (error) {
          showAlert("Lỗi", error.message || "Khôi phục khách hàng thất bại", "danger");
        }
      }
    });
  };

  const handleForceDeleteCustomer = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa khách hàng vĩnh viễn",
      message: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa khách hàng?",
      variant: "danger",
      action: async () => {
        try {
          await userService.hardDelete(id);
          await loadCustomerTrash();
          showAlert("Đã xóa", "Đã xóa vĩnh viễn khách hàng.", "success");
        } catch (error) {
          showAlert("Lỗi", error.message || "Xóa vĩnh viễn khách hàng thất bại", "danger");
        }
      }
    });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

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
    if (listMode === "customers") loadCustomers();
  }, [listMode]);

  useEffect(() => {
    if (listMode === "employees") {
      loadEmployees();
      loadRoles();
    }
  }, [listMode]);

  useEffect(() => {
    if (activeTab === "trash") {
      if (listMode === "customers") loadCustomerTrash();
      else loadTrash();
    }
  }, [activeTab, listMode]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchQuery))
  );

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.phone && employee.phone.includes(searchQuery))
  );

  const currentTrashItems = listMode === "customers" ? customerTrashItems : trashItems;
  const filteredTrashItems = currentTrashItems.filter(item =>
    [item.fullName, item.name, item.email, item.phone]
      .some(value => String(value || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentList = activeTab === "trash"
    ? filteredTrashItems
    : listMode === "customers"
      ? filteredCustomers
      : filteredEmployees;

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
      variant: "warning",
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
          showAlert("Đã xóa", "Đã chuyển nhân viên vào thùng rác!", "danger");
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
          showAlert("Đã xóa", "Đã xóa vĩnh viễn nhân viên!", "danger");
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
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="mb-6 inline-flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab(listMode === "employees" ? "employees" : "customers")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab !== "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {listMode === "employees" ? `Nhân viên (${employees.length})` : `Khách hàng (${customers.length})`}
          </button>
          {canManageTrash && (
            <button
              onClick={() => setActiveTab("trash")}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Thùng rác ({listMode === "customers" ? customerTrashItems.length : trashItems.length})
            </button>
          )}
        </div>

        {listMode === "customers" && activeTab === "customers" ? (
          <div className="animate-in fade-in duration-300">
            {loading ? (
              <LoadingSkeleton variant="table" />
            ) : (
              <CustomerTable
                data={paginatedList}
                startIndex={startIndex}
                onView={(user) => viewDetail(user, 'customer')}
                onEdit={setEditingCustomer}
                onToggleLock={handleToggleLock}
                onDelete={handleDeleteCustomer}
              />
            )}
          </div>
        ) : listMode === "employees" && activeTab === "employees" ? (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 flex justify-end">
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
              <LoadingSkeleton variant="table" />
            ) : (
              <EmployeeTable
                data={paginatedList}
                startIndex={startIndex}
                accounts={employees}
                onToggleLock={handleToggleLock}
                onDelete={handleDeleteEmployee}
                onEdit={handleEditEmployee}
              />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {loading ? (
              <LoadingSkeleton variant="table" />
            ) : (
              <TrashTable
                data={paginatedList}
                startIndex={startIndex}
                accounts={employees}
                isCustomer={listMode === "customers"}
                onRestore={listMode === "customers" ? handleRestoreCustomer : handleRestoreEmployee}
                onForceDelete={listMode === "customers" ? handleForceDeleteCustomer : handleForceDeleteEmployee}
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

      <CustomerEditModal
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSubmit={handleSaveCustomer}
        loading={isSavingCustomer}
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