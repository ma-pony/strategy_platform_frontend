import { cn } from "@/lib/utils";

export default function PairFilterBar({
  pairs,
  active,
  onChange,
}: {
  pairs: string[];
  active: string | null;
  onChange: (pair: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-auto pb-1">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "shrink-0 rounded-lg px-3 py-1.5 text-xs transition",
          active === null
            ? "bg-white/10 text-white font-medium border border-white/[0.12]"
            : "bg-white/5 text-white/60 border border-white/[0.06] hover:bg-white/10",
        )}
      >
        全部
      </button>
      {pairs.map((pair) => {
        const coin = pair.split("/")[0];
        return (
          <button
            key={pair}
            type="button"
            onClick={() => onChange(pair)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-xs transition",
              active === pair
                ? "bg-white/10 text-white font-medium border border-white/[0.12]"
                : "bg-white/5 text-white/60 border border-white/[0.06] hover:bg-white/10",
            )}
          >
            {coin}
          </button>
        );
      })}
    </div>
  );
}
