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
  task_id: string | null;
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

/** Signal from GET /strategies/:id/signals */
export type SignalRead = {
  id: number;
  strategy_id: number;
  pair: string;
  timeframe: string;
  signal_type: string;
  bar_timestamp: string;
  generated_at: string;
  confidence_score: number | null;
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
  data_source: string | null;
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
