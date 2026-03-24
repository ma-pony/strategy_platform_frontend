import { Lock } from "lucide-react";
import { useLocation } from "react-router-dom";

import type { PaywallReason } from "@/lib/entitlements";
import { cn } from "@/lib/utils";
import { usePaywall } from "@/hooks/usePaywall";

export default function LockBadge(props: { reason: PaywallReason; strategyId?: string; className?: string }) {
  const { open } = usePaywall();
  const location = useLocation();
  return (
    <button
      type="button"
      onClick={() => open({ reason: props.reason, strategyId: props.strategyId, returnTo: location.pathname + location.search })}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70 ring-1 ring-white/10 transition hover:bg-white/10",
        props.className,
      )}
    >
      <Lock className="size-3" />
      会员
    </button>
  );
}
