import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { listStrategies } from "@/api/strategies";
import { useApi } from "@/hooks/useApi";
import StrategyRankingTable, { type RankingRow } from "@/components/strategy/StrategyRankingTable";

export default function Home() {
  const { data, loading, error, refetch } = useApi(() => listStrategies(1, 100), []);

  const rows = useMemo<RankingRow[]>(() => {
    if (!data) return [];
    return data.items.map((st) => ({
      strategy: st,
    }));
  }, [data]);

  return (
    <div className="grid gap-10">
      {/* Hero section — no container, just typography */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">热门策略榜</h1>
          <div className="mt-2 text-sm text-white/50 max-w-lg">浏览经典交易策略的收益、回撤与风险指标，点击进入详情。</div>
        </div>
        <Link
          to="/methodology"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--accent)] hover:underline shrink-0"
        >
          指标定义与回测假设
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Main content — asymmetric layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {loading ? (
            <div className="rounded-xl bg-[color:var(--card)] p-6">
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-white/[0.04]" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
              <div className="text-sm text-white/70">{error}</div>
              <button
                type="button"
                onClick={refetch}
                className="mt-3 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/80 border border-white/[0.06] transition hover:bg-white/10"
              >
                重试
              </button>
            </div>
          ) : (
            <StrategyRankingTable rows={rows} />
          )}
        </div>

        {/* Sidebar — mixed container styles */}
        <aside className="grid gap-6 content-start">
          <Link
            to="/market-research"
            className="group block rounded-xl border border-white/[0.06] bg-[color:var(--card)] p-5 transition-colors hover:border-[color:var(--accent)]/20"
          >
            <div className="text-base font-semibold text-white">AI 市场研究</div>
            <div className="mt-1 text-xs text-white/50">投研简报 · 每小时更新</div>
            <div className="mt-4 text-sm text-white/55 leading-relaxed">点击进入标题列表，打开弹窗滚动阅读全文。</div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[color:var(--accent)] group-hover:underline">
              查看研究报告
              <ArrowRight className="size-3" />
            </div>
          </Link>

          {/* No-container section — just text with accent borders */}
          <div className="px-1">
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">会员权益</div>
            <div className="mt-3 grid gap-2 text-sm text-white/55">
              <div className="border-l-2 border-[color:var(--success)]/40 pl-3 py-0.5">实时/准实时信号（触发价/强度）</div>
              <div className="border-l-2 border-[color:var(--success)]/40 pl-3 py-0.5">完整回测假设、数据版本</div>
              <div className="border-l-2 border-[color:var(--success)]/40 pl-3 py-0.5">导出/下载与高级筛选</div>
            </div>
            <Link
              to="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-[color:var(--accent)] hover:underline"
            >
              查看定价方案
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
