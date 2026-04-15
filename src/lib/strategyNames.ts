const STRATEGY_NAME_MAP: Record<string, string> = {
  TurtleTradingStrategy: "海龟交易策略",
  BollingerBandMeanReversionStrategy: "布林带均值回归策略",
  RsiMeanReversionStrategy: "RSI 均值回归策略",
  MacdTrendFollowingStrategy: "MACD 趋势跟踪策略",
  IchimokuCloudTrendStrategy: "一目均衡表趋势策略",
  ParabolicSarTrendStrategy: "抛物线 SAR 趋势策略",
  KeltnerChannelBreakoutStrategy: "肯特纳通道突破策略",
  AroonTrendSystemStrategy: "Aroon 趋势系统策略",
  Nr7VolatilityContractionBreakoutStrategy: "NR7 波动收缩突破策略",
  StochasticOscillatorReversalStrategy: "随机振荡器反转策略",
};

export function getStrategyDisplayName(name: string): string {
  return STRATEGY_NAME_MAP[name] ?? name;
}
