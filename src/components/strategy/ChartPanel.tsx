import { useMemo, useState } from "react";
import { Info } from "lucide-react";

import type { SignalRead } from "@/api/types";
import { cn } from "@/lib/utils";
import { formatDateTime, formatNumber } from "@/lib/format";
import Gated from "@/components/paywall/Gated";
import BlurredValue from "@/components/paywall/BlurredValue";

type RangeKey = "7D" | "30D" | "ALL";

const RANGE_ITEMS: RangeKey[] = ["7D", "30D", "ALL"];
const SVG_W = 920;
const SVG_PADDING = { l: 36, r: 18, t: 18, b: 28 };
const HOLD_FILL = "rgba(230,237,247,0.35)";

function rangeDays(key: RangeKey) {
  if (key === "7D") return 7;
  if (key === "30D") return 30;
  return 3650;
}

function signalDirection(s: SignalRead): "buy" | "sell" | "hold" {
  const t = (s.direction || "").toLowerCase();
  if (t === "long" || t === "buy") return "buy";
  if (t === "short" || t === "sell") return "sell";
  return "hold";
}

export default function ChartPanel(props: { strategyId: string; signals: SignalRead[]; className?: string }) {
  const [range, setRange] = useState<RangeKey>("30D");
  const [hovered, setHovered] = useState<SignalRead | null>(null);

  const filtered = useMemo(() => {
    const days = rangeDays(range);
    const start = new Date();
    start.setDate(start.getDate() - days);
    const out = props.signals.filter((s) => new Date(s.signal_at).getTime() >= start.getTime());
    out.sort((a, b) => (a.signal_at < b.signal_at ? -1 : 1));
    return out;
  }, [props.signals, range]);

  const h = 520;

  const markers = useMemo(() => {
    if (filtered.length === 0) return [];
    const xMax = Math.max(1, filtered.length - 1);
    return filtered.map((s, idx) => {
      const cx = SVG_PADDING.l + (idx / xMax) * (SVG_W - SVG_PADDING.l - SVG_PADDING.r);
      const dir = signalDirection(s);
      const cy = h / 2 + (dir === "buy" ? -80 : dir === "sell" ? 80 : 0);
      const fill = dir === "buy" ? "var(--success)" : dir === "sell" ? "var(--danger)" : HOLD_FILL;
      return { cx, cy, fill, signal: s, dir };
    });
  }, [filtered, h]);

  return (
    <div className={cn("rounded-xl bg-[color:var(--card)] p-5 border border-white/[0.06]", props.className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">信号图表</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
            <Info className="size-4" />
            <span>悬停或点击信号点查看详情</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<RangeKey> value={range} onChange={setRange} items={RANGE_ITEMS} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px]">
        <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/[0.06]">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-white/55">
              该时间范围内暂无信号数据。
            </div>
          ) : (<>
          <svg
            viewBox={`0 0 ${SVG_W} ${h}`}
            className="block aspect-[920/520] w-full"
            role="img"
            aria-label={`信号分布图，共 ${markers.length} 个信号`}
          >
            <line x1={SVG_PADDING.l} x2={SVG_W - SVG_PADDING.r} y1={h / 2} y2={h / 2} stroke="rgba(255,255,255,0.06)" />
            <text x={SVG_PADDING.l - 4} y={h / 2 - 80} fontSize="11" fill="var(--success)" opacity="0.6" textAnchor="end">BUY</text>
            <text x={SVG_PADDING.l - 4} y={h / 2 + 84} fontSize="11" fill="var(--danger)" opacity="0.6" textAnchor="end">SELL</text>

            {markers.map((m) => (
              <circle
                key={m.signal.id}
                cx={m.cx}
                cy={m.cy}
                r={m.dir === "hold" ? 3 : 5}
                fill={m.fill}
                opacity={m.dir === "hold" ? 0.6 : 1}
                tabIndex={0}
                aria-label={`${m.dir.toUpperCase()} ${m.signal.pair} ${m.signal.signal_at}`}
                onMouseEnter={() => setHovered(m.signal)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(m.signal)}
                onBlur={() => setHovered(null)}
                className="cursor-pointer"
              />
            ))}
          </svg>

          {hovered ? (
            <div className="pointer-events-none absolute left-4 top-4 w-[280px] rounded-xl bg-[color:var(--bg)]/80 p-3 text-xs text-white/80 border border-white/[0.06] backdrop-blur">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-white">{formatDateTime(hovered.signal_at)}</div>
                <div
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs border border-white/[0.06]",
                    signalDirection(hovered) === "buy"
                      ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                      : signalDirection(hovered) === "sell"
                        ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]"
                        : "bg-white/5 text-white/70",
                  )}
                >
                  {hovered.direction.toUpperCase()}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 p-2 border border-white/[0.06]">
                  <div className="text-xs text-white/50">交易对</div>
                  <div className="mt-1 font-semibold">{hovered.pair}</div>
                </div>
                <div className="rounded-lg bg-white/5 p-2 border border-white/[0.06]">
                  <div className="text-xs text-white/50">置信度</div>
                  <div className="mt-1 font-semibold tabular-nums">
                    <Gated
                      require="can_view_signal_strength"
                      reason="signal_strength"
                      strategyId={props.strategyId}
                      deniedMode="BLUR"
                      fallback={<BlurredValue text="score" width={96} className="h-6" />}
                    >
                      {hovered.confidence_score != null ? formatNumber(hovered.confidence_score, 2) : "—"}
                    </Gated>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          </>)}
        </div>

        <div className="rounded-xl bg-white/5 p-4 border border-white/[0.06]">
          <div className="text-sm font-semibold text-white">近期信号摘要</div>
          <div className="mt-2 text-xs text-white/45">最近的交易信号列表</div>
          <div className="mt-4 grid gap-2">
            {filtered
              .slice(-6)
              .reverse()
              .map((s) => {
                const dir = signalDirection(s);
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 border border-white/[0.06]">
                    <div className="min-w-0">
                      <div className="truncate text-xs text-white/70">{formatDateTime(s.signal_at)}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs border border-white/[0.06]",
                            dir === "buy"
                              ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                              : dir === "sell"
                                ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]"
                                : "bg-white/5 text-white/70",
                          )}
                        >
                          {s.direction.toUpperCase()}
                        </span>
                        <span className="text-xs text-white/50">{s.pair} · {s.timeframe}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs tabular-nums">
                      <div className="text-white/45">置信度</div>
                      <div className="font-semibold text-white/85">
                        <Gated
                          require="can_view_signal_strength"
                          reason="signal_strength"
                          strategyId={props.strategyId}
                          deniedMode="BLUR"
                          fallback={<BlurredValue text="score" width={82} className="h-6" />}
                        >
                          {s.confidence_score != null ? formatNumber(s.confidence_score, 2) : "—"}
                        </Gated>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  items: T[];
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg bg-white/5 border border-white/[0.06]">
      {props.items.map((it) => {
        const label = props.labels?.[it] ?? it;
        const active = it === props.value;
        return (
          <button
            key={it}
            type="button"
            onClick={() => props.onChange(it)}
            className={cn(
              "px-3 py-2 text-xs text-white/70 transition hover:bg-white/10",
              active && "bg-white/10 text-white",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
