import { useEffect, useState } from "react";
import { Clock, Newspaper } from "lucide-react";

import { listReports, getReport } from "@/api/reports";
import type { ReportRead, ReportDetailRead } from "@/api/types";
import { renderMarkdownLite } from "@/lib/markdownLite";

function formatRelativeTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function MarketResearch() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportRead[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportDetailRead | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    listReports(1, 20)
      .then((res) => {
        if (!alive) return;
        setReports(res.items);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "加载失败，请刷新页面重试");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const lastUpdated = reports[0]?.generated_at;

  const openReport = async (reportId: number) => {
    setModalLoading(true);
    try {
      const detail = await getReport(reportId);
      setSelectedReport(detail);
    } catch {
      // ignore
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="grid gap-10">
      {/* Hero — no container */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">AI 市场研究</h1>
          <div className="mt-2 text-sm text-white/50">投研简报 · 定期更新 · 点开标题阅读全文</div>
        </div>
        {lastUpdated ? (
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Clock className="size-3.5" />
            <span>上次更新：{formatRelativeTime(lastUpdated)}</span>
          </div>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Report list */}
        <section className="grid gap-3 stagger">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[color:var(--card)] p-5 border border-white/[0.06] animate-in">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                <div className="mt-4 h-3 w-5/6 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))
          ) : error ? (
            <div className="rounded-xl bg-[color:var(--card)] p-5 text-sm text-white/70 border border-white/[0.06]">{error}</div>
          ) : reports.length ? (
            reports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openReport(r.id)}
                className="group rounded-xl bg-[color:var(--card)] p-5 text-left border border-white/[0.06] transition hover:border-white/[0.12] animate-in"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Newspaper className="mt-0.5 size-4 text-white/50" />
                      <div className="truncate text-sm font-semibold text-white">{r.title}</div>
                    </div>
                    <div className="mt-1 text-xs text-white/50">{formatRelativeTime(r.generated_at)}</div>
                  </div>
                  <div className="shrink-0 text-xs text-[color:var(--accent)] opacity-0 group-hover:opacity-100 transition">
                    阅读 →
                  </div>
                </div>
                <div className="mt-3 text-sm text-white/60 line-clamp-2">{r.summary}</div>
                {r.related_coins.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.related_coins.slice(0, 6).map((t) => (
                      <span key={t} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            ))
          ) : (
            <div className="text-sm text-white/50">暂无研究报告</div>
          )}
        </section>

        {/* Sidebar — no nested cards, use border-left */}
        <aside className="lg:sticky lg:top-20 lg:self-start px-1">
          <div className="text-xs font-medium text-white/50 uppercase tracking-wider">报告结构</div>
          <div className="mt-3 grid gap-1.5 text-sm text-white/50">
            <div className="border-l-2 border-[color:var(--accent)]/25 pl-3 py-1">观点 / 动态 / 数据快照</div>
            <div className="border-l-2 border-white/[0.08] pl-3 py-1">事件日历（24–48h）</div>
            <div className="border-l-2 border-white/[0.08] pl-3 py-1">风险提示 / 来源链接</div>
          </div>
          <div className="mt-6 text-xs text-white/50">
            研究信息仅供参考，不构成投资建议。
          </div>
        </aside>
      </div>

      {/* Report detail modal */}
      {selectedReport ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedReport.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade"
          onClick={() => setSelectedReport(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedReport(null);
          }}
        >
          <div
            className="mx-4 max-h-[85vh] w-full max-w-[680px] overflow-auto rounded-xl bg-[color:var(--card)] p-6 border border-white/[0.06] animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white tracking-tight">{selectedReport.title}</h2>
                <div className="mt-1 text-xs text-white/50">{formatRelativeTime(selectedReport.generated_at)}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
              >
                关闭
              </button>
            </div>
            <div className="mt-6 text-sm text-white/75 leading-relaxed">
              {renderMarkdownLite(selectedReport.content)}
            </div>
            <div className="mt-8 border-t border-white/[0.04] pt-4 text-xs text-white/50">
              免责声明：本研究报告仅供参考，不构成投资建议。
            </div>
          </div>
        </div>
      ) : null}

      {modalLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade">
          <div className="flex items-center gap-3 rounded-xl bg-[color:var(--card)] px-6 py-4 border border-white/[0.06] animate-scale">
            <div className="size-4 rounded-full border-2 border-white/20 border-t-[color:var(--accent)] animate-spin" />
            <div className="text-sm text-white/70">加载中…</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
