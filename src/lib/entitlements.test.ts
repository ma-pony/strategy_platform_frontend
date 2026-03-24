import { describe, expect, it } from "vitest";

import { decideGate, getEntitlementsForPlan } from "@/lib/entitlements";

describe("entitlements", () => {
  it("returns account entitlement for free", () => {
    const ent = getEntitlementsForPlan("free");
    expect(ent.can_view_account).toBe(true);
    expect(ent.can_download_strategy).toBe(false);
  });

  it("returns all true for member", () => {
    const ent = getEntitlementsForPlan("member");
    expect(Object.values(ent).every(Boolean)).toBe(true);
  });

  it("decides gate allowed", () => {
    const ent = getEntitlementsForPlan("member");
    const d = decideGate({ entitlements: ent, require: "can_download_strategy", deniedMode: "BLUR", reason: "download_strategy" });
    expect(d.allowed).toBe(true);
    expect(d.mode).toBe("SHOW");
  });

  it("decides gate denied", () => {
    const ent = getEntitlementsForPlan("guest");
    const d = decideGate({ entitlements: ent, require: "can_view_signal_price", deniedMode: "BLUR", reason: "signal_price" });
    expect(d.allowed).toBe(false);
    expect(d.mode).toBe("BLUR");
  });
});
