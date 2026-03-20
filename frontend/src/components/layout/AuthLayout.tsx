import { Outlet } from 'react-router-dom';
import { AuthShowcase } from '../common/AuthShowcase';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <AuthShowcase />
      <div className="flex items-center justify-center bg-bg-page p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
