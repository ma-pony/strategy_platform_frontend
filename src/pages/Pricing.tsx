import { Check, Crown, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

type PlanCard = {
  name: string;
  price: string;
  subtitle: string;
  highlights: string[];
  cta: string;
  tone: "neutral" | "accent";
};

export default function Pricing() {
  const plan = useAuthStore((s) => s.plan);
  const setPlan = useAuthStore((s) => s.setPlan);

  const plans: PlanCard[] = [
    {
      name: "Free",
      price: "¥0",
      subtitle: "可理解的免费：看策略摘要与核心指标",
      highlights: ["热门策略榜与基础指标", "信号可见但关键字段模糊", "回测报告仅摘要框架"],
      cta: plan === "free" ? "当前计划" : "切换为 Free",
      tone: "neutral",
    },
    {
      name: "Pro",
      price: "¥49/月",
      subtitle: "可执行的付费：看触发价/强度与完整口径",
      highlights: ["实时/准实时信号（触发价/强度）", "完整回测假设、数据版本与代币池规则", "导出/下载与高级筛选"],
      cta: plan === "member" ? "当前计划" : "一键升级（Demo）",
      tone: "accent",
    },
    {
      name: "Team",
      price: "¥199/月",
      subtitle: "团队研究：更多额度与协作（占位）",
      highlights: ["更高配额与导出能力", "策略对比与收藏上限", "团队成员与权限（预留）"],
      cta: "联系销售（占位）",
      tone: "neutral",
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
        <div className="flex items-start gap-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Crown className="size-5 text-[color:var(--accent)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-white md:text-xl">升级会员与权益</h1>
            <div className="mt-2 text-sm text-white/70">传统研究站常用“可理解的免费 + 可执行的付费”。免费让你理解策略，会员让你拿到足以行动的关键字段与口径。</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-white/70 ring-1 ring-white/10">
                <Shield className="size-4" />
                风险提示与口径透明
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-white/70 ring-1 ring-white/10">
                <Sparkles className="size-4" />
                试用/退款文案位（可选）
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn(
              "rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10",
              p.tone === "accent" && "ring-[color:var(--accent)]/40",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{p.price}</div>
                <div className="mt-1 text-sm text-white/60">{p.subtitle}</div>
              </div>
              {p.tone === "accent" ? (
                <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-1 text-xs text-[color:var(--accent)]">推荐</span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-2">
              {p.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2 text-sm text-white/75">
                  <Check className="mt-0.5 size-4 text-[color:var(--success)]" />
                  <div>{h}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  if (p.name === "Free") setPlan("free");
                  if (p.name === "Pro") setPlan("member");
                }}
                className={cn(
                  "w-full rounded-lg px-4 py-2 text-sm font-medium transition",
                  p.tone === "accent"
                    ? "bg-[color:var(--accent)] text-white hover:brightness-110"
                    : "bg-white/5 text-white/85 ring-1 ring-white/10 hover:bg-white/10",
                )}
              >
                {p.cta}
              </button>
              <div className="mt-3 text-xs text-white/55">
                这是前端演示：按钮会直接切换计划权限（真实环境应由支付回调写入订阅状态后计算 entitlements）。
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
        <div className="text-sm font-semibold text-white">权益对比（摘要）</div>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs text-white/55">
                <th className="px-4 py-3">能力</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3">Pro</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ["实时信号（触发价/强度）", "×", "✓"],
                ["完整回测假设与版本披露", "摘要", "全量"],
                ["代币池规则（rule_json）", "×", "✓"],
                ["导出/下载", "×", "✓"],
                ["高级筛选", "×", "✓"],
              ].map((row) => (
                <tr key={row[0]} className="text-white/80">
                  <td className="border-t border-white/10 px-4 py-3">{row[0]}</td>
                  <td className="border-t border-white/10 px-4 py-3 text-white/70">{row[1]}</td>
                  <td className="border-t border-white/10 px-4 py-3 text-white/70">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-white/55">
          口径与风险提示请查看 <Link to="/methodology" className="text-[color:var(--accent)] hover:underline">策略说明页</Link>。
        </div>
      </div>
    </div>
  );
}
