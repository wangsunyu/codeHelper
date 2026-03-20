import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-ui transition-colors ${
      isActive
        ? 'text-text-primary font-semibold border-b-2 border-primary pb-0.5'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <nav className="h-[76px] px-20 flex items-center justify-between border-b border-border bg-white sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-icon bg-primary flex items-center justify-center text-white text-sm font-bold font-ui">
          A
        </div>
        <span className="text-[20px] font-semibold font-display text-text-primary tracking-tight">
          AISkills
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <NavLink to="/skills" className={navLinkClass}>
          Skills
        </NavLink>
        <NavLink to="/rankings" className={navLinkClass}>
          排行榜
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/skills/publish"
              className="h-9 px-4 rounded-btn text-sm font-medium font-ui bg-[#2D2D2D] text-white hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              发布
            </Link>
            <Link
              to="/favorites"
              className="h-9 px-4 rounded-btn text-sm font-medium font-ui bg-bg-surface text-text-primary border border-border hover:bg-bg-muted transition-colors inline-flex items-center justify-center"
            >
              收藏
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="text-sm font-ui text-text-secondary hover:text-text-primary transition-colors">
                {user.username}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full pt-1 w-32 z-50">
                  <div className="bg-white border border-border rounded-xl shadow-lg py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-ui text-text-secondary hover:text-text-primary hover:bg-bg-muted transition-colors"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="h-9 px-4 rounded-btn text-sm font-medium font-ui text-text-secondary hover:text-text-primary transition-colors inline-flex items-center justify-center"
            >
              登录
            </Link>
            <Link
              to="/register"
              className="h-9 px-4 rounded-btn text-sm font-medium font-ui bg-[#2D2D2D] text-white hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              注册
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
