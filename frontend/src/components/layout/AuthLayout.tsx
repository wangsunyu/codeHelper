import { Outlet, useLocation } from 'react-router-dom';

export function AuthLayout() {
  const { pathname } = useLocation();
  const isRegisterPage = pathname === '/register';

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="mx-auto grid min-h-screen max-w-[1280px] items-center gap-14 px-6 py-12 md:grid-cols-[1fr_420px] md:px-10 lg:px-[92px]">
        <section
          className={`mx-auto self-center justify-self-center rounded-[32px] md:justify-self-stretch ${
            isRegisterPage
              ? 'w-full max-w-[520px] bg-[#223c35] px-10 py-14 text-white shadow-[0_20px_50px_rgba(34,60,53,0.18)]'
              : 'max-w-[430px] bg-transparent text-text-primary'
          }`}
        >
          {isRegisterPage ? (
            <>
              <p className="text-[16px] font-semibold font-ui uppercase tracking-[0.12em] text-white/70">
                Creator Access
              </p>
              <h1 className="mt-6 text-[54px] leading-[1.24] font-medium font-display text-white">
                发布你的 AI 资源。
              </h1>
              <div className="mt-10 space-y-5">
                <div className="inline-flex items-center gap-3 rounded-btn bg-[#fff4e8] px-5 py-4 text-[15px] font-medium font-ui text-[#c6801f]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e58d15]" />
                  注册后可立即上传第一个资源
                </div>
                <div className="inline-flex items-center gap-3 rounded-btn bg-[#fff4e8] px-5 py-4 text-[15px] font-medium font-ui text-[#c6801f]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e58d15]" />
                  上传 MCP / Skills，立即开始分享
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-[16px] font-medium font-ui text-primary">欢迎回来</p>
              <h1 className="mt-4 text-[52px] leading-[1.28] font-medium font-display text-text-primary">
                让你的 AI 助手继续无缝接手今天的工作。
              </h1>
              <p className="mt-6 text-[17px] leading-[1.85] font-ui text-text-secondary">
                登录后即可访问已收藏的 Skills、团队共享配置和最近使用的工作流模版。
              </p>
              <p className="mt-8 text-[15px] leading-[1.8] font-ui text-text-secondary">
                登录后继续访问收藏、下载记录与团队配置
              </p>
            </>
          )}
        </section>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[420px]">
          <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
