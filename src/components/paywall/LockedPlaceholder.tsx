import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

export default function LockedPlaceholder(props: {
  title?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "group w-full rounded-xl bg-white/5 p-4 text-left border border-white/[0.06] transition hover:bg-white/10",
        props.className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-white/5 border border-white/[0.06]">
          <Lock className="size-4 text-white/70" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-white">{props.title ?? "会员专属内容"}</div>
            <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-xs text-[color:var(--accent)]">Pro</span>
          </div>
          <div className="mt-1 text-xs text-white/45">{props.description ?? "升级会员即可查看"}</div>
          <div className="mt-3 grid gap-2">
            <div className="h-2 w-11/12 rounded bg-white/10" />
            <div className="h-2 w-9/12 rounded bg-white/10" />
            <div className="h-2 w-10/12 rounded bg-white/10" />
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-white/45 transition group-hover:text-white/70">包含：完整信号数据、回测报告、数据导出</div>
    </button>
  );
}
