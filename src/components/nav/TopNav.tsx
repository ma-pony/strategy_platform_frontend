import { useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Crown, LogIn, LogOut } from "lucide-react";

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
  { to: "/signals", label: { zh: "更多策略", en: "More Strategies" } },
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
  if (plan === "admin") return "bg-purple-500/15 text-purple-200";
  if (plan === "free") return "bg-white/10 text-white/80";
  return "bg-white/5 text-white/60";
}

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const plan = useAuthStore((s) => s.plan);
  const logout = useAuthStore((s) => s.logout);
  const setPlan = useAuthStore((s) => s.setPlan);
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[color:var(--bg)]/90 backdrop-blur">
      <div className="container flex h-14 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-[color:var(--card)] ring-1 ring-white/10">
            <span className="text-sm font-semibold text-white">CT</span>
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold text-white">经典交易策略</div>
            <div className="text-[11px] text-white/55">Research · Signals · Backtest</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={(e) => {
                if (it.requiresAuth && !user) {
                  e.preventDefault();
                  window.alert(locale === "zh" ? "请先登录" : "Please sign in first");
                  navigate(`/login?returnTo=${encodeURIComponent(it.to)}`);
                }
              }}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white",
                  isActive && "bg-white/10 text-white",
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
            <div className={cn("inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 ring-white/10", planTone(plan))}>
              <Crown className="size-4" />
              <span>{planLabel(plan, locale)}</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
            aria-label="toggle language"
          >
            <span className="hidden sm:inline">{locale === "zh" ? "中文" : "EN"}</span>
            <span className="sm:hidden">{locale === "zh" ? "中" : "EN"}</span>
          </button>

          {!user ? (
            <>
              <Link
                to={`/login?returnTo=${encodeURIComponent("/account")}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <LogIn className="size-4" />
                <span className="hidden sm:inline">{locale === "zh" ? "登录" : "Sign in"}</span>
              </Link>
              <Link
                to={`/register?returnTo=${encodeURIComponent("/account")}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2 text-sm font-medium text-white transition hover:brightness-110"
              >
                <Crown className="size-4" />
                <span className="hidden sm:inline">{locale === "zh" ? "注册" : "Sign up"}</span>
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/account")}
                className="hidden rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/10 sm:inline-flex"
              >
                {locale === "zh" ? "我的" : "Account"}
              </button>
              {plan !== "member" && plan !== "admin" ? (
                <button
                  type="button"
                  onClick={() => setPlan("member")}
                  className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-3 py-2 text-sm font-medium text-white transition hover:brightness-110"
                >
                  <Crown className="size-4" />
                  <span className="hidden sm:inline">{locale === "zh" ? "一键升级" : "Upgrade"}</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{locale === "zh" ? "退出" : "Sign out"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
