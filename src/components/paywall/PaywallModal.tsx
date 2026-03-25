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
    bullets: ["解锁强度/置信度字段", "配合触发价判断信号质量"],
    primaryCta: "upgrade",
  },
  export_signals: {
    title: "导出信号需要会员权限",
    bullets: ["导出 CSV 到本地", "无限查看信号 + 高级筛选"],
    primaryCta: "upgrade",
  },
  export_backtest: {
    title: "导出回测报告需要会员权限",
    bullets: ["导出完整回测报告", "查看详细假设与数据版本"],
    primaryCta: "upgrade",
  },
  signals_quota: {
    title: "已达到免费可查看额度",
    bullets: ["解锁无限查看", "解锁导出与高级筛选"],
    primaryCta: "upgrade",
  },
  advanced_filters: {
    title: "高级筛选需要会员权限",
    bullets: ["按类型、交易对、收益等多维度筛选", "快速定位适合的策略"],
    primaryCta: "upgrade",
  },
  backtest_full: {
    title: "完整回测报告需要会员权限",
    bullets: ["查看代币池规则与回测数据版本", "查看年化收益、胜率等扩展指标"],
    primaryCta: "upgrade",
  },
};

function canDismiss(target: HTMLElement) {
  return target.dataset.dismiss === "1";
}

export default function PaywallModal() {
  const { isOpen, params, close } = usePaywall();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

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
  const showLogin = !isAuthed;

  const primaryAction = () => {
    if (showLogin) {
      close();
      navigate(loginUrl);
      return;
    }
    close();
    navigate("/pricing");
  };

  const primaryLabel = showLogin ? "登录后查看" : "联系销售";
  const secondaryLabel = showLogin ? "了解会员权益" : "查看定价方案";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={copy.title}>
      <div
        className="absolute inset-0 bg-black/60 animate-fade"
        data-dismiss="1"
        onClick={(e) => {
          const el = e.target as HTMLElement;
          if (canDismiss(el)) close();
        }}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[920px] overflow-hidden rounded-xl bg-[color:var(--card)] border border-white/[0.06] animate-scale">
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-white/5 border border-white/[0.06]">
                <Lock className="size-5 text-white/80" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{copy.title}</div>
                <div className="mt-0.5 text-xs text-white/45">升级后查看完整数据，辅助交易决策</div>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="grid size-9 place-items-center rounded-lg bg-white/5 text-white/80 border border-white/[0.06] transition hover:bg-white/10"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-[1fr_360px]">
            <div className="grid gap-4">
              <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
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

              <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
                <div className="text-sm font-medium text-white">会员可以做什么</div>
                <div className="mt-2 grid gap-1.5 text-sm text-white/70">
                  <div>查看触发价与信号强度，把握入场时机</div>
                  <div>获取完整回测报告，了解策略真实表现</div>
                  <div>导出数据 + 高级筛选，提升研究效率</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
              <div className="text-sm font-semibold text-white">Pro 会员</div>
              <div className="mt-2 text-sm text-white/70">
                <span className="font-medium text-white">¥49/月</span> · 完整信号、回测报告、数据导出
              </div>
              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={primaryAction}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
                >
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </button>

                <Link
                  to="/pricing"
                  onClick={close}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 border border-white/[0.06] transition hover:bg-white/10",
                    copy.primaryCta === "login" && "hidden",
                  )}
                >
                  {secondaryLabel}
                </Link>

              </div>

              <div className="mt-4 grid gap-2 text-xs text-white/45">
                <div>
                  <Link to="/methodology" onClick={close} className="text-[color:var(--accent)] hover:underline">
                    策略说明与指标定义
                  </Link>
                  <span className="mx-2 text-white/50">·</span>
                  <Link to="/account" onClick={close} className="text-[color:var(--accent)] hover:underline">
                    账号与订阅
                  </Link>
                </div>
                <div>如需升级请联系销售，我们将在后台为您开通权限。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
