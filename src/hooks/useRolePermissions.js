import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/roles';

export function useRolePermissions() {
  const { userRole } = useAuth();

  const can = (permission) => {
    return hasPermission(userRole, permission);
  };

  return { can };
} 