export type Strategy = {
  id: string;
  name: string;
  symbol: string;
  timeframe: string;
  creatorName: string;
  strategyType: string;
  advantages: string;
  description: string;
  downloadUrl: string;
  tags: string[];
  popularityScore: number;
};

export type StrategySnapshot = {
  strategyId: string;
  asOf: string;
  returnPct: number;
  maxDrawdownPct: number;
  sharpe: number;
  trades: number;
  lastSignalTs: string;
};

export type SignalAction = "buy" | "sell" | "hold";

export type Signal = {
  id: string;
  strategyId: string;
  ts: string;
  action: SignalAction;
  price: number;
  strength: number;
  note?: string;
};

export type UniversePool = {
  id: string;
  name: string;
  market: "crypto" | "equity" | "fx" | "futures";
  asOf: string;
  ruleJson: Record<string, unknown>;
};

export type BacktestRun = {
  id: string;
  strategyId: string;
  universePoolId: string;
  strategyVersion: string;
  startTs: string;
  endTs: string;
  initialCapital: number;
  feeBps: number;
  slippageModel: string;
  slippageBps: number;
  leverage: number;
  allowShort: boolean;
  dataVendor: string;
  dataVersion: string;
};

export type BacktestMetric = {
  id: string;
  backtestRunId: string;
  metricName: string;
  metricValue: number;
  unit?: string;
};

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: number) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const STRATEGIES: Strategy[] = [
  {
    id: "turtle_trading",
    name: "海龟交易（唐奇安突破趋势跟随）",
    symbol: "ES",
    timeframe: "1D",
    creatorName: "Richard Dennis / William Eckhardt",
    strategyType: "trend_following",
    advantages: "规则简单、可执行性强；利用突破捕捉大趋势，并用 ATR 进行仓位与风险控制。",
    description:
      "以唐奇安通道突破为核心信号，结合波动率（ATR）进行仓位控制与止损/加仓，强调纪律与风险约束。",
    downloadUrl: "https://example.com/downloads/turtle_trading.zip",
    tags: ["breakout", "donchian", "atr_position_sizing", "systematic"],
    popularityScore: 98,
  },
  {
    id: "bollinger_band_mean_reversion",
    name: "布林带均值回归",
    symbol: "SPY",
    timeframe: "1D",
    creatorName: "John Bollinger",
    strategyType: "mean_reversion",
    advantages: "适合震荡期；可与波动率过滤结合；对仓位与风控有清晰约束。",
    description:
      "当价格触及或跌破下轨时尝试反转，触及上轨时止盈/反向；可配合趋势过滤与止损减少单边趋势中的回撤。",
    downloadUrl: "https://example.com/downloads/bollinger_band_mean_reversion.zip",
    tags: ["bollinger_bands", "volatility", "reversion"],
    popularityScore: 92,
  },
  {
    id: "rsi_mean_reversion",
    name: "RSI 超买超卖均值回归",
    symbol: "AAPL",
    timeframe: "4H",
    creatorName: "J. Welles Wilder",
    strategyType: "mean_reversion",
    advantages: "解释直观；对不同市场通用；容易做参数稳健性与样本外验证。",
    description:
      "使用 RSI 指标识别超买/超卖区域，结合阈值与时间窗口进行反转交易；需要配套的趋势过滤与风控。",
    downloadUrl: "https://example.com/downloads/rsi_mean_reversion.zip",
    tags: ["rsi", "oscillator", "reversion"],
    popularityScore: 89,
  },
  {
    id: "macd_trend_following",
    name: "MACD 趋势跟随",
    symbol: "BTC-USD",
    timeframe: "1D",
    creatorName: "Gerald Appel",
    strategyType: "trend_following",
    advantages: "趋势识别稳定；容易与风险预算/过滤器组合；适用于多周期研究。",
    description:
      "通过 EMA 差值与信号线交叉识别趋势变化，并用柱体强弱辅助过滤；常与止损、波动率控制配合。",
    downloadUrl: "https://example.com/downloads/macd_trend_following.zip",
    tags: ["macd", "ema", "momentum"],
    popularityScore: 87,
  },
  {
    id: "ichimoku_cloud_trend",
    name: "一目均衡表趋势策略",
    symbol: "USDJPY",
    timeframe: "4H",
    creatorName: "Goichi Hosoda",
    strategyType: "trend_following",
    advantages: "信号体系完整；同时给出趋势与支撑阻力；适合与仓位管理结合。",
    description:
      "利用云层、转换线/基准线与延迟线的相对位置判断趋势与关键支撑阻力区域，提供结构化的入场与离场信号。",
    downloadUrl: "https://example.com/downloads/ichimoku_cloud_trend.zip",
    tags: ["ichimoku", "trend", "support_resistance"],
    popularityScore: 85,
  },
  {
    id: "parabolic_sar_trend",
    name: "抛物线转向（SAR）趋势跟随",
    symbol: "GC",
    timeframe: "1D",
    creatorName: "J. Welles Wilder",
    strategyType: "trend_following",
    advantages: "止损与跟踪逻辑清晰；适合强趋势；可用于系统化风险控制。",
    description:
      "用抛物线 SAR 点位作为跟踪止损与趋势反转信号，强调顺势持有与在反转时退出。",
    downloadUrl: "https://example.com/downloads/parabolic_sar_trend.zip",
    tags: ["parabolic_sar", "trailing_stop", "trend"],
    popularityScore: 83,
  },
  {
    id: "keltner_channel_breakout",
    name: "凯尔特纳通道突破",
    symbol: "NQ",
    timeframe: "4H",
    creatorName: "Chester W. Keltner",
    strategyType: "breakout",
    advantages: "通道适配波动；突破触发明确；可与趋势过滤组合提升稳定性。",
    description:
      "以 EMA 为中轴并结合 ATR 构造通道，当价格突破通道上下轨触发入场；适合捕捉波动扩张阶段。",
    downloadUrl: "https://example.com/downloads/keltner_channel_breakout.zip",
    tags: ["keltner_channel", "atr", "breakout"],
    popularityScore: 82,
  },
  {
    id: "aroon_trend_system",
    name: "Aroon 趋势识别与跟随",
    symbol: "EURUSD",
    timeframe: "1D",
    creatorName: "Tushar Chande",
    strategyType: "trend_following",
    advantages: "趋势强度刻画直观；可用于趋势过滤；适合跨市场比较。",
    description:
      "Aroon Up/Down 衡量近期新高/新低出现的位置，用于识别趋势开始与结束，并辅助构建顺势交易规则。",
    downloadUrl: "https://example.com/downloads/aroon_trend_system.zip",
    tags: ["aroon", "trend_strength", "breakout"],
    popularityScore: 80,
  },
  {
    id: "nr7_volatility_contraction_breakout",
    name: "NR7 窄幅波动收缩—突破",
    symbol: "SPY",
    timeframe: "1D",
    creatorName: "Toby Crabel",
    strategyType: "breakout",
    advantages: "抓波动扩张；入场点清晰；可与趋势方向过滤结合。",
    description:
      "识别 NR7（近 7 日最小区间）作为波动收缩信号，随后以突破触发入场；强调风险控制与过滤条件。",
    downloadUrl: "https://example.com/downloads/nr7_volatility_contraction_breakout.zip",
    tags: ["volatility", "nr7", "breakout"],
    popularityScore: 78,
  },
  {
    id: "stochastic_oscillator_reversal",
    name: "随机指标反转/背离策略",
    symbol: "TSLA",
    timeframe: "4H",
    creatorName: "George Lane",
    strategyType: "mean_reversion",
    advantages: "可解释性强；适合震荡；可通过背离提高信号质量。",
    description:
      "使用随机指标在超买/超卖区域寻找反转或背离信号，常结合趋势过滤与止损规则提升适用范围。",
    downloadUrl: "https://example.com/downloads/stochastic_oscillator_reversal.zip",
    tags: ["stochastic", "oscillator", "divergence"],
    popularityScore: 76,
  },
];

