import { request } from "./client";
import type { PaginatedData, StrategyRead, BacktestResultRead, SignalsWithTimestamp, PairMetricsRead } from "./types";

export async function listStrategies(page = 1, pageSize = 20): Promise<PaginatedData<StrategyRead>> {
  return request<PaginatedData<StrategyRead>>("/strategies", {
    params: { page, page_size: pageSize },
  });
}

export async function getStrategy(strategyId: number): Promise<StrategyRead> {
  return request<StrategyRead>(`/strategies/${strategyId}`);
}

export async function listBacktests(strategyId: number, page = 1, pageSize = 20): Promise<PaginatedData<BacktestResultRead>> {
  return request<PaginatedData<BacktestResultRead>>(`/strategies/${strategyId}/backtests`, {
    params: { page, page_size: pageSize },
  });
}

export async function getBacktest(backtestId: number): Promise<BacktestResultRead> {
  return request<BacktestResultRead>(`/backtests/${backtestId}`);
}

/** GET /strategies/:id/signals — latest N signals (not paginated) */
export async function listSignals(strategyId: number, limit = 20): Promise<SignalsWithTimestamp> {
  return request<SignalsWithTimestamp>(`/strategies/${strategyId}/signals`, {
    params: { limit },
  });
}

/** GET /strategies/:id/pair-metrics — paginated with optional filters */
export async function listPairMetrics(
  strategyId: number,
  opts?: { pair?: string; timeframe?: string; page?: number; pageSize?: number }
): Promise<PaginatedData<PairMetricsRead>> {
  return request<PaginatedData<PairMetricsRead>>(`/strategies/${strategyId}/pair-metrics`, {
    params: {
      pair: opts?.pair,
      timeframe: opts?.timeframe,
      page: opts?.page || 1,
      page_size: opts?.pageSize || 20,
    },
  });
}

/** GET /strategies/:id/pair-metrics/:pair/:timeframe — single pair metric */
export async function getPairMetric(
  strategyId: number,
  pair: string,
  timeframe: string,
): Promise<PairMetricsRead> {
  const encodedPair = encodeURIComponent(pair);
  return request<PairMetricsRead>(`/strategies/${strategyId}/pair-metrics/${encodedPair}/${timeframe}`);
}
