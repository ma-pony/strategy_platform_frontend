import { useEffect, useMemo, useState } from "react";
import { Clock, Newspaper, Sparkles } from "lucide-react";

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
        setError(e instanceof Error ? e.message : "加载失败");
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
    <div className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white md:text-xl">AI 市场研究</h1>
          <div className="mt-1 text-sm text-white/60">投研简报 · 定期更新</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10">
            <Clock className="size-4" />
            <span>{lastUpdated ? `上次更新：${formatRelativeTime(lastUpdated)}` : "上次更新：-"}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10">
            <Sparkles className="size-4" />
            <span>点开标题阅读全文</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        <section className="grid gap-3">
          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[color:var(--card)] p-4 ring-1 ring-white/10">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-white/10" />
                  <div className="mt-4 h-3 w-5/6 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-[color:var(--card)] p-4 text-sm text-white/80 ring-1 ring-white/10">{error}</div>
          ) : reports.length ? (
            reports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openReport(r.id)}
                className="group rounded-2xl bg-[color:var(--card)] p-4 text-left ring-1 ring-white/10 transition hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Newspaper className="mt-0.5 size-4 text-white/60" />
                      <div className="truncate text-sm font-semibold text-white group-hover:text-white">{r.title}</div>
                    </div>
                    <div className="mt-1 text-xs text-white/55">{formatRelativeTime(r.generated_at)}</div>
                  </div>
                  <div className="shrink-0 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10 transition group-hover:bg-white/10">
                    阅读全文
                  </div>
                </div>
                <div className="mt-3 text-sm text-white/70">{r.summary}</div>
                {r.related_coins.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.related_coins.slice(0, 6).map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            ))
          ) : (
            <div className="rounded-2xl bg-[color:var(--card)] p-4 text-sm text-white/80 ring-1 ring-white/10">暂无研究报告</div>
          )}
        </section>

        <aside className="grid gap-4">
          <div className="rounded-2xl bg-[color:var(--card)] p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">结构（投研晨报）</div>
            <div className="mt-2 grid gap-2 text-sm text-white/70">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">观点 / 动态 / 数据快照</div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">事件日历（24–48h）</div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">风险提示 / 来源链接</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Report detail modal */}
      {selectedReport ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedReport(null);
          }}
        >
          <div
            className="mx-4 max-h-[85vh] w-full max-w-[680px] overflow-auto rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-white">{selectedReport.title}</h2>
                <div className="mt-1 text-xs text-white/55">{formatRelativeTime(selectedReport.generated_at)}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                关闭
              </button>
            </div>
            <div className="mt-4 text-sm text-white/80">
              {renderMarkdownLite(selectedReport.content)}
            </div>
            <div className="mt-6 rounded-xl bg-white/5 p-3 text-xs text-white/55 ring-1 ring-white/10">
              免责声明：本研究报告仅供参考，不构成投资建议。
            </div>
          </div>
        </div>
      ) : null}

      {modalLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-white/10">
            <div className="text-sm text-white">加载中…</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
