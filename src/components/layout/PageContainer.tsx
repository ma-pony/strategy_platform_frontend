import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function PageContainer(props: { className?: string; children: ReactNode }) {
  return <div className={cn("container", props.className)}>{props.children}</div>;
}
