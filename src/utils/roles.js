export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: {
    canCreateContent: true,
    canVote: true,
    canComment: true,
    canReport: true,
    canEditOwnContent: true,
    canDeleteOwnContent: true,
  },
  [ROLES.MODERATOR]: {
    ...ROLES.USER,
    canEditAnyContent: true,
    canDeleteAnyContent: true,
    canBanUsers: true,
    canHandleReports: true,
    canManageTags: true,
  },
  [ROLES.ADMIN]: {
    ...ROLES.MODERATOR,
    canManageRoles: true,
    canAccessAdminPanel: true,
    canManageSettings: true,
    canViewAnalytics: true,
  }
};

export function hasPermission(userRole, permission) {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
  return ROLE_PERMISSIONS[userRole][permission] || false;
} 