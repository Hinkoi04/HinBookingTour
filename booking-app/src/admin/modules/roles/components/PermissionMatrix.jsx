import React, { useState, useEffect, useMemo } from "react";
import { Shield, Check, X } from "lucide-react";

const ACTIONS = [
  { key: "create", label: "Tạo", prefix: "CREATE" },
  { key: "edit", label: "Sửa", prefix: "UPDATE" },
  { key: "delete", label: "Xóa", prefix: "DELETE" },
];

const PermissionMatrix = ({ roles, allPermissions, rolePermissions, onSave, isLoading }) => {
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [currentSelectedPerms, setCurrentSelectedPerms] = useState([]);

  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = roles?.find((r) => r.id === selectedRoleId);
  const isAdmin = selectedRole?.name?.toUpperCase() === "ADMIN";

  useEffect(() => {
    if (selectedRoleId) {
      setCurrentSelectedPerms(rolePermissions[selectedRoleId] || []);
    }
  }, [selectedRoleId, rolePermissions]);

  const matrixData = useMemo(() => {
    const modules = {};
    (allPermissions || []).forEach((p) => {
      const groupName = p.permissionGroup || "Khác";
      if (!modules[groupName]) {
        modules[groupName] = { groupName, create: null, edit: null, delete: null, allIds: [], actionIds: [] };
      }
      modules[groupName].allIds.push(p.id);

      const key = p.permissionKey.toUpperCase();
      if (key.includes("CREATE_") || key.includes("ADD_")) {
        modules[groupName].create = p;
        modules[groupName].actionIds.push(p.id);
      } else if (key.includes("UPDATE_") || key.includes("EDIT_")) {
        modules[groupName].edit = p;
        modules[groupName].actionIds.push(p.id);
      } else if (key.includes("DELETE_") || key.includes("REMOVE_")) {
        modules[groupName].delete = p;
        modules[groupName].actionIds.push(p.id);
      }
    });
    return Object.values(modules);
  }, [allPermissions]);

  const togglePermission = (permId) => {
    if (isAdmin) return;
    setCurrentSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const toggleAllInModule = (moduleObj, isAllChecked) => {
    if (isAdmin) return;
    setCurrentSelectedPerms((prev) => {
      let next = [...prev];
      if (isAllChecked) {
        next = next.filter((id) => !moduleObj.actionIds.includes(id));
      } else {
        moduleObj.actionIds.forEach((id) => {
          if (!next.includes(id)) next.push(id);
        });
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      <div className="w-full md:w-56 shrink-0">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-3">Chọn vai trò</p>
          <ul className="space-y-1">
            {roles?.map((role) => (
              <li key={role.id}>
                <button
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    selectedRoleId === role.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Shield className={`w-4 h-4 ${selectedRoleId === role.id ? "text-blue-600" : "text-gray-400"}`} />
                  {role.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">
                Quyền của: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{selectedRole?.name || "..."}</span>
              </span>
            </div>
            <button 
              onClick={() => onSave(selectedRoleId, currentSelectedPerms)} 
              disabled={isLoading || isAdmin || !selectedRoleId}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>

          {isAdmin && (
            <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              Vai trò <strong>Admin</strong> có toàn quyền truy cập hệ thống và không thể sửa đổi tại đây.
            </div>
          )}

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Module (Nhóm quyền)</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-600 w-24">Tất cả</th>
                  {ACTIONS.map((a) => (
                    <th key={a.key} className="text-center py-3 px-3 font-medium text-gray-600 w-20">{a.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">Chưa tải được danh sách quyền từ Database</td>
                  </tr>
                ) : (
                  matrixData.map((row) => {
                    const isAllChecked = row.actionIds.length > 0 && row.actionIds.every((id) => isAdmin || currentSelectedPerms.includes(id));
                    
                    return (
                      <tr key={row.groupName} className="border-b hover:bg-gray-50 last:border-0">
                        <td className="py-3 px-4 font-medium text-gray-700">{row.groupName}</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            disabled={isAdmin || row.actionIds.length === 0}
                            onClick={() => toggleAllInModule(row, isAllChecked)}
                            className={`w-6 h-6 rounded border mx-auto flex items-center justify-center transition-colors ${
                              isAllChecked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 hover:border-blue-400 bg-white"
                            } disabled:opacity-50`}
                          >
                            {isAllChecked && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        {ACTIONS.map((action) => {
                          const permObj = row[action.key];
                          if (!permObj) return <td key={action.key} className="py-3 px-3 text-center text-gray-300">-</td>;
                          
                          const isChecked = isAdmin || currentSelectedPerms.includes(permObj.id);
                          return (
                            <td key={action.key} className="py-3 px-3 text-center">
                              <button
                                disabled={isAdmin}
                                onClick={() => togglePermission(permObj.id)}
                                className={`w-6 h-6 rounded border mx-auto flex items-center justify-center transition-colors ${
                                  isChecked ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-400 bg-white"
                                } disabled:opacity-50`}
                                title={permObj.description}
                              >
                                {isChecked ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3 text-gray-300" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;