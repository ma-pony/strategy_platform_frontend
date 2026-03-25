import { request } from "./client";
import type { PaginatedData, SignalRead } from "./types";

type SignalFilters = {
  strategy_id?: number;
  pair?: string;
  timeframe?: string;
  page?: number;
  pageSize?: number;
};

/** GET /signals — global signal listing with optional filters */
export async function listSignals(filters?: SignalFilters): Promise<PaginatedData<SignalRead>> {
  return request<PaginatedData<SignalRead>>("/signals", {
    params: {
      strategy_id: filters?.strategy_id,
      pair: filters?.pair,
      timeframe: filters?.timeframe,
      page: filters?.page || 1,
      page_size: filters?.pageSize || 20,
    },
  });
}

/** GET /signals/:strategyId — paginated signals for a specific strategy */
export async function listSignalsByStrategy(
  strategyId: number,
  page = 1,
  pageSize = 20,
): Promise<PaginatedData<SignalRead>> {
  return request<PaginatedData<SignalRead>>(`/signals/${strategyId}`, {
    params: { page, page_size: pageSize },
  });
}
