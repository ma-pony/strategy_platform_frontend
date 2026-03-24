import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const label = match[1];
    const href = match[2];
    nodes.push(
      <a key={`${match.index}-${href}`} href={href} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
        {label}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function renderMarkdownLite(md: string): ReactNode {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-sm leading-6 text-white/80">
        {renderInline(text)}
      </p>,
    );
  };

  const flushList = () => {
    if (!list.length) return;
    const items = list;
    list = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="grid gap-2 pl-5 text-sm leading-6 text-white/80">
        {items.map((it, idx) => (
          <li key={`${idx}-${it}`} className="list-disc">
            {renderInline(it)}
          </li>
        ))}
      </ul>,
    );
  };

  const flushAll = () => {
    flushList();
    flushParagraph();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const t = line.trim();

    if (!t) {
      flushAll();
      continue;
    }

    const heading = t.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const content = heading[2].trim();
      const cls = level === 1 ? "text-base" : "text-sm";
      blocks.push(
        <div key={`h-${blocks.length}`} className={`${cls} font-semibold text-white`}>
          {renderInline(content)}
        </div>,
      );
      continue;
    }

    const bullet = t.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1].trim());
      continue;
    }

    paragraph.push(t);
  }

  flushAll();

  return <div className="grid gap-3">{blocks}</div>;
}

