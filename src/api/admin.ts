import { request } from "./client";
import type {
  PaginatedData,
  BacktestTaskRead,
  ReportDetailRead,
  ReportCreateInput,
  ReportUpdateInput,
} from "./types";

// ---- Backtest tasks ----

/** POST /admin/backtests — submit a new backtest task */
export async function createBacktestTask(
  strategyId: number,
  timerange: string,
): Promise<BacktestTaskRead> {
  return request<BacktestTaskRead>("/admin/backtests", {
    method: "POST",
    body: { strategy_id: strategyId, timerange },
  });
}

/** GET /admin/backtests — list backtest tasks */
export async function listBacktestTasks(opts?: {
  page?: number;
  pageSize?: number;
  strategy_name?: string;
  status?: string;
}): Promise<PaginatedData<BacktestTaskRead>> {
  return request<PaginatedData<BacktestTaskRead>>("/admin/backtests", {
    params: {
      page: opts?.page || 1,
      page_size: opts?.pageSize || 20,
      strategy_name: opts?.strategy_name,
      status: opts?.status,
    },
  });
}

/** GET /admin/backtests/:taskId — get backtest task detail */
export async function getBacktestTask(taskId: number): Promise<BacktestTaskRead> {
  return request<BacktestTaskRead>(`/admin/backtests/${taskId}`);
}

// ---- Reports ----

/** POST /admin/reports — create a report */
export async function createReport(input: ReportCreateInput): Promise<ReportDetailRead> {
  return request<ReportDetailRead>("/admin/reports", {
    method: "POST",
    body: input,
  });
}

/** PUT /admin/reports/:reportId — update a report */
export async function updateReport(
  reportId: number,
  input: ReportUpdateInput,
): Promise<ReportDetailRead> {
  return request<ReportDetailRead>(`/admin/reports/${reportId}`, {
    method: "PUT",
    body: input,
  });
}

/** DELETE /admin/reports/:reportId — delete a report */
export async function deleteReport(
  reportId: number,
): Promise<{ id: number; deleted: boolean }> {
  return request<{ id: number; deleted: boolean }>(`/admin/reports/${reportId}`, {
    method: "DELETE",
  });
}

// ---- Signals ----

/** POST /admin/signals/refresh — trigger async signal refresh */
export async function refreshSignals(): Promise<{ task_id: string; message: string }> {
  return request<{ task_id: string; message: string }>("/admin/signals/refresh", {
    method: "POST",
  });
}
