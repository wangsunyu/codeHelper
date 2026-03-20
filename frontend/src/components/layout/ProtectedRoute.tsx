import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-secondary font-ui">加载中...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
