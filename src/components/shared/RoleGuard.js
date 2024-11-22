import { useRolePermissions } from '../../hooks/useRolePermissions';

export default function RoleGuard({ children, requiredPermission }) {
  const { can } = useRolePermissions();

  if (!requiredPermission || can(requiredPermission)) {
    return children;
  }

  return null;
} 