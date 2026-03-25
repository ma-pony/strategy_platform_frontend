import { Check, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export default function Pricing() {
  const plan = useAuthStore((s) => s.plan);

  return (
    <div className="grid gap-12 animate-in">
      {/* Hero — no container, just bold typography */}
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">升级会员与权益</h1>
        <div className="mt-3 text-sm text-white/50 leading-relaxed">
          免费浏览策略摘要与基础指标，升级会员获取完整信号、回测报告与数据导出。
        </div>
      </div>

      {/* Plans — Pro visually dominant via grid span */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr_1fr] items-start">
        {/* Free */}
        <div className="rounded-xl bg-[color:var(--card)] border border-white/[0.06] p-6">
          <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Free</div>
          <div className="mt-3 text-3xl font-bold text-white tabular-nums">¥0</div>
          <div className="mt-2 text-sm text-white/45">浏览策略摘要与基础指标</div>

          <div className="mt-6 grid gap-2.5">
            {["热门策略榜与基础指标", "信号可见但关键字段模糊", "回测报告仅摘要框架"].map((h) => (
              <div key={h} className="flex items-start gap-2 text-sm text-white/55">
                <Check className="mt-0.5 size-4 text-white/50" />
                <div>{h}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 w-full rounded-lg px-4 py-2.5 text-sm text-center text-white/65 border border-white/[0.08]">
            {plan === "free" || plan === "guest" ? "当前计划" : "Free"}
          </div>
        </div>

        {/* Pro — larger, accent border, gradient hint at top */}
        <div className="relative rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--card)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/50 to-transparent" />
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-[color:var(--accent)] uppercase tracking-wider">Pro</div>
              <span className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-medium text-[color:var(--accent)]">推荐</span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white tabular-nums">¥49</span>
              <span className="text-sm text-white/50">/月</span>
            </div>
            <div className="mt-2 text-sm text-white/55">完整信号、回测报告与数据导出</div>

            <div className="mt-8 grid gap-3">
              {["实时/准实时信号（触发价/强度）", "完整回测假设、数据版本与代币池规则", "导出/下载与高级筛选"].map((h) => (
                <div key={h} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="mt-0.5 size-4 text-[color:var(--success)]" />
                  <div>{h}</div>
                </div>
              ))}
            </div>

            {plan === "member" || plan === "admin" ? (
              <div className="mt-8 w-full rounded-lg px-4 py-3 text-sm text-center font-medium text-[color:var(--accent)] border border-[color:var(--accent)]/30">
                当前计划
              </div>
            ) : (
              <a
                href="mailto:sales@example.com?subject=升级 Pro 会员"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
              >
                <Mail className="size-4" />
                联系销售
              </a>
            )}
            <div className="mt-3 text-xs text-white/50 text-center">联系销售后，我们将在后台为您开通权限</div>
          </div>
        </div>

        {/* Team */}
        <div className="rounded-xl bg-[color:var(--card)] border border-white/[0.06] p-6">
          <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Team</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white tabular-nums">¥199</span>
            <span className="text-sm text-white/50">/月</span>
          </div>
          <div className="mt-2 text-sm text-white/45">团队协作与更高额度</div>

          <div className="mt-6 grid gap-2.5">
            {["更高的信号与导出额度", "策略对比与收藏功能", "团队成员与权限管理"].map((h) => (
              <div key={h} className="flex items-start gap-2 text-sm text-white/55">
                <Check className="mt-0.5 size-4 text-white/50" />
                <div>{h}</div>
              </div>
            ))}
          </div>

          <a
            href="mailto:sales@example.com?subject=咨询 Team 计划"
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm text-white/65 border border-white/[0.08] transition hover:bg-white/[0.04]"
          >
            <Mail className="size-4" />
            联系销售
          </a>
        </div>
      </div>

      {/* Comparison table — no wrapper card */}
      <div>
        <div className="text-base font-semibold text-white">权益对比</div>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs text-white/50">
                <th className="px-4 py-3">能力</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3 text-[color:var(--accent)]">Pro</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ["实时信号（触发价/强度）", "×", "✓"],
                ["完整回测假设与版本披露", "摘要", "全量"],
                ["代币池筛选规则", "×", "✓"],
                ["导出/下载", "×", "✓"],
                ["高级筛选", "×", "✓"],
              ].map((row) => (
                <tr key={row[0]} className="text-white/65">
                  <td className="border-t border-white/[0.04] px-4 py-3">{row[0]}</td>
                  <td className="border-t border-white/[0.04] px-4 py-3 text-white/50">{row[1]}</td>
                  <td className="border-t border-white/[0.04] px-4 py-3 text-[color:var(--accent)]">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-white/50">
          指标定义与风险提示请查看 <Link to="/methodology" className="text-[color:var(--accent)] hover:underline">策略说明页</Link>。
        </div>
      </div>
    </div>
  );
}
