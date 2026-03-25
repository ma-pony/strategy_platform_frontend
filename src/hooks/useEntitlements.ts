import { useCallback, useMemo } from "react";

import {
  ALL_ENTITLEMENTS,
  getEntitlementsForPlan,
  type EntitlementKey,
  type Entitlements,
  type Plan,
} from "@/lib/entitlements";
import { useAuthStore } from "@/stores/authStore";

export type GlobalEntitlementsState = {
  status: "idle" | "loading" | "ready" | "error";
  plan: Plan;
  entitlements: Entitlements;
};

export type StrategyEntitlements = {
  strategyId: string;
  hasAccess: boolean;
  accessSource: "subscription" | "grant" | "none";
  entitlements: Partial<Entitlements>;
};

const GRANT_ELIGIBLE_KEYS: EntitlementKey[] = [
  "can_download_strategy",
  "can_view_signals_realtime",
  "can_view_signal_price",
  "can_view_signal_strength",
  "can_view_backtest_full",
  "can_view_universe_pool_rules",
  "can_view_data_versions",
  "can_export_backtest",
];

const GRANT_ELIGIBLE_SET = new Set<string>(GRANT_ELIGIBLE_KEYS);

const EMPTY_ENTITLEMENTS: Entitlements = ALL_ENTITLEMENTS.reduce((acc, k) => {
  acc[k] = false;
  return acc;
}, {} as Entitlements);

const GRANT_SCOPED: Partial<Entitlements> = Object.fromEntries(
  GRANT_ELIGIBLE_KEYS.map((k) => [k, true]),
) as Partial<Entitlements>;

export function useEntitlements() {
  const plan = useAuthStore((s) => s.plan);
  const hasActiveGrant = useAuthStore((s) => s.hasActiveGrant);

  const global = useMemo<GlobalEntitlementsState>(() => {
    return {
      status: "ready",
      plan,
      entitlements: getEntitlementsForPlan(plan),
    };
  }, [plan]);

  const getStrategy = useCallback(async (strategyId: string): Promise<StrategyEntitlements> => {
    const globalEnt = getEntitlementsForPlan(plan);
    const isSub = plan === "member" || plan === "admin";
    if (isSub) {
      return {
        strategyId,
        hasAccess: true,
        accessSource: "subscription",
        entitlements: globalEnt,
      };
    }

    if (plan !== "guest" && hasActiveGrant(strategyId)) {
      return {
        strategyId,
        hasAccess: true,
        accessSource: "grant",
        entitlements: { ...EMPTY_ENTITLEMENTS, ...globalEnt, ...GRANT_SCOPED },
      };
    }

    return {
      strategyId,
      hasAccess: false,
      accessSource: "none",
      entitlements: globalEnt,
    };
  }, [plan, hasActiveGrant]);

  const has = useCallback((key: EntitlementKey, strategyId?: string) => {
    const globalEnt = global.entitlements[key];
    if (globalEnt) return true;
    if (!strategyId) return false;
    if (plan === "guest") return false;
    if (!hasActiveGrant(strategyId)) return false;
    return GRANT_ELIGIBLE_SET.has(key);
  }, [global.entitlements, plan, hasActiveGrant]);

  const refreshGlobal = useCallback(async () => {
    return;
  }, []);

  return { global, refreshGlobal, getStrategy, has };
}
