import { cn } from "@/lib/utils";
import type { ConsensusResult } from "@/lib/signalGrouping";

const toneMap: Record<ConsensusResult["direction"], string> = {
  buy: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/20",
  sell: "bg-[color:var(--danger)]/15 text-[color:var(--danger)] border-[color:var(--danger)]/20",
  hold: "bg-white/10 text-white/60 border-white/10",
  mixed: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

export default function ConsensusLabel({ consensus, className }: { consensus: ConsensusResult; className?: string }) {
  if (consensus.total === 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
        toneMap[consensus.direction],
        className,
      )}
    >
      {consensus.label}
    </span>
  );
}
