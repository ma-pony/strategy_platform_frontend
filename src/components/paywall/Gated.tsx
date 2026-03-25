import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import type { EntitlementKey, GatingMode, PaywallReason } from "@/lib/entitlements";
import { cn } from "@/lib/utils";
import { useEntitlements } from "@/hooks/useEntitlements";
import { usePaywall } from "@/hooks/usePaywall";
import LockedPlaceholder from "@/components/paywall/LockedPlaceholder";

export type GatedProps = {
  require: EntitlementKey;
  reason: PaywallReason;
  strategyId?: string;
  deniedMode: Exclude<GatingMode, "SHOW">;
  className?: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function Gated(props: GatedProps) {
  const { has } = useEntitlements();
  const { open } = usePaywall();
  const location = useLocation();

  const allowed = has(props.require, props.strategyId);
  if (allowed) {
    return <div className={props.className}>{props.children}</div>;
  }

  if (props.deniedMode === "HIDE") {
    return <>{props.fallback ?? null}</>;
  }

  const fallback = props.fallback ?? <LockedPlaceholder />;
  const onClick = () => open({ reason: props.reason, strategyId: props.strategyId, returnTo: location.pathname + location.search });

  return (
    <div
      className={cn("w-full cursor-pointer", props.className)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      role="button"
      tabIndex={0}
      aria-label="需要会员权限，点击了解详情"
    >
      {fallback}
    </div>
  );
}
