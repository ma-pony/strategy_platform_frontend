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
        "inline-flex items-center gap-1 rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-xs text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/20",
        props.className,
      )}
    >
      <Lock className="size-3" aria-hidden="true" />
      会员
    </button>
  );
}
