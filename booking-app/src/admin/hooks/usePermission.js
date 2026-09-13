import { useMemo } from "react";

export function usePermission() {
  const permissions = useMemo(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return [];
    
    try {
      const user = JSON.parse(userString);
      return user.permissions || [];
    } catch (e) {
      return [];
    }
  }, []);

  const hasPermission = (permissionCode) => {
    return permissions.includes(permissionCode);
  };

  return { hasPermission };
}