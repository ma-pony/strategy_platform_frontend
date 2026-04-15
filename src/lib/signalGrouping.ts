import type { SignalRead, StrategyRead } from "@/api/types";

export type SignalsByStrategy = {
  strategy: StrategyRead;
  signal: SignalRead;
};

export type PairGroup = {
  pair: string;
  entries: SignalsByStrategy[];
  consensus: ConsensusResult;
};

export type ConsensusResult = {
  total: number;
  buyCount: number;
  sellCount: number;
  holdCount: number;
  label: string;
  direction: "buy" | "sell" | "mixed" | "hold";
};

export function normalizeDirection(d: string): "buy" | "sell" | "hold" {
  if (d === "long" || d === "buy") return "buy";
  if (d === "short" || d === "sell") return "sell";
  return "hold";
}

export function computeConsensus(entries: SignalsByStrategy[]): ConsensusResult {
  let buyCount = 0;
  let sellCount = 0;
  let holdCount = 0;

  for (const e of entries) {
    const dir = normalizeDirection(e.signal.direction);
    if (dir === "buy") buyCount++;
    else if (dir === "sell") sellCount++;
    else holdCount++;
  }

  const total = entries.length;
  let direction: ConsensusResult["direction"];
  let label: string;

  if (total === 0) {
    direction = "hold";
    label = "无信号";
  } else if (buyCount === total) {
    direction = "buy";
    label = `${total}/${total} 看多`;
  } else if (sellCount === total) {
    direction = "sell";
    label = `${total}/${total} 看空`;
  } else if (buyCount > sellCount && buyCount > holdCount) {
    direction = "buy";
    label = `${buyCount}/${total} 看多`;
  } else if (sellCount > buyCount && sellCount > holdCount) {
    direction = "sell";
    label = `${sellCount}/${total} 看空`;
  } else {
    direction = "mixed";
    label = "观点分歧";
  }

  return { total, buyCount, sellCount, holdCount, label, direction };
}

/**
 * Group signals by pair, picking the latest signal per strategy per pair.
 * Optionally filter by timeframe.
 */
export function groupSignalsByPair(
  signals: SignalRead[],
  strategies: StrategyRead[],
  timeframe?: string,
): PairGroup[] {
  const strategyMap = new Map(strategies.map((s) => [s.id, s]));

  // Filter by timeframe if specified
  const filtered = timeframe
    ? signals.filter((s) => s.timeframe === timeframe)
    : signals;

  // For each (pair, strategy_id), keep only the latest signal
  const latestMap = new Map<string, SignalRead>();
  for (const sig of filtered) {
    const key = `${sig.pair}::${sig.strategy_id}`;
    const existing = latestMap.get(key);
    if (!existing || sig.signal_at > existing.signal_at) {
      latestMap.set(key, sig);
    }
  }

  // Group by pair
  const pairMap = new Map<string, SignalsByStrategy[]>();
  for (const sig of latestMap.values()) {
    const strategy = strategyMap.get(sig.strategy_id);
    if (!strategy) continue;
    const entries = pairMap.get(sig.pair) ?? [];
    entries.push({ strategy, signal: sig });
    pairMap.set(sig.pair, entries);
  }

  // Sort pairs by number of strategies (descending), then alphabetically
  const pairs = Array.from(pairMap.entries())
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([pair, entries]) => ({
      pair,
      entries: entries.sort((a, b) => a.strategy.name.localeCompare(b.strategy.name)),
      consensus: computeConsensus(entries),
    }));

  return pairs;
}

/** Extract unique timeframes from signals */
export function extractTimeframes(signals: SignalRead[]): string[] {
  const set = new Set<string>();
  for (const s of signals) {
    if (s.timeframe) set.add(s.timeframe);
  }
  // Sort by common timeframe order
  const order = ["1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];
  const orderMap = new Map(order.map((t, i) => [t, i]));
  return Array.from(set).sort((a, b) => (orderMap.get(a) ?? 99) - (orderMap.get(b) ?? 99));
}

/** Extract unique pairs from signals */
export function extractPairs(signals: SignalRead[]): string[] {
  const set = new Set<string>();
  for (const s of signals) set.add(s.pair);
  return Array.from(set).sort();
}
