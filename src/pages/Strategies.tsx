import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { listStrategies } from "@/api/strategies";
import { useApi } from "@/hooks/useApi";
import { formatPct, formatNumber, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Strategies() {
  const { data, loading, error, refetch } = useApi(() => listStrategies(1, 100), []);

  const strategies = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">策略来源</h1>
        <div className="mt-2 text-sm text-white/50 max-w-lg">
          了解信号背后的策略逻辑，每个策略基于不同的交易理论和技术指标产生信号。
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-[color:var(--card)] p-5">
              <div className="h-5 w-2/3 animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/[0.04]" />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-10 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-10 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
          <div className="text-sm text-white/70">{error}</div>
          <button type="button" onClick={refetch} className="mt-3 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/80 border border-white/[0.06] transition hover:bg-white/10">
            重试
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((st) => (
            <Link
              key={st.id}
              to={`/strategies/${st.id}`}
              className="group rounded-xl border border-white/[0.06] bg-[color:var(--card)] p-5 transition-colors hover:border-[color:var(--accent)]/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{st.name}</div>
                  {st.strategy_type ? (
                    <span className="mt-1 inline-block rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/60 border border-white/[0.08]">
                      {st.strategy_type}
                    </span>
                  ) : null}
                </div>
                <ArrowRight className="size-4 text-white/30 transition group-hover:text-[color:var(--accent)]" />
              </div>

              {st.description ? (
                <div className="mt-3 line-clamp-2 text-xs text-white/55 leading-relaxed">{st.description}</div>
              ) : null}

              {/* Pairs */}
              {st.pairs.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {st.pairs.slice(0, 4).map((p) => (
                    <span key={p} className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/50 border border-white/[0.06]">
                      {p}
                    </span>
                  ))}
                  {st.pairs.length > 4 ? <span className="text-xs text-white/40">+{st.pairs.length - 4}</span> : null}
                </div>
              ) : null}

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
                <div>
                  <div className="text-xs text-white/40">收益率</div>
                  <div className={cn(
                    "mt-0.5 text-sm tabular-nums",
                    st.total_return == null ? "text-white/50" : st.total_return >= 0 ? "text-[color:var(--success)]" : "text-[color:var(--danger)]",
                  )}>
                    {st.total_return != null ? formatPct(st.total_return * 100) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40">Sharpe</div>
                  <div className="mt-0.5 text-sm text-white/80 tabular-nums">
                    {st.sharpe_ratio != null ? formatNumber(st.sharpe_ratio, 2) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40">最大回撤</div>
                  <div className="mt-0.5 text-sm text-white/80 tabular-nums">
                    {st.max_drawdown != null ? formatPct(-Math.abs(st.max_drawdown * 100)) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40">交易数</div>
                  <div className="mt-0.5 text-sm text-white/80 tabular-nums">
                    {st.trade_count != null ? formatInt(st.trade_count) : "—"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Methodology & Risk Disclosure */}
      <div id="methodology" className="grid gap-6 border-t border-white/[0.06] pt-8">
        <h2 className="text-lg font-semibold text-white">指标定义与风险提示</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-[color:var(--card)] p-4">
            <div className="text-sm font-medium text-white mb-2">指标定义</div>
            <div className="grid gap-2 text-xs text-white/60 leading-relaxed">
              <div><span className="text-white/80">收益率：</span>回测期内策略总收益（含费用），即末期资金 / 初始资金 − 1。</div>
              <div><span className="text-white/80">年化收益 (CAGR)：</span>按复利折算的年均收益率。</div>
              <div><span className="text-white/80">最大回撤：</span>回测期内资金曲线从峰值到谷值的最大跌幅。</div>
              <div><span className="text-white/80">Sharpe Ratio：</span>超额收益与波动率之比，衡量风险调整后收益。</div>
              <div><span className="text-white/80">胜率：</span>盈利交易次数 / 总交易次数。</div>
              <div><span className="text-white/80">置信度：</span>策略对当前信号方向的确信程度（0–100%）。</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[color:var(--card)] p-4">
            <div className="text-sm font-medium text-white mb-2">回测假设</div>
            <div className="grid gap-2 text-xs text-white/60 leading-relaxed">
              <div><span className="text-white/80">费用模型：</span>每笔交易按 0.1% 手续费 + 0.05% 滑点计入成本。</div>
              <div><span className="text-white/80">数据来源：</span>历史 K 线数据，不含实时行情延迟。</div>
              <div><span className="text-white/80">信号执行：</span>假定信号触发后按下一根 K 线开盘价成交。</div>
              <div><span className="text-white/80">仓位管理：</span>每次满仓交易，不含杠杆。</div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-400" />
          <div className="grid gap-1.5 text-xs text-white/60 leading-relaxed">
            <div className="text-sm font-medium text-yellow-400">免责声明与风险提示</div>
            <div>本平台所有策略信号、回测数据和市场研究仅供参考，不构成任何投资建议。</div>
            <div>历史回测表现不代表未来收益，实际交易可能因市场流动性、延迟等因素产生差异。</div>
            <div>加密货币交易存在高风险，可能导致全部本金损失，请谨慎决策。</div>
          </div>
        </div>
      </div>
    </div>
  );
}
