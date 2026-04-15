export type Plan = "guest" | "free" | "member" | "admin";

export type EntitlementKey =
  | "can_view_strategy_advantages_full"
  | "can_download_strategy"
  | "can_view_signals_realtime"
  | "can_view_signal_price"
  | "can_view_signal_strength"
  | "can_view_signals_unlimited"
  | "can_view_backtest_full"
  | "can_view_universe_pool_rules"
  | "can_view_data_versions"
  | "can_export_backtest"
  | "can_use_advanced_filters"
  | "can_export_signals"
  | "can_view_account";

export type Entitlements = Record<EntitlementKey, boolean>;

export type GatingMode = "SHOW" | "BLUR" | "HIDE" | "DELAY" | "SAMPLE" | "QUOTA";

export type PaywallReason =
  | "download_strategy"
  | "signal_price"
  | "signal_strength"
  | "export_signals"
  | "export_backtest"
  | "signals_quota"
  | "advanced_filters"
  | "backtest_full"
  | "trial_expired";

export type GateDecision = {
  mode: GatingMode;
  allowed: boolean;
  reason: PaywallReason;
};

export const ALL_ENTITLEMENTS: EntitlementKey[] = [
  "can_view_strategy_advantages_full",
  "can_download_strategy",
  "can_view_signals_realtime",
  "can_view_signal_price",
  "can_view_signal_strength",
  "can_view_signals_unlimited",
  "can_view_backtest_full",
  "can_view_universe_pool_rules",
  "can_view_data_versions",
  "can_export_backtest",
  "can_use_advanced_filters",
  "can_export_signals",
  "can_view_account",
];

export function getEntitlementsForPlan(plan: Plan): Entitlements {
  const allFalse = ALL_ENTITLEMENTS.reduce((acc, k) => {
    acc[k] = false;
    return acc;
  }, {} as Entitlements);

  if (plan === "member" || plan === "admin") {
    return ALL_ENTITLEMENTS.reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {} as Entitlements);
  }

  if (plan === "free") {
    return {
      ...allFalse,
      can_view_account: true,
    };
  }

  return allFalse;
}

export function decideGate(input: {
  entitlements: Entitlements;
  require: EntitlementKey;
  deniedMode: Exclude<GatingMode, "SHOW">;
  reason: PaywallReason;
}): GateDecision {
  const allowed = Boolean(input.entitlements[input.require]);
  return {
    allowed,
    mode: allowed ? "SHOW" : input.deniedMode,
    reason: input.reason,
  };
}

export function isMemberPlan(plan: Plan) {
  return plan === "member" || plan === "admin";
}
