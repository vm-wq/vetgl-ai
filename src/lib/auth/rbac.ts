/**
 * Role-Based Access Control (RBAC) System for VETGL.AI
 * Manages user roles and permissions across the application
 */

export type UserRole = 'admin' | 'veterinarian' | 'technician';

export interface Permission {
  route: string;
  roles: UserRole[];
}

export const ROUTE_PERMISSIONS: Permission[] = [
  // All authenticated users
  { route: '/dashboard', roles: ['admin', 'veterinarian', 'technician'] },
  { route: '/dashboard/protocols', roles: ['admin', 'veterinarian', 'technician'] },
  { route: '/dashboard/quiz', roles: ['admin', 'veterinarian', 'technician'] },

  // Vets and Admins
  { route: '/dashboard/cases', roles: ['admin', 'veterinarian'] },
  { route: '/dashboard/estimates', roles: ['admin', 'veterinarian'] },
  { route: '/dashboard/recordings', roles: ['admin', 'veterinarian'] },
  { route: '/dashboard/treatment-board', roles: ['admin', 'veterinarian'] },

  // Admin only
  { route: '/dashboard/audit', roles: ['admin'] },
  { route: '/dashboard/admin', roles: ['admin'] },
  { route: '/dashboard/admin/users', roles: ['admin'] },
  { route: '/dashboard/admin/documents', roles: ['admin'] },
  { route: '/dashboard/admin/memory', roles: ['admin'] },
];

export function hasAccess(role: UserRole, route: string): boolean {
  const permission = ROUTE_PERMISSIONS.find((p) => route.startsWith(p.route));
  if (!permission) return true; // Allow by default for unknown routes
  return permission.roles.includes(role);
}

export function getNavigationItems(role: UserRole) {
  const allItems = [
    { href: '/dashboard', label: 'Chat', icon: 'MessageSquare', roles: ['admin', 'veterinarian', 'technician'] },
    { href: '/dashboard/cases', label: 'Casos', icon: 'FolderOpen', roles: ['admin', 'veterinarian'] },
    { href: '/dashboard/protocols', label: 'Protocolos', icon: 'BookOpen', roles: ['admin', 'veterinarian', 'technician'] },
    { href: '/dashboard/estimates', label: 'Estimados', icon: 'Receipt', roles: ['admin', 'veterinarian'] },
    { href: '/dashboard/recordings', label: 'Gravações', icon: 'Mic', roles: ['admin', 'veterinarian'] },
    { href: '/dashboard/treatment-board', label: 'Internados', icon: 'ClipboardList', roles: ['admin', 'veterinarian'] },
    { href: '/dashboard/quiz', label: 'Quiz', icon: 'GraduationCap', roles: ['admin', 'veterinarian', 'technician'] },
    { href: '/dashboard/audit', label: 'Auditoria', icon: 'BarChart3', roles: ['admin'] },
  ];

  return allItems.filter((item) => item.roles.includes(role));
}

export function getAdminNavigationItems(role: UserRole) {
  if (role !== 'admin') return [];
  return [
    { href: '/dashboard/admin/users', label: 'Usuários', icon: 'Users' },
    { href: '/dashboard/admin/documents', label: 'Documentos', icon: 'FileText' },
    { href: '/dashboard/admin/memory', label: 'Memória AI', icon: 'Brain' },
  ];
}

export default {
  hasAccess,
  getNavigationItems,
  getAdminNavigationItems,
};
