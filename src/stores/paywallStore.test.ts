import { describe, expect, it } from "vitest";

import { usePaywallStore } from "@/stores/paywallStore";

describe("paywallStore", () => {
  it("opens and closes", () => {
    const s1 = usePaywallStore.getState();
    s1.open({ reason: "signal_price", returnTo: "/" });
    expect(usePaywallStore.getState().isOpen).toBe(true);
    expect(usePaywallStore.getState().params?.reason).toBe("signal_price");
    usePaywallStore.getState().close();
    expect(usePaywallStore.getState().isOpen).toBe(false);
    expect(usePaywallStore.getState().params).toBe(null);
  });
});
