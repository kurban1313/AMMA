// AMMA Healthcare Platform - Role Route Component

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'patient') {
      return <Navigate to="/dashboard" replace />;
    } else if (user?.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (user?.role === 'researcher') {
      return <Navigate to="/researcher/dashboard" replace />;
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
