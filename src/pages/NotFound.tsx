import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 animate-in">
      <div className="text-6xl font-bold tracking-tighter text-white/10">404</div>
      <div className="text-sm text-white/50">页面不存在或已被移动。</div>
      <Link to="/" className="mt-2 rounded-lg bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110">
        返回首页
      </Link>
    </div>
  );
}
