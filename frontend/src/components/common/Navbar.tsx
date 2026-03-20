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
    `relative text-[14px] font-medium font-ui transition-colors ${
      isActive
        ? 'text-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/94 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-[72px]">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-[6px] bg-primary" />
          <span className="text-[18px] font-semibold font-ui tracking-[-0.01em] text-text-primary">
            AI助手资源平台
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            首页
          </NavLink>
          <NavLink to="/skills" className={navLinkClass}>
            Skills
          </NavLink>
          <NavLink to="/rankings" className={navLinkClass}>
            排行榜
          </NavLink>
          {user ? (
            <NavLink to="/favorites" className={navLinkClass}>
              收藏
            </NavLink>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/skills/publish"
                className="inline-flex h-10 items-center justify-center rounded-btn border border-border bg-bg-surface px-5 text-[14px] font-medium font-ui text-text-primary transition-colors hover:bg-bg-muted"
              >
                发布
              </Link>
              <Link
                to="/favorites"
                className="inline-flex h-10 items-center justify-center rounded-btn bg-primary px-5 text-[14px] font-medium font-ui text-white shadow-[0_8px_18px_rgba(142,160,143,0.18)] transition-opacity hover:opacity-90"
              >
                收藏
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="inline-flex h-10 items-center rounded-btn border border-border bg-white px-5 text-[14px] font-medium font-ui text-text-primary">
                  {user.username}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-50 w-36 pt-2">
                    <div className="rounded-[18px] border border-border bg-white p-1 shadow-[0_16px_32px_rgba(0,0,0,0.08)]">
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-[14px] px-4 py-2 text-left text-sm font-ui text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
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
                className="inline-flex h-10 items-center justify-center rounded-btn border border-border bg-bg-surface px-6 text-[14px] font-medium font-ui text-text-primary transition-colors hover:bg-bg-muted"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center justify-center rounded-btn bg-primary px-6 text-[14px] font-medium font-ui text-white shadow-[0_8px_18px_rgba(142,160,143,0.18)] transition-opacity hover:opacity-90"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-transparent md:hidden">
        <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-5 py-3 text-[14px] font-medium font-ui text-text-secondary sm:px-8 lg:px-[72px]">
          <NavLink to="/" end className={navLinkClass}>
            首页
          </NavLink>
          <NavLink to="/skills" className={navLinkClass}>
            Skills
          </NavLink>
          <NavLink to="/rankings" className={navLinkClass}>
            排行榜
          </NavLink>
          {user ? (
            <NavLink to="/favorites" className={navLinkClass}>
              收藏
            </NavLink>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
