import { useNavigate } from "react-router-dom";

import type { StrategyRead } from "@/api/types";
import { cn } from "@/lib/utils";
import { formatInt, formatNumber, formatPct } from "@/lib/format";
import { usePaywall } from "@/hooks/usePaywall";


export type RankingRow = {
  strategy: StrategyRead;
};

export default function StrategyRankingTable(props: { rows: RankingRow[]; className?: string }) {
  const { open } = usePaywall();
  const navigate = useNavigate();

  return (
    <div className={cn("overflow-hidden rounded-xl bg-[color:var(--card)] border border-white/[0.06]", props.className)}>
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-white tracking-tight">热门策略榜</div>
          <div className="mt-0.5 text-xs text-white/45">点击行查看策略详情与信号图表</div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-white/45 md:flex">
          <span className="rounded-full bg-white/[0.04] px-2.5 py-1">点击行进入详情</span>
          <span className="rounded-full bg-white/[0.04] px-2.5 py-1">部分字段需升级查看</span>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[1020px] border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs text-white/55">
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">排名</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">策略</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">类型</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">交易对</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">收益率</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">年化(CAGR)</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">交易数</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">回撤</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">Sharpe</th>
              <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">胜率</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((r, idx) => {
              const st = r.strategy;
              return (
                <tr
                  key={st.id}
                  tabIndex={0}
                  aria-label={`查看策略 ${st.name}`}
                  className="group cursor-pointer text-sm text-white/85 hover:bg-white/5"
                  onClick={() => navigate(`/strategies/${st.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/strategies/${st.id}`);
                    }
                  }}
                >
                  <td className="border-t border-white/[0.06] px-4 py-3 text-white/70 tabular-nums">{idx + 1}</td>
                  <td className="border-t border-white/[0.06] px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">{st.name}</div>
                      {st.description ? (
                        <div className="mt-0.5 truncate text-xs text-white/55">{st.description}</div>
                      ) : null}
                    </div>
                  </td>
                  <td className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/70">
                    {st.strategy_type ? (
                      <span className="rounded-full bg-white/5 px-2 py-1 border border-white/[0.08]">{st.strategy_type}</span>
                    ) : "—"}
                  </td>
                  <td className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/70">
                    <div className="flex flex-wrap gap-1">
                      {st.pairs.slice(0, 3).map((p) => (
                        <span key={p} className="rounded bg-white/5 px-1.5 py-0.5 text-xs border border-white/[0.08]">{p}</span>
                      ))}
                      {st.pairs.length > 3 ? <span className="text-white/45">+{st.pairs.length - 3}</span> : null}
                    </div>
                  </td>
                  <td
                    className={cn(
                      "border-t border-white/[0.06] px-4 py-3 text-sm tabular-nums",
                      st.total_return == null
                        ? "text-white/85"
                        : st.total_return >= 0
                          ? "text-[color:var(--success)]"
                          : "text-[color:var(--danger)]",
                    )}
                  >
                    {st.total_return != null ? formatPct(st.total_return * 100) : "—"}
                  </td>
                  <td
                    className={cn(
                      "border-t border-white/[0.06] px-4 py-3 text-sm tabular-nums",
                      st.annual_return == null
                        ? "text-white/85"
                        : st.annual_return >= 0
                          ? "text-[color:var(--success)]"
                          : "text-[color:var(--danger)]",
                    )}
                  >
                    {st.annual_return != null ? formatPct(st.annual_return * 100) : "—"}
                  </td>
                  <td className="border-t border-white/[0.06] px-4 py-3 text-sm text-white/85 tabular-nums">
                    {st.trade_count != null ? formatInt(st.trade_count) : "—"}
                  </td>
                  <td className="border-t border-white/[0.06] px-4 py-3 text-sm text-white/85 tabular-nums">
                    {st.max_drawdown != null ? formatPct(-Math.abs(st.max_drawdown * 100)) : "—"}
                  </td>
                  <td className="border-t border-white/[0.06] px-4 py-3 text-sm text-white/85 tabular-nums">
                    {st.sharpe_ratio != null ? formatNumber(st.sharpe_ratio, 2) : "—"}
                  </td>
                  <td className="border-t border-white/[0.06] px-4 py-3 text-sm text-white/85 tabular-nums">
                    {st.win_rate != null ? formatPct(st.win_rate * 100) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {props.rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/55">暂无策略数据。</div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3">
        <div className="text-xs text-white/45">部分指标为会员专属，点击可了解详情。</div>
        <button
          type="button"
          onClick={() => open({ reason: "advanced_filters", returnTo: "/" })}
          className="hidden rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80 border border-white/[0.08] transition hover:bg-white/10 md:inline-flex"
        >
          高级筛选
        </button>
      </div>
    </div>
  );
}
