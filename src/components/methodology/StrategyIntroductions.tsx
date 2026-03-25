import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ExternalLink } from "lucide-react";

import { listStrategies } from "@/api/strategies";
import type { StrategyRead } from "@/api/types";
import { useApi } from "@/hooks/useApi";
import { STRATEGY_INTRODUCTIONS } from "@/data/strategyIntroductions";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  kind: string;
  tags: string[];
  coreIdea: string;
  indicators: string[];
  entryRules: string[];
  exitRules: string[];
  riskNotes: string[];
  sourceCallable: string;
};

function kindLabel(kind: string) {
  if (kind === "signal") return "信号";
  if (kind === "weights") return "权重/配置";
  if (kind === "opportunity") return "机会/套利";
  if (kind === "position_sizing") return "仓位";
  return kind;
}

function strategyToId(s: StrategyRead): string {
  // Convert PascalCase name to snake_case id to match STRATEGY_INTRODUCTIONS
  return s.name
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

export default function StrategyIntroductions() {
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, loading } = useApi(() => listStrategies(1, 100), []);

  const rows = useMemo<Row[]>(() => {
    if (!data) return [];
    const byId = new Map(STRATEGY_INTRODUCTIONS.map((s) => [s.id, s] as const));
    return data.items.map((s) => {
      const id = strategyToId(s);
      const intro = byId.get(id);
      return {
        id: String(s.id),
        name: s.name,
        kind: intro?.kind ?? "signal",
        tags: s.strategy_type ? [s.strategy_type] : [],
        coreIdea: intro?.coreIdea ?? s.description ?? "",
        indicators: intro?.indicators ?? [],
        entryRules: intro?.entryRules ?? [],
        exitRules: intro?.exitRules ?? [],
        riskNotes: intro?.riskNotes ?? [],
        sourceCallable: intro?.sourceCallable ?? id,
      };
    });
  }, [data]);

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 rounded-xl bg-white/5 p-4 text-sm text-white/70 border border-white/[0.06]">
        <div>这里的“策略介绍”聚焦策略库中常用的经典策略：用可复现的规则描述其信号来源、入场/离场与典型风险。</div>
        <div className="text-xs text-white/45">对应策略库：`经典顶级策略/策略库/strategies.py`（callable 名称与页面策略 id 保持一致）。</div>
      </div>

      <div className="overflow-hidden rounded-xl bg-[color:var(--card)] border border-white/[0.06]">
        <div className="grid grid-cols-[1fr_96px_96px] gap-3 border-b border-white/[0.06] bg-[color:var(--bg)]/40 px-4 py-3 text-xs text-white/60 md:grid-cols-[1fr_120px_140px]">
          <div>策略</div>
          <div>类别</div>
          <div>入口</div>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : null}
        <div className="divide-y divide-white/[0.06]">
          {rows.map((r) => {
            const isOpen = openId === r.id;
            return (
              <div key={r.id} className="bg-[color:var(--card)]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold text-white">{r.name}</div>
                      <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/60 border border-white/[0.06]">{r.id}</span>
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-white/60">{r.coreIdea}</div>
                  </div>
                  <div className="hidden w-[120px] shrink-0 text-xs text-white/60 md:block">{kindLabel(r.kind)}</div>
                  <div className="flex w-[96px] shrink-0 items-center justify-end gap-2 md:w-[140px]">
                    <Link
                      to={`/strategies/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70 border border-white/[0.06] transition hover:bg-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      查看
                      <ExternalLink className="size-3" />
                    </Link>
                    <ChevronDown className={cn("size-4 text-white/60 transition", isOpen && "rotate-180")} />
                  </div>
                </button>

                {isOpen ? (
                  <div className="grid gap-4 px-4 pb-5 text-sm text-white/75">
                    <div className="grid gap-2">
                      <div className="text-xs font-semibold text-white/80">核心思想</div>
                      <div className="leading-relaxed">{r.coreIdea}</div>
                    </div>

                    {r.indicators.length > 0 ? (
                      <div className="grid gap-2">
                        <div className="text-xs font-semibold text-white/80">核心指标/结构</div>
                        <div className="flex flex-wrap gap-2">
                          {r.indicators.map((x) => (
                            <span key={x} className="rounded-xl bg-white/5 px-3 py-1 text-xs text-white/70 border border-white/[0.06]">
                              {x}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <div className="text-xs font-semibold text-white/80">入场规则（概念）</div>
                        <div className="grid gap-2">
                          {r.entryRules.length > 0 ? (
                            r.entryRules.map((t, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="mt-1 size-1.5 rounded-full bg-white/50" />
                                <div>{t}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-white/60">暂无</div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <div className="text-xs font-semibold text-white/80">离场规则（概念）</div>
                        <div className="grid gap-2">
                          {r.exitRules.length > 0 ? (
                            r.exitRules.map((t, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="mt-1 size-1.5 rounded-full bg-white/50" />
                                <div>{t}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-white/60">暂无</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {r.riskNotes.length > 0 ? (
                      <div className="grid gap-2">
                        <div className="text-xs font-semibold text-white/80">典型风险与注意事项</div>
                        <div className="grid gap-2">
                          {r.riskNotes.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 rounded-full bg-white/50" />
                              <div>{t}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-1 rounded-xl bg-white/5 p-3 text-xs text-white/60 border border-white/[0.06]">
                      <div>策略库 callable：{r.sourceCallable}</div>
                      <div>策略类型标签：{r.tags.join(" · ")}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

