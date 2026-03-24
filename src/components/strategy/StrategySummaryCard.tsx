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

  return (
    <div className={cn("rounded-2xl bg-[color:var(--card)] p-5 ring-1 ring-white/10", props.className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-white md:text-xl">{s.name}</h1>
            {s.strategy_type ? (
              <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/70 ring-1 ring-white/10">{s.strategy_type}</span>
            ) : null}
          </div>
          {s.pairs.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <Info className="size-4 text-white/55" />
              {s.pairs.slice(0, 5).map((p) => (
                <span key={p} className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/60 ring-1 ring-white/10">{p}</span>
              ))}
              {s.pairs.length > 5 ? <span className="text-xs text-white/45">+{s.pairs.length - 5}</span> : null}
            </div>
          ) : null}
          {s.description ? (
            <div className="mt-3 text-sm text-white/75">{s.description}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MetricCard
          label="总收益"
          value={bt?.total_return != null ? formatPct(bt.total_return * 100) : "—"}
          tone={bt && bt.total_return != null ? (bt.total_return >= 0 ? "up" : "down") : undefined}
        />
        <MetricCard
          label="最大回撤"
          value={bt?.max_drawdown != null ? formatPct(-Math.abs(bt.max_drawdown * 100)) : (s.max_drawdown != null ? formatPct(-Math.abs(s.max_drawdown * 100)) : "—")}
          tone="down"
        />
        <MetricCard
          label="Sharpe"
          value={bt?.sharpe_ratio != null ? formatNumber(bt.sharpe_ratio, 2) : (s.sharpe_ratio != null ? formatNumber(s.sharpe_ratio, 2) : "—")}
        />
        <MetricCard
          label="交易次数"
          value={bt?.trade_count != null ? formatInt(bt.trade_count) : (s.trade_count != null ? formatInt(s.trade_count) : "—")}
        />
      </div>
    </div>
  );
}

function MetricCard(props: { label: string; value: string; tone?: "up" | "down" }) {
  const toneClass = props.tone === "up" ? "text-[color:var(--success)]" : props.tone === "down" ? "text-[color:var(--danger)]" : "text-white";
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-xs text-white/55">{props.label}</div>
      <div className={cn("mt-2 text-lg font-semibold tabular-nums", toneClass)}>{props.value}</div>
    </div>
  );
}
