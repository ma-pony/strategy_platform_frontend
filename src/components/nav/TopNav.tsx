import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Crown, LogIn, LogOut, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useLocaleStore } from "@/stores/localeStore";
import type { Plan } from "@/lib/entitlements";

const navItems: Array<{
  to: string;
  label: { zh: string; en: string };
  requiresAuth?: boolean;
}> = [
  { to: "/", label: { zh: "首页", en: "Home" } },
  { to: "/signals", label: { zh: "交易信号", en: "Signals" } },
  { to: "/methodology", label: { zh: "策略说明", en: "Methodology" } },
  { to: "/market-research", label: { zh: "AI 市场研究", en: "Market Research" } },
  { to: "/pricing", label: { zh: "升级会员", en: "Upgrade" }, requiresAuth: true },
];

function planLabel(plan: Plan, locale: "zh" | "en") {
  if (locale === "zh") {
    if (plan === "guest") return "访客";
    if (plan === "free") return "免费";
    if (plan === "member") return "会员";
    return "管理员";
  }
  if (plan === "guest") return "Guest";
  if (plan === "free") return "Free";
  if (plan === "member") return "Member";
  return "Admin";
}

function planTone(plan: Plan) {
  if (plan === "member") return "bg-[color:var(--accent)]/15 text-[color:var(--accent)]";
  if (plan === "admin") return "bg-[color:var(--admin)]/15 text-[color:var(--admin)]";
  if (plan === "free") return "bg-white/10 text-white/80";
  return "bg-white/5 text-white/60";
}

export default function TopNav() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const plan = useAuthStore((s) => s.plan);
  const logout = useAuthStore((s) => s.logout);
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[color:var(--bg)]/95 backdrop-blur-lg">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[color:var(--accent)]">
                <path d="M3 18L8 10L13 14L18 6L21 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="21" cy="12" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-semibold text-white tracking-tight">经典交易策略</div>
              <div className="text-xs text-white/50 tracking-wide uppercase">Research · Signals · Backtest</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={(e) => {
                  if (it.requiresAuth && !user) {
                    e.preventDefault();
                    window.alert(locale === "zh" ? "登录后即可访问" : "Sign in to continue");
                    navigate(`/login?returnTo=${encodeURIComponent(it.to)}`);
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm text-white/65 transition-colors hover:text-white",
                    isActive && "text-white bg-white/[0.06]",
                  )
                }
                end={it.to === "/"}
              >
                {locale === "zh" ? it.label.zh : it.label.en}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <div className={cn("hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm border border-white/[0.08]", planTone(plan))}>
                <Crown className="size-4" />
                <span>{planLabel(plan, locale)}</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={toggleLocale}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 border border-white/[0.08] transition hover:bg-white/10"
              aria-label="toggle language"
            >
              {locale === "zh" ? "中文" : "EN"}
            </button>

            {!user ? (
              <>
                <Link
                  to={`/login?returnTo=${encodeURIComponent("/account")}`}
                  className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 border border-white/[0.08] transition hover:bg-white/10"
                >
                  <LogIn className="size-4" />
                  <span>{locale === "zh" ? "登录" : "Sign in"}</span>
                </Link>
                <Link
                  to={`/register?returnTo=${encodeURIComponent("/account")}`}
                  className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
                >
                  <Crown className="size-4" />
                  <span>{locale === "zh" ? "注册" : "Sign up"}</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/account")}
                  className="hidden rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 border border-white/[0.08] transition hover:bg-white/10 sm:inline-flex"
                >
                  {locale === "zh" ? "我的" : "Account"}
                </button>
                {plan !== "member" && plan !== "admin" ? (
                  <button
                    type="button"
                    onClick={() => navigate("/pricing")}
                    className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
                  >
                    <Crown className="size-4" />
                    <span>{locale === "zh" ? "升级会员" : "Upgrade"}</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={logout}
                  className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 border border-white/[0.08] transition hover:bg-white/10"
                >
                  <LogOut className="size-4" />
                  <span>{locale === "zh" ? "退出" : "Sign out"}</span>
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-lg bg-white/5 p-2 text-white/80 border border-white/[0.08] transition hover:bg-white/10 md:hidden"
              aria-label="菜单"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 md:hidden animate-fade" role="dialog" aria-modal="true" aria-label={locale === "zh" ? "导航菜单" : "Navigation menu"}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <nav ref={mobileMenuRef} className="absolute right-0 top-14 w-72 max-h-[calc(100vh-3.5rem)] overflow-auto bg-[color:var(--card)] border-l border-b border-white/[0.06] p-4 animate-in">
            <div className="grid gap-1">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  onClick={(e) => {
                    if (it.requiresAuth && !user) {
                      e.preventDefault();
                      window.alert(locale === "zh" ? "登录后即可访问" : "Sign in to continue");
                      navigate(`/login?returnTo=${encodeURIComponent(it.to)}`);
                    }
                    setMobileOpen(false);
                  }}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-white/5",
                      isActive && "text-white bg-white/[0.06]",
                    )
                  }
                  end={it.to === "/"}
                >
                  {locale === "zh" ? it.label.zh : it.label.en}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-4 grid gap-2">
              {user ? (
                <>
                  <div className={cn("inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm border border-white/[0.08]", planTone(plan))}>
                    <Crown className="size-4" />
                    <span>{planLabel(plan, locale)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { navigate("/account"); setMobileOpen(false); }}
                    className="rounded-lg px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5"
                  >
                    {locale === "zh" ? "我的" : "Account"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="rounded-lg px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5"
                  >
                    {locale === "zh" ? "退出" : "Sign out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/login?returnTo=${encodeURIComponent("/account")}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-white/5"
                  >
                    {locale === "zh" ? "登录" : "Sign in"}
                  </Link>
                  <Link
                    to={`/register?returnTo=${encodeURIComponent("/account")}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-[color:var(--accent)] px-4 py-3 text-center text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
                  >
                    {locale === "zh" ? "注册" : "Sign up"}
                  </Link>
                </>
              )}
              <button
                type="button"
                onClick={toggleLocale}
                className="rounded-lg px-4 py-3 text-left text-sm text-white/50 transition hover:bg-white/5"
              >
                {locale === "zh" ? "切换到 English" : "切换到 中文"}
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
