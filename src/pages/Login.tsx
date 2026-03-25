import { useMemo, useRef, useState } from "react";
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
  const submitting = useRef(false);

  const error = localError || storeError;

  const handleSubmit = async () => {
    if (submitting.current) return;
    setLocalError(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError("请输入邮箱");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setLocalError("请输入有效的邮箱地址");
      return;
    }
    if (!password || password.length < 8) {
      setLocalError("密码至少需要 8 个字符");
      return;
    }

    submitting.current = true;
    try {
      await loginAsync(trimmedEmail, password);
      navigate(returnTo, { replace: true });
    } catch {
      // Error is set in store
    } finally {
      submitting.current = false;
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-[440px] gap-5 animate-in">
      <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
        <h1 className="text-lg font-semibold text-white md:text-xl tracking-tight">登录</h1>
        <div className="mt-2 text-sm text-white/55">使用邮箱和密码登录您的账号。</div>

        {error ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[color:var(--danger)]">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-white/50">邮箱</span>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 border border-white/[0.08] focus-within:border-[color:var(--accent)]/30 transition-colors">
              <Mail className="size-4 text-white/40" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
              />
            </div>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-white/50">密码</span>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 border border-white/[0.08] focus-within:border-[color:var(--accent)]/30 transition-colors">
              <Lock className="size-4 text-white/40" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 个字符"
                type="password"
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
              />
            </div>
          </label>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110 disabled:opacity-50"
          >
            <ShieldCheck className="size-4" />
            {isLoading ? "登录中…" : "登录"}
          </button>

          <div className="flex items-center justify-between text-xs text-white/45">
            <Link to={`/register?returnTo=${encodeURIComponent(returnTo)}`} className="text-[color:var(--accent)] hover:underline">
              没有账号？去注册
            </Link>
            <Link to="/" className="text-white/55 hover:text-white hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
