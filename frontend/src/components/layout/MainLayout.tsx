import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { SiteFooter } from '../common/SiteFooter';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
