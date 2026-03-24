import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ShieldCheck, Lock, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";

export default function Login() {
  const [sp] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const loginAsync = useAuthStore((s) => s.loginAsync);
  const isLoading = useAuthStore((s) => s.isLoading);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const returnTo = useMemo(() => {
    const rt = sp.get("returnTo");
    if (!rt) return "/account";
    try {
      const decoded = decodeURIComponent(rt);
      if (decoded === "/") return "/account";
      if (decoded.startsWith("/")) return decoded;
      return "/account";
    } catch {
      return "/account";
    }
  }, [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || storeError;

  const handleSubmit = async () => {
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("请输入邮箱");
      return;
    }
    if (!password || password.length < 8) {
      setLocalError("密码至少 8 位");
      return;
    }

    try {
      await loginAsync(email, password);
      navigate(returnTo, { replace: true });
    } catch {
      // Error is set in store
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-[440px] gap-5">
      <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
        <h1 className="text-lg font-semibold text-white md:text-xl">登录</h1>
        <div className="mt-2 text-sm text-white/70">使用邮箱和密码登录您的账号。</div>

        {error ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[color:var(--danger)]">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3">
          <label className="grid gap-1">
            <div className="text-xs text-white/55">邮箱</div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <Mail className="size-4 text-white/55" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </label>

          <label className="grid gap-1">
            <div className="text-xs text-white/55">密码</div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <Lock className="size-4 text-white/55" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 位"
                type="password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </label>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
          >
            <ShieldCheck className="size-4" />
            {isLoading ? "登录中…" : "登录"}
          </button>

          <div className="flex items-center justify-between text-xs text-white/55">
            <Link to={`/register?returnTo=${encodeURIComponent(returnTo)}`} className="text-[color:var(--accent)] hover:underline">
              没有账号？去注册
            </Link>
            <Link to="/" className="text-white/70 hover:text-white hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
