import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const t = (s.direction || "").toLowerCase();
  if (t === "long" || t === "buy") return "buy";
  if (t === "short" || t === "sell") return "sell";
  return "hold";
}

export default function Signals() {
  const { has } = useEntitlements();
  const [sp, setSp] = useSearchParams();
  const strategyIdFromUrl = sp.get("strategyId") ?? "";

  const [strategies, setStrategies] = useState<StrategyRead[]>([]);
  const [strategiesLoaded, setStrategiesLoaded] = useState(false);
  const [signals, setSignals] = useState<SignalRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strategyId, setStrategyId] = useState<string>(strategyIdFromUrl);
  const [direction, setDirection] = useState<string>("");
  const fetchIdRef = useRef(0);

  const canUnlimited = has("can_view_signals_unlimited");

  useEffect(() => {
    let alive = true;
    listStrategies(1, 100)
      .then((res) => { if (alive) { setStrategies(res.items); setStrategiesLoaded(true); } })
      .catch(() => { if (alive) setStrategiesLoaded(true); });
    return () => { alive = false; };
  }, []);

  const loadSignals = useCallback(() => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);

    if (strategyId) {
      listSignals(Number(strategyId), 100)
        .then((res) => { if (id === fetchIdRef.current) setSignals(res.signals); })
        .catch((e) => { if (id === fetchIdRef.current) { setSignals([]); setError(e instanceof Error ? e.message : "加载信号失败"); } })
        .finally(() => { if (id === fetchIdRef.current) setLoading(false); });
    } else if (strategies.length > 0) {
      Promise.all(strategies.slice(0, 10).map((s) => listSignals(s.id, 20).catch(() => ({ signals: [] as SignalRead[] }))))
        .then((results) => {
          if (id !== fetchIdRef.current) return;
          const all = results.flatMap((r) => r.signals);
          all.sort((a, b) => (a.signal_at > b.signal_at ? -1 : 1));
          setSignals(all);
        })
        .catch(() => { if (id === fetchIdRef.current) setError("加载信号失败"); })
        .finally(() => { if (id === fetchIdRef.current) setLoading(false); });
    } else if (strategiesLoaded) {
      setSignals([]);
      setLoading(false);
    }
  }, [strategyId, strategies, strategiesLoaded]);

  useEffect(() => { loadSignals(); }, [loadSignals]);

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
          <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">交易信号</h1>
          <div className="mt-2 text-sm text-white/50">按策略和方向筛选，查看最新信号。</div>
        </div>
        <div className="flex items-center gap-2">
          <Gated
            require="can_export_signals"
            reason="export_signals"
            deniedMode="BLUR"
            fallback={<BlurredValue text="导出 CSV" width={112} />}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/85 border border-white/[0.06] transition hover:bg-white/10"
            >
              <Download className="size-4" />
              导出 CSV
            </button>
          </Gated>
        </div>
      </div>

      <div className="rounded-xl bg-[color:var(--card)] p-4 border border-white/[0.06]">
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
              className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 border border-white/[0.06] transition hover:bg-white/10"
            >
              清除筛选
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-[color:var(--card)] border border-white/[0.06]">
        <div className="overflow-auto">
          {loading ? (
            <div className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-white/5" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="text-sm text-white/55">{error}</div>
              <button
                type="button"
                onClick={loadSignals}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white/80 border border-white/[0.06] transition hover:bg-white/10"
              >
                重试
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/55">
              {direction || strategyId ? "当前筛选条件下没有信号。" : "暂无信号数据。"}
            </div>
          ) : (
            <table className="w-full min-w-[780px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs text-white/45">
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
                      <td className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/70 tabular-nums">{formatDateTime(s.signal_at)}</td>
                      <td className="border-t border-white/[0.06] px-4 py-3">
                        <Link
                          to={`/strategies/${s.strategy_id}?tab=chart`}
                          className="font-medium text-white hover:underline"
                        >
                          {st?.name || `策略 #${s.strategy_id}`}
                        </Link>
                      </td>
                      <td className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/70">{s.pair}</td>
                      <td className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/70">{s.timeframe}</td>
                      <td className="border-t border-white/[0.06] px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs border border-white/[0.06]",
                            dir === "buy"
                              ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                              : dir === "sell"
                                ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]"
                                : "bg-white/5 text-white/70",
                          )}
                        >
                          {s.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="border-t border-white/[0.06] px-4 py-3" onClick={(e) => e.stopPropagation()}>
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

        <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/45">
            {!canUnlimited ? (
              <span>免费用户最多查看 50 条，<Link to="/pricing" className="text-[color:var(--accent)] hover:underline">升级</Link>可无限查看。</span>
            ) : (
              <span>会员：无限查看。</span>
            )}
          </div>
          <div className="text-xs text-white/45">共 {rows.length} 条信号</div>
        </div>
      </div>
    </div>
  );
}

function Select(props: { value: string; onChange: (v: string) => void; items: Array<{ id: string; label: string }> }) {
  return (
    <label className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85 border border-white/[0.06]">
      <select
        aria-label="筛选条件"
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
