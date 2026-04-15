import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import Gated from "@/components/paywall/Gated";
import BlurredValue from "@/components/paywall/BlurredValue";
import { getStrategyDisplayName } from "@/lib/strategyNames";
import { normalizeDirection, type SignalsByStrategy } from "@/lib/signalGrouping";

const directionConfig = {
  buy: {
    label: "买入",
    bg: "bg-[color:var(--success)]/10",
    border: "border-[color:var(--success)]/20",
    text: "text-[color:var(--success)]",
    dot: "bg-[color:var(--success)]",
  },
  sell: {
    label: "卖出",
    bg: "bg-[color:var(--danger)]/10",
    border: "border-[color:var(--danger)]/20",
    text: "text-[color:var(--danger)]",
    dot: "bg-[color:var(--danger)]",
  },
  hold: {
    label: "持有",
    bg: "bg-white/5",
    border: "border-white/10",
    text: "text-white/60",
    dot: "bg-white/40",
  },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

export default function SignalCard({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: SignalsByStrategy;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { strategy, signal } = entry;
  const dir = normalizeDirection(signal.direction);
  const cfg = directionConfig[dir];
  const sid = String(strategy.id);

  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        cfg.border,
        cfg.bg,
        isExpanded && "ring-1 ring-white/10",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <div className={cn("size-2.5 shrink-0 rounded-full", cfg.dot)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/strategies/${strategy.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-white hover:underline"
            >
              {getStrategyDisplayName(strategy.name)}
            </Link>
            <span className="truncate text-xs text-white/30">{strategy.name}</span>
            <span className={cn("text-xs font-semibold", cfg.text)}>{cfg.label}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
            {signal.timeframe ? <span>{signal.timeframe}</span> : null}
            <span>{timeAgo(signal.signal_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {signal.confidence_score != null ? (
            <Gated
              require="can_view_signal_strength"
              reason="signal_strength"
              strategyId={sid}
              deniedMode="BLUR"
              fallback={<BlurredValue text="85%" width={40} />}
            >
              <span className="text-xs text-white/70 tabular-nums">
                {Math.round(signal.confidence_score * 100)}%
              </span>
            </Gated>
          ) : null}
          <ChevronDown className={cn("size-4 text-white/40 transition", isExpanded && "rotate-180")} />
        </div>
      </button>
    </div>
  );
}
