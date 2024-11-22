import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';

export default function AuthRoute({ children, requiredRole = null, requiredPermission = null }) {
  const { currentUser, userRole } = useAuth();
  const { can } = useRolePermissions();
  const location = useLocation();

  // If not logged in, redirect to login with return path
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Check permission if required
  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return children;
} 