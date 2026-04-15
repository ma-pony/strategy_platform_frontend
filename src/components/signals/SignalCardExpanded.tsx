import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { normalizeDirection, type SignalsByStrategy } from "@/lib/signalGrouping";
import type { SignalRead } from "@/api/types";
import { formatDateTime } from "@/lib/format";

const dirLabel: Record<string, string> = { buy: "买入", sell: "卖出", hold: "持有" };
const dirColor: Record<string, string> = {
  buy: "text-[color:var(--success)]",
  sell: "text-[color:var(--danger)]",
  hold: "text-white/60",
};

export default function SignalCardExpanded({
  entry,
  recentSignals,
  historyLimit = 5,
}: {
  entry: SignalsByStrategy;
  recentSignals: SignalRead[];
  historyLimit?: number;
}) {
  const { strategy } = entry;

  return (
    <div className="border-t border-white/[0.06] px-3 pb-3 pt-2">
      {/* Strategy brief */}
      {strategy.description ? (
        <div className="mb-3 text-xs text-white/55 leading-relaxed">{strategy.description}</div>
      ) : null}

      {/* Recent signal history */}
      {recentSignals.length > 0 ? (
        <div className="mb-3">
          <div className="mb-2 text-xs font-medium text-white/50">最近信号</div>
          <div className="grid gap-1">
            {recentSignals.slice(0, historyLimit).map((sig) => {
              const dir = normalizeDirection(sig.direction);
              return (
                <div key={sig.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs">
                  <span className={dirColor[dir]}>{dirLabel[dir]}</span>
                  <span className="text-white/45">{sig.timeframe ?? "—"}</span>
                  <span className="ml-auto text-white/40 tabular-nums">{formatDateTime(sig.signal_at)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <Link
        to={`/strategies/${strategy.id}`}
        className="inline-flex items-center gap-1.5 text-xs text-[color:var(--accent)] hover:underline"
      >
        查看策略详情
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
