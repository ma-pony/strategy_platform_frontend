import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rounded-2xl bg-[color:var(--card)] p-10 text-center ring-1 ring-white/10">
      <div className="text-2xl font-semibold text-white">404</div>
      <div className="mt-2 text-sm text-white/60">页面不存在</div>
      <div className="mt-6">
        <Link to="/" className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110">
          返回首页
        </Link>
      </div>
    </div>
  );
}
