import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { listStrategies, listLatestSignalsPerPair } from "@/api/strategies";
import { useApi } from "@/hooks/useApi";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  groupSignalsByPair,
  extractTimeframes,
  extractPairs,
} from "@/lib/signalGrouping";
import PairFilterBar from "@/components/signals/PairFilterBar";
import TimeframeTabs from "@/components/signals/TimeframeTabs";
import PairGroupComponent from "@/components/signals/PairGroup";

/** Free users see at most this many pair groups */
const FREE_PAIR_LIMIT = 3;
/** Free users see at most this many signals per expanded card */
const FREE_HISTORY_LIMIT = 2;

export default function Home() {
  const [sp, setSp] = useSearchParams();
  const { has } = useEntitlements();
  const canUnlimited = has("can_view_signals_unlimited");

  const [pairFilter, setPairFilter] = useState<string | null>(sp.get("pair") || null);
  const [timeframeFilter, setTimeframeFilter] = useState<string | null>(sp.get("timeframe") || null);

  const { data: strategiesData, loading: loadingStrategies } = useApi(
    () => listStrategies(1, 100),
    [],
  );

  const { data: signalsData, loading: loadingSignals, error, refetch } = useApi(
    () => listLatestSignalsPerPair(timeframeFilter ?? undefined),
    [timeframeFilter],
  );

  const strategies = useMemo(() => strategiesData?.items ?? [], [strategiesData]);
  const signals = useMemo(() => signalsData ?? [], [signalsData]);

  const timeframes = useMemo(() => extractTimeframes(signals), [signals]);
  const allPairs = useMemo(() => extractPairs(signals), [signals]);

  const groups = useMemo(() => {
    let grouped = groupSignalsByPair(signals, strategies, timeframeFilter ?? undefined);
    if (pairFilter) grouped = grouped.filter((g) => g.pair === pairFilter);
    if (!canUnlimited) grouped = grouped.slice(0, FREE_PAIR_LIMIT);
    return grouped;
  }, [signals, strategies, timeframeFilter, pairFilter, canUnlimited]);

  const pairBlocked = !canUnlimited && pairFilter !== null && groups.length === 0 && signals.length > 0;

  const totalGroupCount = useMemo(() => {
    const grouped = groupSignalsByPair(signals, strategies, timeframeFilter ?? undefined);
    return grouped.length;
  }, [signals, strategies, timeframeFilter]);

  const historyLimit = canUnlimited ? 20 : FREE_HISTORY_LIMIT;

  const loading = loadingStrategies || loadingSignals;

  const updateFilter = (key: string, value: string | null) => {
    if (value) {
      sp.set(key, value);
    } else {
      sp.delete(key);
    }
    setSp(sp, { replace: true });
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">信号总览</h1>
        <div className="mt-2 text-sm text-white/50 max-w-lg">
          按币种查看各策略的最新交易信号，对比不同策略的观点，辅助决策参考。
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TimeframeTabs
            timeframes={timeframes}
            active={timeframeFilter}
            onChange={(tf) => {
              setTimeframeFilter(tf);
              updateFilter("timeframe", tf);
            }}
          />
        </div>
        {allPairs.length > 1 ? (
          <PairFilterBar
            pairs={allPairs}
            active={pairFilter}
            onChange={(p) => {
              setPairFilter(p);
              updateFilter("pair", p);
            }}
          />
        ) : null}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-[color:var(--card)] p-6">
              <div className="h-5 w-1/4 animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
                ))}
              </div>
            </div>
          ))}
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
      ) : pairBlocked ? (
        <div className="rounded-xl bg-[color:var(--card)] p-8 border border-white/[0.06] text-center">
          <div className="text-sm text-white/80">免费用户仅可查看前 {FREE_PAIR_LIMIT} 个币种的信号</div>
          <div className="mt-1 text-xs text-white/50">升级会员解锁全部币种</div>
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl bg-[color:var(--card)] p-8 border border-white/[0.06] text-center">
          <div className="text-sm text-white/55">暂无信号数据</div>
          {(pairFilter || timeframeFilter) ? (
            <button
              type="button"
              onClick={() => {
                setPairFilter(null);
                setTimeframeFilter(null);
                sp.delete("pair");
                sp.delete("timeframe");
                setSp(sp, { replace: true });
              }}
              className="mt-3 text-xs text-[color:var(--accent)] hover:underline"
            >
              清除筛选条件
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <PairGroupComponent key={group.pair} group={group} historyLimit={historyLimit} />
          ))}
          {!canUnlimited && !pairFilter && totalGroupCount > FREE_PAIR_LIMIT ? (
            <div className="rounded-xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 p-5 text-center">
              <div className="text-sm text-white/80">免费用户仅可查看 {FREE_PAIR_LIMIT} 个币种的信号</div>
              <div className="mt-1 text-xs text-white/50">升级会员解锁全部币种与完整信号历史</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
