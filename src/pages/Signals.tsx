import { useEffect, useMemo, useState } from "react";
import { Download, Filter } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { listStrategies, listSignals } from "@/api/strategies";
import type { StrategyRead, SignalRead } from "@/api/types";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import { useEntitlements } from "@/hooks/useEntitlements";
import Gated from "@/components/paywall/Gated";
import BlurredValue from "@/components/paywall/BlurredValue";

function signalDirection(s: SignalRead): "buy" | "sell" | "hold" {
  const t = (s.signal_type || "").toLowerCase();
  if (t === "long" || t === "buy") return "buy";
  if (t === "short" || t === "sell") return "sell";
  return "hold";
}

export default function Signals() {
  const { has } = useEntitlements();
  const [sp, setSp] = useSearchParams();
  const strategyIdFromUrl = sp.get("strategyId") ?? "";

  const [strategies, setStrategies] = useState<StrategyRead[]>([]);
  const [signals, setSignals] = useState<SignalRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyId, setStrategyId] = useState<string>(strategyIdFromUrl);
  const [direction, setDirection] = useState<string>("");

  const canUnlimited = has("can_view_signals_unlimited");

  useEffect(() => {
    listStrategies(1, 100).then((res) => setStrategies(res.items)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    if (strategyId) {
      listSignals(Number(strategyId), 100)
        .then((res) => setSignals(res.signals))
        .catch(() => setSignals([]))
        .finally(() => setLoading(false));
    } else {
      // Load signals from all strategies
      Promise.all(strategies.slice(0, 10).map((s) => listSignals(s.id, 20).catch(() => ({ signals: [] as SignalRead[] }))))
        .then((results) => {
          const all = results.flatMap((r) => r.signals);
          all.sort((a, b) => (a.bar_timestamp > b.bar_timestamp ? -1 : 1));
          setSignals(all);
        })
        .finally(() => setLoading(false));
    }
  }, [strategyId, strategies]);

  const strategyOptions = useMemo(() => strategies.map((s) => ({ id: String(s.id), label: s.name })), [strategies]);
  const strategiesById = useMemo(() => new Map(strategies.map((s) => [s.id, s])), [strategies]);

  const rows = useMemo(() => {
    let filtered = signals;
    if (direction) {
      filtered = filtered.filter((s) => signalDirection(s) === direction);
    }
    return canUnlimited ? filtered : filtered.slice(0, 50);
  }, [signals, direction, canUnlimited]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white md:text-xl">更多策略</h1>
          <div className="mt-1 text-sm text-white/60">按策略/方向筛选，追踪最新交易信号。</div>
        </div>
        <div className="flex items-center gap-2">
          <Gated
            require="can_export_signals"
            reason="export_signals"
            deniedMode="BLUR"
            fallback={<BlurredValue text="导出CSV" width={112} />}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <Download className="size-4" />
              导出 CSV
            </button>
          </Gated>
        </div>
      </div>

      <div className="rounded-2xl bg-[color:var(--card)] p-4 ring-1 ring-white/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-white/70" />
            <div className="text-sm font-medium text-white">筛选</div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={strategyId}
              onChange={(v) => {
                setStrategyId(v);
                if (v) {
                  sp.set("strategyId", v);
                } else {
                  sp.delete("strategyId");
                }
                setSp(sp, { replace: true });
              }}
              items={[{ id: "", label: "全部策略" }, ...strategyOptions]}
            />
            <Select
              value={direction}
              onChange={setDirection}
              items={[
                { id: "", label: "全部方向" },
                { id: "buy", label: "BUY" },
                { id: "sell", label: "SELL" },
                { id: "hold", label: "HOLD" },
              ]}
            />
            <button
              type="button"
              onClick={() => {
                setStrategyId("");
                setDirection("");
                sp.delete("strategyId");
                setSp(sp, { replace: true });
              }}
              className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[color:var(--card)] ring-1 ring-white/10">
        <div className="overflow-auto">
          {loading ? (
            <div className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-white/5" />
                ))}
              </div>
            </div>
          ) : (
            <table className="w-full min-w-[780px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs text-white/55">
                  <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">时间</th>
                  <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">策略</th>
                  <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">交易对</th>
                  <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">周期</th>
                  <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">方向</th>
                  <th className="sticky top-0 bg-[color:var(--card)] px-4 py-3">置信度</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const dir = signalDirection(s);
                  const st = strategiesById.get(s.strategy_id);
                  return (
                    <tr key={s.id} className="group text-sm text-white/85 hover:bg-white/5">
                      <td className="border-t border-white/10 px-4 py-3 text-xs text-white/70 tabular-nums">{formatDateTime(s.bar_timestamp)}</td>
                      <td className="border-t border-white/10 px-4 py-3">
                        <Link
                          to={`/strategies/${s.strategy_id}?tab=chart`}
                          className="font-medium text-white hover:underline"
                        >
                          {st?.name || `策略 #${s.strategy_id}`}
                        </Link>
                      </td>
                      <td className="border-t border-white/10 px-4 py-3 text-xs text-white/70">{s.pair}</td>
                      <td className="border-t border-white/10 px-4 py-3 text-xs text-white/70">{s.timeframe}</td>
                      <td className="border-t border-white/10 px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs ring-1 ring-white/10",
                            dir === "buy"
                              ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                              : dir === "sell"
                                ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]"
                                : "bg-white/5 text-white/70",
                          )}
                        >
                          {s.signal_type.toUpperCase()}
                        </span>
                      </td>
                      <td className="border-t border-white/10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Gated
                          require="can_view_signal_strength"
                          reason="signal_strength"
                          strategyId={String(s.strategy_id)}
                          deniedMode="BLUR"
                          fallback={<BlurredValue text="score" width={92} />}
                        >
                          <span className="tabular-nums">{s.confidence_score != null ? s.confidence_score.toFixed(2) : "—"}</span>
                        </Gated>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/55">
            {!canUnlimited ? (
              <span>免费额度：最多查看 50 条。升级会员可无限查看。</span>
            ) : (
              <span>会员：无限查看。</span>
            )}
          </div>
          <div className="text-xs text-white/55">共 {rows.length} 条信号</div>
        </div>
      </div>
    </div>
  );
}

function Select(props: { value: string; onChange: (v: string) => void; items: Array<{ id: string; label: string }> }) {
  return (
    <label className="inline-flex items-center rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 ring-1 ring-white/10">
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className={cn("bg-transparent text-sm text-white outline-none", "[color-scheme:dark]")}
      >
        {props.items.map((it) => (
          <option key={it.id || "__empty"} value={it.id}>
            {it.label}
          </option>
        ))}
      </select>
    </label>
  );
}
