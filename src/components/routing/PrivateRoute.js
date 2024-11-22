import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { ROLES } from '../../utils/roles';

export default function PrivateRoute({ children, requiredRole = ROLES.USER, requiredPermission = null }) {
  const { currentUser, userRole } = useAuth();
  const { can } = useRolePermissions();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    const roleHierarchy = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      return <Navigate to="/" />;
    }
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/" />;
  }

  return children;
} 