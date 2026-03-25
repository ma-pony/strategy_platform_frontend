import { Info } from "lucide-react";

import type { StrategyRead, BacktestResultRead } from "@/api/types";
import { formatInt, formatNumber, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function StrategySummaryCard(props: {
  strategy: StrategyRead;
  backtest: BacktestResultRead | null;
  className?: string;
}) {
  const s = props.strategy;
  const bt = props.backtest;

  const heroValue = bt?.total_return != null ? formatPct(bt.total_return * 100) : null;
  const heroTone = bt && bt.total_return != null ? (bt.total_return >= 0 ? "up" : "down") : undefined;

  return (
    <div className={cn("rounded-xl bg-[color:var(--card)] border border-white/[0.06]", props.className)}>
      {/* Top: strategy info + hero metric */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-xl font-bold text-white md:text-2xl tracking-tight">{s.name}</h1>
            {s.strategy_type ? (
              <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-0.5 text-xs text-[color:var(--accent)]">{s.strategy_type}</span>
            ) : null}
          </div>
          {s.pairs.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Info className="size-3.5 text-white/40" />
              {s.pairs.slice(0, 5).map((p) => (
                <span key={p} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-xs text-white/50">{p}</span>
              ))}
              {s.pairs.length > 5 ? <span className="text-xs text-white/50">+{s.pairs.length - 5}</span> : null}
            </div>
          ) : null}
          {s.description ? (
            <div className="mt-3 text-sm text-white/55 max-w-lg">{s.description}</div>
          ) : null}
        </div>

        {/* Hero metric — visually dominant */}
        {heroValue ? (
          <div className="shrink-0 text-right">
            <div className="text-xs text-white/50">总收益</div>
            <div className={cn(
              "mt-1 text-3xl font-bold tabular-nums md:text-4xl",
              heroTone === "up" ? "text-[color:var(--success)]" : heroTone === "down" ? "text-[color:var(--danger)]" : "text-white",
            )}>
              {heroValue}
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom metrics bar — flush, separated */}
      <div className="grid grid-cols-3 border-t border-white/[0.04]">
        <MetricCell
          label="最大回撤"
          value={bt?.max_drawdown != null ? formatPct(-Math.abs(bt.max_drawdown * 100)) : (s.max_drawdown != null ? formatPct(-Math.abs(s.max_drawdown * 100)) : "—")}
          tone="down"
        />
        <MetricCell
          label="Sharpe"
          value={bt?.sharpe_ratio != null ? formatNumber(bt.sharpe_ratio, 2) : (s.sharpe_ratio != null ? formatNumber(s.sharpe_ratio, 2) : "—")}
          border
        />
        <MetricCell
          label="交易次数"
          value={bt?.trade_count != null ? formatInt(bt.trade_count) : (s.trade_count != null ? formatInt(s.trade_count) : "—")}
          border
        />
      </div>
    </div>
  );
}

function MetricCell(props: { label: string; value: string; tone?: "up" | "down"; border?: boolean }) {
  const toneClass = props.tone === "up" ? "text-[color:var(--success)]" : props.tone === "down" ? "text-[color:var(--danger)]" : "text-white";
  return (
    <div className={cn("px-6 py-4", props.border && "border-l border-white/[0.04]")}>
      <div className="text-xs text-white/50">{props.label}</div>
      <div className={cn("mt-1 text-base font-semibold tabular-nums", toneClass)}>{props.value}</div>
    </div>
  );
}
