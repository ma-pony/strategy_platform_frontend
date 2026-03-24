import { create } from "zustand";

import type { PaywallReason } from "@/lib/entitlements";

export type PaywallOpenParams = {
  reason: PaywallReason;
  strategyId?: string;
  returnTo: string;
};

type PaywallState = {
  isOpen: boolean;
  params: PaywallOpenParams | null;
  open(params: PaywallOpenParams): void;
  close(): void;
};

export const usePaywallStore = create<PaywallState>((set) => ({
  isOpen: false,
  params: null,
  open: (params) => set({ isOpen: true, params }),
  close: () => set({ isOpen: false, params: null }),
}));
