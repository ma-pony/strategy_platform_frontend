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
        "group w-full rounded-xl bg-white/5 p-4 text-left ring-1 ring-white/10 transition hover:bg-white/10",
        props.className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
          <Lock className="size-4 text-white/70" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-white">{props.title ?? "会员内容"}</div>
            <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-[11px] text-[color:var(--accent)]">锁定</span>
          </div>
          <div className="mt-1 text-xs text-white/55">{props.description ?? "点击查看权益与解锁方式"}</div>
          <div className="mt-3 grid gap-2">
            <div className="h-2 w-11/12 rounded bg-white/10" />
            <div className="h-2 w-9/12 rounded bg-white/10" />
            <div className="h-2 w-10/12 rounded bg-white/10" />
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-white/55 transition group-hover:text-white/70">解锁后可见：实时信号、完整回测口径、导出与更多筛选</div>
    </button>
  );
}
