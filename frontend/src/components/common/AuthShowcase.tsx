export function AuthShowcase() {
  return (
    <div className="flex flex-col justify-between h-full p-12 bg-[#2D2D2D] text-white">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-icon bg-primary flex items-center justify-center text-white text-sm font-bold font-ui">
          A
        </div>
        <span className="text-[20px] font-semibold font-display tracking-tight">AISkills</span>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-display font-medium leading-tight tracking-tight">
          发现和分享<br />最好的 AI 技能
        </h1>
        <p className="text-[15px] text-white/60 font-ui leading-relaxed">
          上传你的 Skills 配置，下载社区精选资源，让 AI 助手更强大。
        </p>
        <div className="flex flex-col gap-3">
          {['免费上传和下载 Skills', '社区排行榜发现热门资源', '收藏喜欢的内容随时取用'].map(item => (
            <div key={item} className="flex items-center gap-3 text-sm font-ui text-white/80">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/30 font-ui">© 2026 AISkills Platform</p>
    </div>
  );
}
