import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="mt-14 bg-bg-dark text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-[72px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-[6px] bg-primary" />
              <span className="text-[20px] font-medium font-ui text-white">AI助手资源平台</span>
            </div>
            <p className="mt-4 max-w-[320px] text-[14px] leading-[1.9] font-ui text-white/55">
              发现、分享和使用高质量的 AI 助手资源，让团队能力可以被持续沉淀与复用。
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[14px] font-semibold font-ui text-white/80">资源</p>
              <div className="mt-4 flex flex-col gap-3 text-[14px] font-ui text-white/55">
                <Link to="/skills" className="hover:text-white">Skills 资源库</Link>
                <Link to="/rankings" className="hover:text-white">排行榜</Link>
                <Link to="/skills/publish" className="hover:text-white">上传资源</Link>
              </div>
            </div>
            <div>
              <p className="text-[14px] font-semibold font-ui text-white/80">社区</p>
              <div className="mt-4 flex flex-col gap-3 text-[14px] font-ui text-white/55">
                <Link to="/favorites" className="hover:text-white">我的收藏</Link>
                <Link to="/login" className="hover:text-white">登录</Link>
                <Link to="/register" className="hover:text-white">注册</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/8 pt-5 text-[13px] font-ui text-white/38">
          © 2026 AI助手资源平台 · 保留所有权利
        </div>
      </div>
    </footer>
  );
}
