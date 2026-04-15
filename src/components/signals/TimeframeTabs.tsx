import { cn } from "@/lib/utils";

export default function TimeframeTabs({
  timeframes,
  active,
  onChange,
}: {
  timeframes: string[];
  active: string | null;
  onChange: (tf: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-auto">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "shrink-0 rounded-lg px-3 py-1.5 text-xs transition",
          active === null
            ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)] font-medium border border-[color:var(--accent)]/20"
            : "bg-white/5 text-white/60 border border-white/[0.06] hover:bg-white/10",
        )}
      >
        全部
      </button>
      {timeframes.map((tf) => (
        <button
          key={tf}
          type="button"
          onClick={() => onChange(tf)}
          className={cn(
            "shrink-0 rounded-lg px-3 py-1.5 text-xs transition",
            active === tf
              ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)] font-medium border border-[color:var(--accent)]/20"
              : "bg-white/5 text-white/60 border border-white/[0.06] hover:bg-white/10",
          )}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
