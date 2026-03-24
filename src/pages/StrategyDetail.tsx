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
      <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
        <div className="h-6 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
        <div className="text-lg font-semibold text-white">未找到策略</div>
        <div className="mt-2 text-sm text-white/60">{error || "请从首页榜单进入策略详情。"}</div>
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
    <div className="grid gap-6">
      <div className="flex items-center gap-2 text-xs text-white/55">
        <Link to="/" className="hover:text-white hover:underline">
          首页
        </Link>
        <ChevronRight className="size-4 text-white/35" />
        <div className="truncate text-white/75">{strategy.name}</div>
      </div>

      <StrategySummaryCard strategy={strategy} backtest={backtest} />

      <div className="rounded-2xl bg-[color:var(--card)] p-2 ring-1 ring-white/10">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
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
      onClick={props.onClick}
      className={cn(
        "rounded-lg px-4 py-2 text-sm transition",
        props.active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      {props.children}
    </button>
  );
}
