import { FileDown, Info } from "lucide-react";
import type { ReactNode } from "react";

import type { BacktestResultRead } from "@/api/types";
import { formatDate, formatInt, formatNumber, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import Gated from "@/components/paywall/Gated";
import LockBadge from "@/components/paywall/LockBadge";
import BlurredValue from "@/components/paywall/BlurredValue";

export default function BacktestReportPanel(props: {
  strategyId: string;
  backtest: BacktestResultRead;
  className?: string;
}) {
  const bt = props.backtest;

  const core = [
    { label: "总收益", value: bt.total_return != null ? formatPct(bt.total_return * 100) : "—" },
    { label: "最大回撤", value: bt.max_drawdown != null ? formatPct(-Math.abs(bt.max_drawdown * 100)) : "—" },
    { label: "Sharpe", value: bt.sharpe_ratio != null ? formatNumber(bt.sharpe_ratio, 2) : "—" },
    { label: "交易次数", value: bt.trade_count != null ? formatInt(bt.trade_count) : "—" },
  ];

  const ext = [
    { label: "年化收益", value: bt.annual_return != null ? formatPct(bt.annual_return * 100) : "—" },
    { label: "胜率", value: bt.win_rate != null ? formatPct(bt.win_rate * 100) : "—" },
  ];

  return (
    <div className={cn("rounded-xl bg-[color:var(--card)] p-5 border border-white/[0.06]", props.className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-white">回测报告</div>
            <LockBadge reason="backtest_full" strategyId={props.strategyId} className="md:hidden" />
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
            <Info className="size-4" />
            <span>统一指标定义，公开回测假设</span>
          </div>
        </div>
        <Gated
          require="can_export_backtest"
          reason="export_backtest"
          strategyId={props.strategyId}
          deniedMode="BLUR"
          fallback={<BlurredValue text="导出报告" width={110} />}
        >
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 border border-white/[0.06] transition hover:bg-white/10"
          >
            <FileDown className="size-4" />
            导出报告
          </button>
        </Gated>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          <Section title="回测概览">
            <Grid2>
              <KV label="回测区间" value={`${formatDate(bt.period_start)} ~ ${formatDate(bt.period_end)}`} />
              <KV label="回测 ID" value={String(bt.id)} />
              <KV label="策略 ID" value={String(bt.strategy_id)} />
              <KV label="创建时间" value={formatDate(bt.created_at)} />
            </Grid2>
          </Section>

          <Section title="关键绩效指标">
            <div className="grid gap-3 md:grid-cols-4">
              {core.map((m) => (
                <Metric key={m.label} label={m.label} value={m.value} />
              ))}
            </div>

            <div className="mt-4">
              <Gated
                require="can_view_backtest_full"
                reason="backtest_full"
                strategyId={props.strategyId}
                deniedMode="BLUR"
                fallback={<LockedStrip label="更多指标" />}
              >
                <div className="grid gap-3 md:grid-cols-4">
                  {ext.map((m) => (
                    <Metric key={m.label} label={m.label} value={m.value} />
                  ))}
                </div>
              </Gated>
            </div>
          </Section>

          <Section title="假设说明与风险提示">
            <ul className="grid list-disc gap-1 pl-5 text-sm text-white/70">
              <li>历史回测不代表未来表现</li>
              <li>滑点与可成交性不确定，尤其在波动与低流动性时段</li>
              <li>样本与代币池选择会影响结果，需关注选择偏差/幸存者偏差</li>
              <li>本站内容用于研究与教育信息，不构成投资建议</li>
            </ul>
          </Section>
        </div>

        <div className="grid gap-4">
          <Section title="研究提示">
            <div className="text-sm text-white/70">
              所有指标均采用统一定义与年化方式。如需了解详细说明，可查看策略说明页。
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section(props: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
      <div className="text-sm font-semibold text-white">{props.title}</div>
      <div className="mt-3">{props.children}</div>
    </section>
  );
}

function Grid2(props: { children: ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{props.children}</div>;
}

function KV(props: { label: string; value: string; tone?: "muted" }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 border border-white/[0.06]">
      <div className="text-xs text-white/45">{props.label}</div>
      <div className={cn("mt-1 text-sm font-medium text-white tabular-nums", props.tone === "muted" && "text-white/60")}>{props.value}</div>
    </div>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
      <div className="text-xs text-white/45">{props.label}</div>
      <div className="mt-2 text-lg font-semibold text-white tabular-nums">{props.value}</div>
    </div>
  );
}

function LockedStrip(props: { label: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 border border-white/[0.06]">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-white/80">{props.label}</div>
        <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-xs text-[color:var(--accent)]">解锁</span>
      </div>
      <div className="mt-3 grid gap-2">
        <div className="h-2 w-11/12 rounded bg-white/10" />
        <div className="h-2 w-10/12 rounded bg-white/10" />
      </div>
    </div>
  );
}
