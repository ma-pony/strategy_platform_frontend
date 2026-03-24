import { request } from "./client";
import type { PaginatedData, StrategyRead, BacktestResultRead, SignalRead, PairMetricsRead } from "./types";

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

export async function listSignals(strategyId: number, limit = 20): Promise<{ signals: SignalRead[]; last_updated_at: string | null }> {
  return request<{ signals: SignalRead[]; last_updated_at: string | null }>(`/strategies/${strategyId}/signals`, {
    params: { limit },
  });
}

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
