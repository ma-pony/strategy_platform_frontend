import { useEffect } from "react";
import { X } from "lucide-react";

import { renderMarkdownLite } from "@/lib/markdownLite";
import type { MarketBrief } from "@/lib/marketResearch";

function canDismiss(target: HTMLElement) {
  return target.dataset.dismiss === "1";
}

export default function BriefModal(props: { open: boolean; brief: MarketBrief | null; onClose: () => void }) {
  const { open, brief, onClose } = props;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open || !brief) return null;

  const createdAt = new Date(brief.createdAt);
  const timeLabel = createdAt.toLocaleString();

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        data-dismiss="1"
        onClick={(e) => {
          const el = e.target as HTMLElement;
          if (canDismiss(el)) onClose();
        }}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[920px] overflow-hidden rounded-2xl bg-[color:var(--card)] ring-1 ring-white/10">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-white">{brief.title}</div>
              <div className="mt-1 text-xs text-white/55">{timeLabel}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-lg bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
              aria-label="close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-auto px-5 py-4">
            {renderMarkdownLite(brief.contentMd)}
          </div>

          <div className="border-t border-white/10 px-5 py-4">
            <div className="text-xs text-white/55">研究信息仅供参考，不构成投资建议。</div>
          </div>
        </div>
      </div>
    </div>
  );
}