export const UNIVERSE_POOLS: UniversePool[] = [
  {
    id: "pool_crypto_largecap_2026_03",
    name: "Crypto Large Cap (Top 50)",
    market: "crypto",
    asOf: isoDaysAgo(6),
    ruleJson: {
      include: "top_50_by_marketcap",
      rebalance: "weekly",
      exclusions: ["stablecoins"],
    },
  },
  {
    id: "pool_equity_liquid_2026_03",
    name: "US Liquid Equity (Large)",
    market: "equity",
    asOf: isoDaysAgo(8),
    ruleJson: {
      include: "large_cap_liquid",
      rebalance: "monthly",
      exclusions: ["penny_stocks"],
    },
  },
];

function pickPoolForStrategy(strategyId: string) {
  const h = hashString(strategyId);
  return h % 2 === 0 ? UNIVERSE_POOLS[0] : UNIVERSE_POOLS[1];
}

export const STRATEGY_SNAPSHOTS: StrategySnapshot[] = STRATEGIES.map((s) => {
  const r = prng(hashString(s.id));
  const returnPct = (r() * 1.6 - 0.2) * 100;
  const maxDd = Math.min(55, Math.max(5, r() * 45));
  const sharpe = Math.max(-0.3, r() * 2.2);
  const trades = Math.round(40 + r() * 260);

  return {
    strategyId: s.id,
    asOf: isoDaysAgo(1),
    returnPct: Number(returnPct.toFixed(2)),
    maxDrawdownPct: Number(maxDd.toFixed(2)),
    sharpe: Number(sharpe.toFixed(2)),
    trades,
    lastSignalTs: isoDaysAgo(Math.round(r() * 5)),
  };
});

