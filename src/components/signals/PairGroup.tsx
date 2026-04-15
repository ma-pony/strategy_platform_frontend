import { useCallback, useRef, useState } from "react";

import type { PairGroup as PairGroupType } from "@/lib/signalGrouping";
import type { SignalRead } from "@/api/types";
import { listSignalsPage } from "@/api/strategies";
import ConsensusLabel from "./ConsensusLabel";
import SignalCard from "./SignalCard";
import SignalCardExpanded from "./SignalCardExpanded";

export default function PairGroup({ group, historyLimit = 20 }: { group: PairGroupType; historyLimit?: number }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [recentSignals, setRecentSignals] = useState<SignalRead[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const fetchId = useRef(0);

  const handleToggle = useCallback(
    (idx: number) => {
      if (expandedIdx === idx) {
        setExpandedIdx(null);
        return;
      }
      setExpandedIdx(idx);
      const entry = group.entries[idx];
      const id = ++fetchId.current;
      setLoadingRecent(true);
      listSignalsPage({ pair: group.pair, pageSize: historyLimit * 5 })
        .then((res) => {
          if (id !== fetchId.current) return;
          const filtered = res.items
            .filter((s) => s.strategy_id === entry.strategy.id && (!entry.signal.timeframe || s.timeframe === entry.signal.timeframe))
            .slice(0, historyLimit);
          setRecentSignals(filtered);
        })
        .catch(() => {
          if (id !== fetchId.current) return;
          setRecentSignals([]);
        })
        .finally(() => {
          if (id !== fetchId.current) return;
          setLoadingRecent(false);
        });
    },
    [expandedIdx, group, historyLimit],
  );

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[color:var(--card)]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-white">{group.pair}</span>
          <span className="text-xs text-white/40">{group.entries.length} 个策略</span>
        </div>
        <ConsensusLabel consensus={group.consensus} />
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.entries.map((entry, idx) => (
          <div key={entry.strategy.id}>
            <SignalCard
              entry={entry}
              isExpanded={expandedIdx === idx}
              onToggle={() => handleToggle(idx)}
            />
            {expandedIdx === idx ? (
              loadingRecent ? (
                <div className="px-3 py-2">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                </div>
              ) : (
                <SignalCardExpanded entry={entry} recentSignals={recentSignals} historyLimit={historyLimit} />
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
