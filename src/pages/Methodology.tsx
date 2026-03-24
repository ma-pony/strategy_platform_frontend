import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import StrategyIntroductions from "@/components/methodology/StrategyIntroductions";

type Section = {
  id: string;
  title: string;
  content: Array<{ type: "p" | "li"; text: string }>;
};

export default function Methodology() {
  const sections = useMemo<Section[]>(
    () => [
      {
        id: "strategies",
        title: "策略介绍",
        content: [
          { type: "p", text: "这里聚焦策略库中主要策略的基本逻辑：用清晰可复现的规则描述信号、入场、离场与典型风险。" },
          { type: "li", text: "以“策略 id”作为唯一标识：与策略详情页路由、策略库 callable 名称一致。" },
          { type: "li", text: "先讲规则与边界条件，再看回测结果，避免只看收益指标产生误解。" },
        ],
      },
      {
        id: "data",
        title: "数据与代币池",
        content: [
          { type: "p", text: "数据源、时间对齐、缺失值处理、更新频率应全站统一披露。" },
          { type: "li", text: "代币池规则需要版本化（name + as_of + rule_json）。" },
          { type: "li", text: "代币池的纳入/剔除、再平衡频率会影响回测表现。" },
        ],
      },
      {
        id: "costs",
        title: "成本模型",
        content: [
          { type: "p", text: "手续费与滑点是策略可实现性的核心。回测必须显式展示假设。" },
          { type: "li", text: "手续费：按成交额 bps（MVP 可用固定 bps）。" },
          { type: "li", text: "滑点：bps 或动态模型（MVP 可用 bps）。" },
        ],
      },
      {
        id: "metrics",
        title: "指标定义",
        content: [
          { type: "p", text: "同一指标在全站只能有一种定义与年化方式，避免“口径断层”。" },
          { type: "li", text: "return_pct：策略期末净值相对期初净值的百分比变化。" },
          { type: "li", text: "max_drawdown_pct：回撤峰值到谷值的最大百分比跌幅。" },
          { type: "li", text: "sharpe：收益与波动的比值（需说明无风险利率与年化口径）。" },
          { type: "li", text: "trades：回测区间内交易次数统计口径。" },
        ],
      },
      {
        id: "ranking",
        title: "排名逻辑",
        content: [
          { type: "p", text: "热门榜常见做法：回测质量 + 用户热度（浏览/收藏/下载）组合。" },
          { type: "li", text: "动态排序需避免抖动与刷榜，展示更新时间。" },
        ],
      },
      {
        id: "disclosures",
        title: "免责声明与风险提示",
        content: [
          { type: "p", text: "传统金融研究站会把风险提示放在显眼位置，降低误导与合规风险。" },
          { type: "li", text: "历史回测不代表未来表现。" },
          { type: "li", text: "滑点、可成交性与流动性约束会显著影响真实结果。" },
          { type: "li", text: "本站内容用于研究与教育信息，不构成投资建议。" },
        ],
      },
    ],
    [],
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
        <div className="flex items-start gap-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <BookOpen className="size-5 text-white/80" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-white md:text-xl">策略说明与回测口径</h1>
            <div className="mt-2 text-sm text-white/70">统一说明回测假设、指标定义、数据版本与风险提示，解决“榜单吸引但口径不清”的断层。</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--bg)]/50 px-3 py-2 text-xs text-white/65 ring-1 ring-white/10">
                <AlertTriangle className="size-4 text-[color:var(--danger)]" />
                历史回测不代表未来
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--bg)]/50 px-3 py-2 text-xs text-white/65 ring-1 ring-white/10">
                <ShieldAlert className="size-4 text-[color:var(--accent)]" />
                口径一致、版本可追溯
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl bg-[color:var(--card)] p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">目录</div>
          <div className="mt-3 grid gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {s.title}
              </a>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white/5 p-3 text-xs text-white/60 ring-1 ring-white/10">
            付费墙弹窗会把“策略说明链接”作为信任与合规入口。
          </div>
        </aside>

        <div className="grid gap-4">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
              <h2 className="text-base font-semibold text-white">{s.title}</h2>
              <div className="mt-3 grid gap-3 text-sm text-white/75">
                {s.content.map((c, idx) => {
                  if (c.type === "li") {
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-white/50" />
                        <div>{c.text}</div>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed">
                      {c.text}
                    </p>
                  );
                })}

                {s.id === "strategies" ? <StrategyIntroductions /> : null}
              </div>
            </section>
          ))}

          <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">下一步</div>
            <div className="mt-2 text-sm text-white/70">
              你可以从首页选择一个策略进入详情页，查看“信号图表”与“回测报告与策略说明”Tab 的联动。
            </div>
            <div className="mt-4">
              <Link to="/" className={cn("inline-flex rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110")}>
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
