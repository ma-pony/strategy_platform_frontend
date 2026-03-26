import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Plan } from "@/lib/entitlements";

import { login as apiLogin, register as apiRegister, logout as apiLogout } from "@/api/auth";
import type { UserRead } from "@/api/types";

type StrategyGrant = {
  strategyId: string;
  expiresAt: string | null;
};

type SubscriptionStatus = "active" | "trialing" | "canceled" | "past_due" | "inactive";

type SubscriptionInfo = {
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  autoRenew: boolean;
};

type AuthState = {
  user: UserRead | null;
  plan: Plan;
  subscription: SubscriptionInfo;
  grants: StrategyGrant[];
  isLoading: boolean;
  error: string | null;

  loginAsync(email: string, password: string): Promise<void>;
  registerAsync(email: string, password: string): Promise<void>;
  logout(): void;
  hasActiveGrant(strategyId: string): boolean;
  clearError(): void;
};

function membershipToPlan(membership: string): Plan {
  switch (membership.toLowerCase()) {
    case "vip1":
    case "vip2":
    case "vip3":
      return "member";
    case "admin":
      return "admin";
    case "free":
      return "free";
    default:
      return "free";
  }
}

function planToSubscription(plan: Plan): SubscriptionInfo {
  if (plan === "member" || plan === "admin") {
    return { status: "active", currentPeriodEnd: null, autoRenew: true };
  }
  return { status: "inactive", currentPeriodEnd: null, autoRenew: false };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      plan: "guest",
      subscription: { status: "inactive", currentPeriodEnd: null, autoRenew: false },
      grants: [],
      isLoading: false,
      error: null,

      loginAsync: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const tokens = await apiLogin(email, password);
          // Decode membership from JWT payload
          const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
          const membership = payload.membership || "FREE";
          const plan = membershipToPlan(membership);

          set({
            user: {
              id: Number(payload.sub),
              email,
              membership,
              created_at: null,
            },
            plan,
            subscription: planToSubscription(plan),
            isLoading: false,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "登录失败";
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      registerAsync: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userRead = await apiRegister(email, password);
          // After register, auto-login
          const tokens = await apiLogin(email, password);
          const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
          const membership = payload.membership || "FREE";
          const plan = membershipToPlan(membership);

          set({
            user: userRead,
            plan,
            subscription: planToSubscription(plan),
            isLoading: false,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "注册失败";
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      logout: () => {
        apiLogout();
        set({
          user: null,
          plan: "guest",
          subscription: { status: "inactive", currentPeriodEnd: null, autoRenew: false },
          error: null,
        });
      },

      hasActiveGrant: (strategyId) => {
        const cur = get();
        const g = cur.grants.find((x) => x.strategyId === strategyId);
        if (!g) return false;
        if (!g.expiresAt) return true;
        const t = new Date(g.expiresAt).getTime();
        return !Number.isNaN(t) && t > Date.now();
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "sp_auth_v2",
      version: 3,
      migrate: (persisted) => {
        const old = persisted as Record<string, unknown> | null;
        return {
          user: old?.user ?? null,
          plan: old?.plan === "member" || old?.plan === "admin" ? "free" as Plan : (old?.plan as Plan) ?? "guest",
          subscription: { status: "inactive" as SubscriptionStatus, currentPeriodEnd: null, autoRenew: false },
          grants: [] as StrategyGrant[],
        };
      },
      partialize: (state) => ({
        user: state.user,
        plan: state.plan,
        subscription: state.subscription,
        grants: state.grants,
      }),
    },
  ),
);
