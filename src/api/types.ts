/** Paginated response wrapper from backend */
export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};

/** Strategy as returned by GET /strategies */
export type StrategyRead = {
  id: number;
  name: string;
  description: string | null;
  pairs: string[];
  strategy_type: string | null;
  trade_count: number | null;
  max_drawdown: number | null;
  sharpe_ratio: number | null;
  win_rate: number | null;
};

/** Backtest result from GET /strategies/:id/backtests */
export type BacktestResultRead = {
  id: number;
  strategy_id: number;
  task_id: number | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string | null;
  total_return: number | null;
  trade_count: number | null;
  max_drawdown: number | null;
  sharpe_ratio: number | null;
  win_rate: number | null;
  annual_return: number | null;
};

/**
 * Signal from GET /strategies/:id/signals
 * Backend returns internal field names: direction, signal_at, created_at
 */
export type SignalRead = {
  id: number;
  strategy_id: number;
  pair: string;
  timeframe: string | null;
  direction: "buy" | "sell" | "hold";
  signal_at: string;
  created_at: string;
  confidence_score: number | null;
};

/** Wrapper for GET /strategies/:id/signals response */
export type SignalsWithTimestamp = {
  signals: SignalRead[];
  last_updated_at: string | null;
};

/** Report list item from GET /reports */
export type ReportRead = {
  id: number;
  title: string;
  summary: string;
  generated_at: string;
  related_coins: string[];
};

/** Report detail from GET /reports/:id */
export type ReportDetailRead = ReportRead & {
  content: string;
};

/** Pair metrics from GET /strategies/:id/pair-metrics */
export type PairMetricsRead = {
  pair: string;
  timeframe: string;
  total_return: number | null;
  trade_count: number | null;
  profit_factor: number | null;
  data_source: "backtest" | "live" | null;
  max_drawdown: number | null;
  sharpe_ratio: number | null;
  last_updated_at: string | null;
};

/** Auth types */
export type UserRead = {
  id: number;
  email: string;
  membership: string;
  created_at: string | null;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AccessToken = {
  access_token: string;
  token_type: string;
};

// ---- Admin types ----

export type BacktestResultSummary = {
  total_return: number | null;
  annual_return: number | null;
  sharpe_ratio: number | null;
  max_drawdown: number | null;
  trade_count: number | null;
  win_rate: number | null;
};

export type BacktestTaskStatus = "pending" | "running" | "done" | "failed";

export type BacktestTaskRead = {
  id: number;
  strategy_id: number;
  status: BacktestTaskStatus;
  timerange: string | null;
  error_message: string | null;
  result_summary: BacktestResultSummary | null;
  created_at: string;
  updated_at: string;
};

export type ReportCreateInput = {
  title: string;
  summary: string;
  content: string;
  related_coins?: string[];
};

export type ReportUpdateInput = {
  title?: string | null;
  summary?: string | null;
  content?: string | null;
  related_coins?: string[] | null;
};
