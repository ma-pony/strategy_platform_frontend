import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Lock, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePaywall } from "@/hooks/usePaywall";
import { useAuthStore } from "@/stores/authStore";
import type { PaywallReason } from "@/lib/entitlements";

const PAYWALL_COPY: Record<
  PaywallReason,
  {
    title: string;
    bullets: string[];
    primaryCta: "login" | "upgrade";
  }
> = {
  download_strategy: {
    title: "下载策略需要会员权限",
    bullets: ["解锁策略下载与更新", "查看完整回测报告与版本信息"],
    primaryCta: "upgrade",
  },
  signal_price: {
    title: "查看触发价需要会员权限",
    bullets: ["解锁实时/准实时信号", "查看触发价与强度"],
    primaryCta: "upgrade",
  },
  signal_strength: {
    title: "查看强度需要会员权限",
    bullets: ["解锁强度/置信度字段", "更完整的信号验证信息"],
    primaryCta: "upgrade",
  },
  export_signals: {
    title: "导出信号需要会员权限",
    bullets: ["导出 CSV", "更高的查看额度与筛选能力"],
    primaryCta: "upgrade",
  },
  export_backtest: {
    title: "导出回测报告需要会员权限",
    bullets: ["导出 PDF/CSV（如提供）", "查看完整口径与版本信息"],
    primaryCta: "upgrade",
  },
  signals_quota: {
    title: "已达到免费可查看额度",
    bullets: ["解锁无限查看", "解锁导出与高级筛选"],
    primaryCta: "upgrade",
  },
  advanced_filters: {
    title: "高级筛选需要会员权限",
    bullets: ["更多维度筛选策略/信号", "更快找到适合的策略"],
    primaryCta: "upgrade",
  },
  backtest_full: {
    title: "完整回测报告需要会员权限",
    bullets: ["查看代币池规则与数据版本", "查看扩展指标与明细假设"],
    primaryCta: "upgrade",
  },
};

function canDismiss(target: HTMLElement) {
  return target.dataset.dismiss === "1";
}

export default function PaywallModal() {
  const { isOpen, params, close } = usePaywall();
  const navigate = useNavigate();
  const plan = useAuthStore((s) => s.plan);
  const user = useAuthStore((s) => s.user);
  const setPlan = useAuthStore((s) => s.setPlan);
  const grantStrategy = useAuthStore((s) => s.grantStrategy);

  const copy = useMemo(() => {
    if (!params) return null;
    return PAYWALL_COPY[params.reason];
  }, [params]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  if (!isOpen || !params || !copy) return null;

  const returnTo = params.returnTo || "/";
  const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  const isAuthed = Boolean(user);
  const showLogin = !isAuthed || plan === "guest";
  const canOfferSingleGrant = isAuthed && plan === "free" && Boolean(params.strategyId);

  const primaryAction = () => {
    if (showLogin) {
      close();
      navigate(loginUrl);
      return;
    }
    setPlan("member");
    close();
  };

  const primaryLabel = showLogin ? "登录后解锁" : "立即升级";
  const secondaryLabel = showLogin ? "升级会员" : "管理订阅";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        data-dismiss="1"
        onClick={(e) => {
          const el = e.target as HTMLElement;
          if (canDismiss(el)) close();
        }}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[920px] overflow-hidden rounded-2xl bg-[color:var(--card)] ring-1 ring-white/10">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Lock className="size-5 text-white/80" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{copy.title}</div>
                <div className="mt-0.5 text-xs text-white/55">解锁后可获得可执行信息与可复现口径</div>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="grid size-9 place-items-center rounded-lg bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
              aria-label="close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-[1fr_360px]">
            <div className="grid gap-4">
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-medium text-white">你将解锁</div>
                <div className="mt-3 grid gap-2">
                  {copy.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className="mt-0.5 size-4 text-[color:var(--success)]" />
                      <div>{b}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-medium text-white">研究站常见的付费逻辑</div>
                <div className="mt-2 text-sm text-white/70">
                  免费给你看“可理解的摘要”，会员给你看“可执行的关键字段”（触发价/强度、完整回测口径、导出与更多筛选）。
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                  <span className="rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">内容 gating</span>
                  <span className="rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">延迟 gating</span>
                  <span className="rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">数量/配额 gating</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-white">会员计划（Demo）</div>
              <div className="mt-2 text-sm text-white/70">
                <span className="font-medium text-white">¥49/月</span> · 包含实时信号、完整回测口径、导出与高级筛选
              </div>
              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={primaryAction}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                >
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </button>

                <Link
                  to="/pricing"
                  onClick={close}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/10",
                    copy.primaryCta === "login" && "hidden",
                  )}
                >
                  {secondaryLabel}
                </Link>

                {canOfferSingleGrant ? (
                  <button
                    type="button"
                    onClick={() => {
                      const expires = new Date();
                      expires.setDate(expires.getDate() + 7);
                      grantStrategy({ strategyId: params.strategyId!, expiresAt: expires.toISOString() });
                      close();
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/10"
                  >
                    仅解锁该策略（7天）
                  </button>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2 text-xs text-white/55">
                <div>
                  <Link to="/methodology" onClick={close} className="text-[color:var(--accent)] hover:underline">
                    查看策略说明与口径
                  </Link>
                  <span className="mx-2 text-white/30">·</span>
                  <Link to="/account" onClick={close} className="text-[color:var(--accent)] hover:underline">
                    账号与订阅
                  </Link>
                </div>
                <div>本弹窗为前端演示：点击“立即升级”会切换为 Member 权限。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
