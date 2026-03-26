import { Crown, LogOut, Receipt, Settings, ShieldCheck, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useAuthStore } from "@/stores/authStore";

type SectionKey = "subscription" | "unlocked" | "profile" | "security" | "billing";

export default function Account() {
  const ent = useEntitlements();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const plan = useAuthStore((s) => s.plan);
  const subscription = useAuthStore((s) => s.subscription);
  const logout = useAuthStore((s) => s.logout);
  const grants = useAuthStore((s) => s.grants);

  const [section, setSection] = useState<SectionKey>("subscription");

  const canView = ent.has("can_view_account");
  const returnTo = useMemo(() => encodeURIComponent(location.pathname + location.search), [location.pathname, location.search]);

  const displayName = user?.email ?? "用户";
  const accountId = user?.id ? String(user.id) : "—";
  const planLabel = plan === "admin" ? "管理员" : plan === "member" ? "会员" : "免费";
  const planTone = plan === "member" ? "text-[color:var(--accent)]" : plan === "admin" ? "text-[color:var(--admin)]" : "text-white";
  const subStatusLabel = subscription.status === "active" ? "已生效" : subscription.status === "trialing" ? "试用中" : subscription.status === "past_due" ? "逾期" : subscription.status === "canceled" ? "已取消" : "未订阅";
  const periodEndLabel = subscription.currentPeriodEnd ? formatDateTime(subscription.currentPeriodEnd) : "—";

  const entitlements = ent.global.entitlements;
  const entRows = useMemo(
    () =>
      [
        { key: "can_view_signals_unlimited", label: "无限查看信号" },
        { key: "can_view_signal_price", label: "触发价" },
        { key: "can_view_signal_strength", label: "强度" },
        { key: "can_view_backtest_full", label: "完整回测报告" },
        { key: "can_download_strategy", label: "下载策略" },
        { key: "can_export_signals", label: "导出信号（CSV）" },
      ].map((it) => ({
        label: it.label,
        enabled: Boolean((entitlements as Record<string, boolean>)[it.key]),
      })),
    [entitlements],
  );

  const visibleSections = useMemo(() => {
    const items: Array<{ key: SectionKey; label: string; hidden?: boolean }> = [
      { key: "subscription", label: "订阅与权益" },
      { key: "unlocked", label: "已解锁策略", hidden: grants.length === 0 },
      { key: "profile", label: "个人资料" },
      { key: "security", label: "安全设置" },
      { key: "billing", label: "账单与发票" },
    ];
    return items.filter((x) => !x.hidden);
  }, [grants.length]);

  useEffect(() => {
    if (canView) return;
    navigate(`/login?returnTo=${returnTo}`, { replace: true });
  }, [canView, navigate, returnTo]);

  if (!canView) return null;

  return (
    <div className="grid gap-6">
      <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-white/5 border border-white/[0.06]">
              <User className="size-5 text-white/80" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white md:text-2xl tracking-tight">我的</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
                <span className="truncate font-medium text-white max-w-[200px]">{displayName}</span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/45">ID：{accountId}</span>
              </div>
              <div className={cn("mt-2 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs border border-white/[0.06]", planTone)}>
                <Crown className="size-4" />
                <span>{planLabel}</span>
                <span className="text-white/35">·</span>
                <span className="text-white/70">{subStatusLabel}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 border border-white/[0.06] transition hover:bg-white/10"
          >
            <LogOut className="size-4" />
            退出
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-xl bg-[color:var(--card)] p-3 border border-white/[0.06]">
          <div className="grid gap-1">
            {visibleSections.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setSection(it.key)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm border border-white/[0.06] transition",
                  section === it.key ? "bg-white/10 text-white" : "bg-white/5 text-white/75 hover:bg-white/10",
                )}
              >
                <span>{it.label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="mt-2 inline-flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/75 border border-white/[0.06] transition hover:bg-white/10"
            >
              <span>退出</span>
              <LogOut className="size-4 text-white/60" />
            </button>
          </div>
        </aside>

        <div className="grid gap-4">
          {section === "subscription" ? (
            <>
              <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
                <div className="text-sm font-semibold text-white">订阅状态</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <Stat label="当前计划" value={planLabel} tone={plan === "member" || plan === "admin" ? "accent" : "neutral"} />
                  <Stat label="到期时间" value={periodEndLabel} />
                  <Stat label="自动续费" value={subscription.autoRenew ? "开启" : "关闭"} />
                  <Stat label="状态" value={subStatusLabel} />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
                  >
                    <Crown className="size-4" />
                    查看定价方案
                  </Link>
                </div>
              </div>

              <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[color:var(--success)]" />
                  <div className="text-sm font-semibold text-white">已解锁权益</div>
                </div>
                <div className="mt-4 grid gap-2">
                  {entRows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/[0.06]">
                      <div className="text-sm text-white/80">{r.label}</div>
                      <div className={cn("text-xs font-medium", r.enabled ? "text-[color:var(--success)]" : "text-white/45")}>{r.enabled ? "已解锁" : "未解锁"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {section === "unlocked" ? (
            <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
              <div className="text-sm font-semibold text-white">已解锁策略</div>
              <div className="mt-4 grid gap-2">
                {grants.map((g) => (
                  <div key={g.strategyId} className="flex flex-col gap-2 rounded-xl bg-white/5 p-4 border border-white/[0.06] md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{g.strategyId}</div>
                      <div className="mt-1 text-xs text-white/45">到期：{g.expiresAt ? formatDateTime(g.expiresAt) : "永久"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/strategies/${encodeURIComponent(g.strategyId)}`)}
                      className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80 border border-white/[0.06] transition hover:bg-white/10"
                    >
                      查看策略
                    </button>
                  </div>
                ))}
                {grants.length === 0 ? (
                  <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
                    <div className="text-sm text-white/60">还没有单独解锁的策略。</div>
                    <Link to="/" className="mt-2 inline-flex text-xs text-[color:var(--accent)] hover:underline">去首页浏览策略</Link>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {section === "profile" ? (
            <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
              <div className="text-sm font-semibold text-white">个人资料</div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Stat label="邮箱" value={user?.email ?? "—"} />
                <Stat label="账号 ID" value={accountId} />
                <Stat label="会员等级" value={user?.membership ?? "—"} />
                <Stat label="注册时间" value={user?.created_at ? formatDateTime(user.created_at) : "—"} />
              </div>
            </div>
          ) : null}

          {section === "security" ? (
            <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Settings className="size-4 text-white/70" />
                <div className="text-sm font-semibold text-white">安全设置</div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-white/70">
                <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">修改密码（即将推出）</div>
                <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">两步验证 2FA（即将推出）</div>
              </div>
            </div>
          ) : null}

          {section === "billing" ? (
            <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-white/70" />
                <div className="text-sm font-semibold text-white">账单与发票</div>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="rounded-xl bg-white/5 p-4 text-sm text-white/70 border border-white/[0.06]">账单功能即将推出。</div>
                <Link to="/pricing" className="inline-flex w-fit items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 border border-white/[0.06] transition hover:bg-white/10">
                  <Crown className="size-4 text-[color:var(--accent)]" />
                  前往升级会员
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Stat(props: { label: string; value: string; tone?: "accent" | "neutral" }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
      <div className="text-xs text-white/45">{props.label}</div>
      <div className={cn("mt-2 text-lg font-semibold tabular-nums", props.tone === "accent" ? "text-[color:var(--accent)]" : "text-white")}>{props.value}</div>
    </div>
  );
}
