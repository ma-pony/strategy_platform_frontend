import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { getStrategy, listBacktests, listSignals } from "@/api/strategies";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import StrategySummaryCard from "@/components/strategy/StrategySummaryCard";
import ChartPanel from "@/components/strategy/ChartPanel";
import BacktestReportPanel from "@/components/strategy/BacktestReportPanel";
import LockBadge from "@/components/paywall/LockBadge";
import { useEntitlements } from "@/hooks/useEntitlements";
import type { ReactNode } from "react";

type TabKey = "chart" | "backtest";

export default function StrategyDetail() {
  const params = useParams();
  const [sp, setSp] = useSearchParams();
  const { has } = useEntitlements();

  const strategyId = Number(params.strategyId) || 0;

  const { data: strategy, loading, error } = useApi(
    () => getStrategy(strategyId),
    [strategyId],
  );

  const { data: backtestData } = useApi(
    () => listBacktests(strategyId, 1, 1),
    [strategyId],
  );

  const { data: signalData } = useApi(
    () => listSignals(strategyId, 100),
    [strategyId],
  );

  const tabFromUrl = (sp.get("tab") as TabKey) || "chart";
  const [tab, setTab] = useState<TabKey>(tabFromUrl);

  if (loading) {
    return (
      <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
        <div className="h-6 w-1/3 animate-pulse rounded bg-white/[0.06]" />
        <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06]">
        <div className="text-xl font-bold text-white">找不到该策略</div>
        <div className="mt-2 text-sm text-white/55">{error || "该策略可能已下线或地址有误，试试从首页重新进入。"}</div>
        <Link to="/" className="mt-4 inline-flex text-sm text-[color:var(--accent)] hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const backtest = backtestData?.items[0] ?? null;
  const signals = signalData?.signals ?? [];
  const sid = String(strategyId);
  const backtestAllowed = has("can_view_backtest_full", sid);

  return (
    <div className="grid gap-8">
      <div className="flex items-center gap-2 text-xs text-white/45">
        <Link to="/" className="hover:text-white hover:underline">首页</Link>
        <ChevronRight className="size-3.5 text-white/50" />
        <div className="truncate text-white/65">{strategy.name}</div>
      </div>

      <StrategySummaryCard strategy={strategy} backtest={backtest} />

      {/* Tab bar — no container, just border-bottom */}
      <div className="flex items-center gap-4 border-b border-white/[0.06]">
        <TabButton
          active={tab === "chart"}
          onClick={() => {
            setTab("chart");
            sp.set("tab", "chart");
            setSp(sp, { replace: true });
          }}
        >
          信号图表
        </TabButton>
        <TabButton
          active={tab === "backtest"}
          onClick={() => {
            setTab("backtest");
            sp.set("tab", "backtest");
            setSp(sp, { replace: true });
          }}
        >
          回测报告
        </TabButton>
        {!backtestAllowed ? <LockBadge reason="backtest_full" strategyId={sid} className="ml-1" /> : null}
      </div>

      {tab === "chart" ? <ChartPanel strategyId={sid} signals={signals} /> : null}
      {tab === "backtest" && backtest ? (
        <BacktestReportPanel strategyId={sid} backtest={backtest} />
      ) : null}
    </div>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={props.active}
      onClick={props.onClick}
      className={cn(
        "relative px-1 pb-3 text-sm transition",
        props.active
          ? "text-white font-medium"
          : "text-white/50 hover:text-white/75",
        props.active && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-[color:var(--accent)]",
      )}
    >
      {props.children}
    </button>
  );
}
