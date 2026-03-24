import { useMemo } from "react";

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

function getEmptyEntitlements(): Entitlements {
  return ALL_ENTITLEMENTS.reduce((acc, k) => {
    acc[k] = false;
    return acc;
  }, {} as Entitlements);
}

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

  const getStrategy = async (strategyId: string): Promise<StrategyEntitlements> => {
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
      const scoped: Partial<Entitlements> = {
        can_download_strategy: true,
        can_view_signals_realtime: true,
        can_view_signal_price: true,
        can_view_signal_strength: true,
        can_view_backtest_full: true,
        can_view_universe_pool_rules: true,
        can_view_data_versions: true,
        can_export_backtest: true,
      };

      return {
        strategyId,
        hasAccess: true,
        accessSource: "grant",
        entitlements: { ...getEmptyEntitlements(), ...globalEnt, ...scoped },
      };
    }

    return {
      strategyId,
      hasAccess: false,
      accessSource: "none",
      entitlements: globalEnt,
    };
  };

  const has = (key: EntitlementKey, strategyId?: string) => {
    const globalEnt = global.entitlements[key];
    if (globalEnt) return true;
    if (!strategyId) return false;
    if (plan === "guest") return false;
    if (!hasActiveGrant(strategyId)) return false;
    return [
      "can_download_strategy",
      "can_view_signals_realtime",
      "can_view_signal_price",
      "can_view_signal_strength",
      "can_view_backtest_full",
      "can_view_universe_pool_rules",
      "can_view_data_versions",
      "can_export_backtest",
    ].includes(key);
  };

  const refreshGlobal = async () => {
    return;
  };

  return { global, refreshGlobal, getStrategy, has };
}
