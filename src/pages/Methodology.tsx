import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldAlert } from "lucide-react";

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
          { type: "li", text: "以\u201C策略 id\u201D作为唯一标识：与策略详情页路由、策略库 callable 名称一致。" },
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
          { type: "p", text: "同一指标在全站只能有一种定义与年化方式，避免\u201C口径断层\u201D。" },
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
    <div className="grid gap-10">
      {/* Hero — no card, just typography + badges */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">策略说明与回测口径</h1>
        <div className="mt-3 text-sm text-white/55 leading-relaxed">
          统一说明回测假设、指标定义、数据版本与风险提示，确保你理解每个数字的含义。
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-[color:var(--danger)]" />
            历史回测不代表未来
          </span>
          <span className="text-white/15">|</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-[color:var(--accent)]" />
            口径一致、版本可追溯
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Sidebar TOC — sticky, no card wrapper */}
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="text-xs font-medium text-white/50 uppercase tracking-wider">目录</div>
          <div className="mt-3 grid gap-0.5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-md px-3 py-2 text-sm text-white/60 transition hover:text-white hover:bg-white/[0.04]"
              >
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Content — text sections without card wrappers, strategy intro section with card */}
        <div className="grid gap-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="text-lg font-semibold text-white">{s.title}</h2>
              <div className="mt-3 grid gap-3 text-sm text-white/65 leading-relaxed">
                {s.content.map((c, idx) => {
                  if (c.type === "li") {
                    return (
                      <div key={idx} className="flex items-start gap-2 pl-1">
                        <span className="mt-2 size-1 rounded-full bg-white/40 shrink-0" />
                        <div>{c.text}</div>
                      </div>
                    );
                  }
                  return <p key={idx}>{c.text}</p>;
                })}

                {s.id === "strategies" ? <StrategyIntroductions /> : null}
              </div>
            </section>
          ))}

          {/* CTA — minimal */}
          <div className="border-t border-white/[0.04] pt-8">
            <div className="text-sm text-white/55">
              从首页选择一个策略，查看信号图表与回测报告。
            </div>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
