import { cn } from "@/lib/utils";

export default function BlurredValue(props: { text?: string; width?: number | string; onClick?: () => void; className?: string }) {
  const w = props.width ?? 120;
  const widthStyle = typeof w === "number" ? `${w}px` : w;
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-white/5 px-2 py-1 text-xs text-white/60 ring-1 ring-white/10 transition hover:bg-white/10",
        props.className,
      )}
      style={{ width: widthStyle }}
    >
      <span className="select-none blur-[4px]">{props.text ?? "████████"}</span>
      <span className="ml-2 select-none text-[10px] text-white/45">解锁</span>
    </button>
  );
}
