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
  const innerW = SVG_W - SVG_PADDING.l - SVG_PADDING.r;
  const yLong = h / 2 - 80;
  const yFlat = h / 2;
  const yShort = h / 2 + 80;

  const { markers, linePoints, xTicks } = useMemo(() => {
    if (filtered.length === 0) {
      return { markers: [] as Array<{ cx: number; cy: number; fill: string; signal: SignalRead; dir: "buy" | "sell" | "hold" }>, linePoints: "", xTicks: [] as Array<{ x: number; label: string }> };
    }
    const times = filtered.map((s) => new Date(s.signal_at).getTime());
    const tMin = times[0];
    const tMax = times[times.length - 1];
    const tSpan = Math.max(1, tMax - tMin);
    const xOf = (t: number) => SVG_PADDING.l + ((t - tMin) / tSpan) * innerW;

    const yByDir = (d: "buy" | "sell" | "hold") => (d === "buy" ? yLong : d === "sell" ? yShort : yFlat);

    const ms = filtered.map((s, i) => {
      const dir = signalDirection(s);
      return {
        cx: xOf(times[i]),
        cy: yByDir(dir),
        fill: dir === "buy" ? "var(--success)" : dir === "sell" ? "var(--danger)" : HOLD_FILL,
        signal: s,
        dir,
      };
    });

    // Step line: position state holds until next signal flips it.
    const pts: Array<[number, number]> = [];
    let prevY = yFlat;
    ms.forEach((m, i) => {
      if (i === 0) {
        pts.push([m.cx, m.cy]);
      } else {
        // step: horizontal at prevY until current x, then vertical to current y
        pts.push([m.cx, prevY]);
        pts.push([m.cx, m.cy]);
      }
      prevY = m.cy;
    });
    // Extend the last state to the right edge so the line spans the full chart.
    const rightEdge = SVG_PADDING.l + innerW;
    if (pts.length > 0 && pts[pts.length - 1][0] < rightEdge) {
      pts.push([rightEdge, prevY]);
    }
    const polyStr = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

    // X-axis ticks: 5 evenly spaced
    const tickCount = 5;
    const ticks: Array<{ x: number; label: string }> = [];
    for (let i = 0; i < tickCount; i++) {
      const t = tMin + (tSpan * i) / (tickCount - 1);
      const d = new Date(t);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      ticks.push({ x: xOf(t), label });
    }

    return { markers: ms, linePoints: polyStr, xTicks: ticks };
  }, [filtered, innerW, yLong, yFlat, yShort]);

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
            {/* guide lines for LONG / FLAT / SHORT */}
            <line x1={SVG_PADDING.l} x2={SVG_W - SVG_PADDING.r} y1={yLong} y2={yLong} stroke="rgba(46,204,113,0.18)" strokeDasharray="3 4" />
            <line x1={SVG_PADDING.l} x2={SVG_W - SVG_PADDING.r} y1={yFlat} y2={yFlat} stroke="rgba(255,255,255,0.08)" />
            <line x1={SVG_PADDING.l} x2={SVG_W - SVG_PADDING.r} y1={yShort} y2={yShort} stroke="rgba(231,76,60,0.18)" strokeDasharray="3 4" />
            <text x={SVG_PADDING.l - 4} y={yLong + 4} fontSize="11" fill="var(--success)" opacity="0.6" textAnchor="end">LONG</text>
            <text x={SVG_PADDING.l - 4} y={yFlat + 4} fontSize="11" fill="rgba(255,255,255,0.5)" textAnchor="end">FLAT</text>
            <text x={SVG_PADDING.l - 4} y={yShort + 4} fontSize="11" fill="var(--danger)" opacity="0.6" textAnchor="end">SHORT</text>

            {/* x-axis baseline + ticks */}
            <line x1={SVG_PADDING.l} x2={SVG_W - SVG_PADDING.r} y1={h - SVG_PADDING.b} y2={h - SVG_PADDING.b} stroke="rgba(255,255,255,0.08)" />
            {xTicks.map((t, i) => (
              <g key={i}>
                <line x1={t.x} x2={t.x} y1={h - SVG_PADDING.b} y2={h - SVG_PADDING.b + 4} stroke="rgba(255,255,255,0.25)" />
                <text x={t.x} y={h - SVG_PADDING.b + 16} fontSize="11" fill="rgba(255,255,255,0.5)" textAnchor="middle">{t.label}</text>
              </g>
            ))}

            {/* position state step line */}
            {linePoints ? (
              <polyline
                points={linePoints}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.85}
              />
            ) : null}

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
