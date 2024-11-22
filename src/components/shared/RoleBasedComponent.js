import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/roles';

export default function RoleBasedComponent({ 
  children, 
  requiredRole = ROLES.USER,
  requiredPermission = null,
  fallback = null 
}) {
  const { userRole } = useAuth();
  const { can } = useRolePermissions();

  const roleHierarchy = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN];
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  const hasRequiredRole = userRoleIndex >= requiredRoleIndex;
  const hasRequiredPermission = !requiredPermission || can(requiredPermission);

  if (hasRequiredRole && hasRequiredPermission) {
    return children;
  }

  return fallback;
} 