export const SIGNALS: Signal[] = (() => {
  const out: Signal[] = [];
  for (const s of STRATEGIES) {
    const r = prng(hashString(`signals:${s.id}`));
    const base = 70 + r() * 380;
    const drift = (r() * 2 - 1) * 0.02;
    let price = base;

    for (let i = 90; i >= 0; i--) {
      price = Math.max(1, price * (1 + drift + (r() * 2 - 1) * 0.018));
      const dice = r();
      const action: SignalAction = dice > 0.92 ? "buy" : dice < 0.08 ? "sell" : "hold";
      const strength = Math.min(1, Math.max(0, 0.35 + (r() * 2 - 1) * 0.45));

      if (action === "hold" && r() > 0.35) continue;

      out.push({
        id: `${s.id}:${i}`,
        strategyId: s.id,
        ts: isoDaysAgo(i),
        action,
        price: Number(price.toFixed(2)),
        strength: Number(strength.toFixed(2)),
      });
    }
  }
  out.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return out;
})();

export const BACKTEST_RUNS: BacktestRun[] = STRATEGIES.map((s) => {
  const r = prng(hashString(`run:${s.id}`));
  const pool = pickPoolForStrategy(s.id);
  const days = 365 * (2 + Math.round(r() * 3));
  const start = new Date();
  start.setDate(start.getDate() - days);
  const end = new Date();
  end.setDate(end.getDate() - 1);

  return {
    id: `run_${s.id}`,
    strategyId: s.id,
    universePoolId: pool.id,
    strategyVersion: `v${1 + Math.floor(r() * 3)}.${Math.floor(r() * 10)}`,
    startTs: start.toISOString(),
    endTs: end.toISOString(),
    initialCapital: 10000,
    feeBps: Number((0.5 + r() * 2.2).toFixed(2)),
    slippageModel: "bps",
    slippageBps: Number((0.5 + r() * 3.5).toFixed(2)),
    leverage: Number((1 + r() * 1.5).toFixed(2)),
    allowShort: r() > 0.55,
    dataVendor: "DemoVendor",
    dataVersion: `2026.03.${10 + Math.floor(r() * 10)}`,
  };
});

export const BACKTEST_METRICS: BacktestMetric[] = (() => {
  const out: BacktestMetric[] = [];
  for (const run of BACKTEST_RUNS) {
    const r = prng(hashString(`metrics:${run.id}`));
    const baseReturn = (r() * 1.8 - 0.25) * 100;
    const maxDd = Math.min(65, Math.max(5, r() * 55));
    const sharpe = Math.max(-0.4, r() * 2.4);
    const trades = Math.round(40 + r() * 320);

    out.push(
      { id: `${run.id}:return_pct`, backtestRunId: run.id, metricName: "return_pct", metricValue: Number(baseReturn.toFixed(2)), unit: "%" },
      {
        id: `${run.id}:max_drawdown_pct`,
        backtestRunId: run.id,
        metricName: "max_drawdown_pct",
        metricValue: Number(maxDd.toFixed(2)),
        unit: "%",
      },
      { id: `${run.id}:sharpe`, backtestRunId: run.id, metricName: "sharpe", metricValue: Number(sharpe.toFixed(2)) },
      { id: `${run.id}:trades`, backtestRunId: run.id, metricName: "trades", metricValue: trades },
      { id: `${run.id}:win_rate`, backtestRunId: run.id, metricName: "win_rate", metricValue: Number((0.35 + r() * 0.4).toFixed(2)), unit: "" },
      {
        id: `${run.id}:profit_factor`,
        backtestRunId: run.id,
        metricName: "profit_factor",
        metricValue: Number((0.9 + r() * 1.8).toFixed(2)),
      },
      { id: `${run.id}:calmar`, backtestRunId: run.id, metricName: "calmar", metricValue: Number((0.2 + r() * 2.3).toFixed(2)) },
      { id: `${run.id}:sortino`, backtestRunId: run.id, metricName: "sortino", metricValue: Number((0.1 + r() * 3.0).toFixed(2)) },
    );
  }
  return out;
})();

export function getStrategyById(strategyId: string) {
  return STRATEGIES.find((s) => s.id === strategyId) ?? null;
}

export function getSnapshotByStrategyId(strategyId: string) {
  return STRATEGY_SNAPSHOTS.find((s) => s.strategyId === strategyId) ?? null;
}

export function getSignalsByStrategyId(strategyId: string) {
  return SIGNALS.filter((s) => s.strategyId === strategyId);
}

export function getBacktestRunByStrategyId(strategyId: string) {
  return BACKTEST_RUNS.find((r) => r.strategyId === strategyId) ?? null;
}

export function getUniversePoolById(poolId: string) {
  return UNIVERSE_POOLS.find((p) => p.id === poolId) ?? null;
}

export function getMetricsByRunId(runId: string) {
  return BACKTEST_METRICS.filter((m) => m.backtestRunId === runId);
}
