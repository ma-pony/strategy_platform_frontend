import { useMemo } from "react";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

import { listStrategies } from "@/api/strategies";
import { useApi } from "@/hooks/useApi";
import StrategyRankingTable, { type RankingRow } from "@/components/strategy/StrategyRankingTable";

export default function Home() {
  const { data, loading, error } = useApi(() => listStrategies(1, 100), []);

  const rows = useMemo<RankingRow[]>(() => {
    if (!data) return [];
    return data.items.map((st) => ({
      strategy: st,
    }));
  }, [data]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white md:text-xl">热门策略榜</h1>
            <div className="mt-1 text-sm text-white/60">查看热门经典交易策略排行与关键指标，受限字段点击可解锁。</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10">
            <Info className="size-4" />
            <span>收益/回撤为示例口径；回测假设与版本请在详情页核对</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {loading ? (
            <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-white/5" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-[color:var(--card)] p-6 text-sm text-white/80 ring-1 ring-white/10">{error}</div>
          ) : (
            <StrategyRankingTable rows={rows} />
          )}
        </div>

        <aside className="grid gap-4">
          <Link
            to="/market-research"
            className="rounded-2xl bg-[color:var(--card)] p-4 ring-1 ring-white/10 transition hover:bg-white/5"
          >
            <div className="text-sm font-semibold text-white">AI 市场研究</div>
            <div className="mt-1 text-xs text-white/55">投研简报 · 每小时更新</div>
            <div className="mt-3 text-sm text-white/70">点击进入标题列表，打开弹窗滚动阅读全文。</div>
            <div className="mt-4 grid gap-2 text-xs text-white/60">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">像投研晨报一样分节：观点/动态/数据/事件/风险</div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">研究信息仅供参考，不构成投资建议</div>
            </div>
          </Link>

          <div className="rounded-2xl bg-[color:var(--card)] p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">会员解锁什么</div>
            <div className="mt-2 grid gap-2 text-sm text-white/70">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">实时/准实时信号（触发价/强度）</div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">完整回测假设、数据版本、代币池规则</div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">导出/下载与高级筛选</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
