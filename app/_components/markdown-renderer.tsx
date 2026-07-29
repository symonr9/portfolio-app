import Link from "next/link";

type MarkdownProps = {
  children: string;
  className?: string;
};

type MarkdownBlock =
  | { type: "paragraph"; lines: string[] }
  | { type: "heading"; level: number; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "blockquote"; lines: string[] }
  | { type: "code"; text: string }
  | { type: "rule" };

const inlineTokenPattern =
  /(\[[^\]]+\]\([^)]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_)/g;

export function MarkdownRenderer({ children, className = "" }: MarkdownProps) {
  return (
    <div className={className}>
      {parseBlocks(children).map((block, index) =>
        renderBlock(block, `markdown-block-${index}`),
      )}
    </div>
  );
}

export function MarkdownInline({ children, className = "" }: MarkdownProps) {
  return (
    <span className={className}>
      {renderInline(children, "markdown-inline")}
    </span>
  );
}

function renderBlock(block: MarkdownBlock, key: string) {
  if (block.type === "heading") {
    const content = renderInline(block.text, key);
    const className = "break-words font-semibold text-foreground";

    if (block.level === 1) {
      return (
        <h2 className={`${className} text-3xl`} key={key}>
          {content}
        </h2>
      );
    }

    if (block.level === 2) {
      return (
        <h3 className={`${className} text-2xl`} key={key}>
          {content}
        </h3>
      );
    }

    return (
      <h4 className={`${className} text-xl`} key={key}>
        {content}
      </h4>
    );
  }

  if (block.type === "unordered-list" || block.type === "ordered-list") {
    const List = block.type === "ordered-list" ? "ol" : "ul";
    const markerClass =
      block.type === "ordered-list" ? "list-decimal" : "list-disc";

    return (
      <List
        className={`${markerClass} space-y-2 pl-6 text-muted marker:text-accent-text`}
        key={key}
      >
        {block.items.map((item, index) => (
          <li className="leading-8" key={`${key}-${index}`}>
            {renderInline(item, `${key}-${index}`)}
          </li>
        ))}
      </List>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote
        className="border-l-2 border-accent pl-5 text-lg leading-8 text-foreground"
        key={key}
      >
        {renderLines(block.lines, key)}
      </blockquote>
    );
  }

  if (block.type === "code") {
    return (
      <pre
        className="overflow-x-auto rounded-sm bg-surface-warm p-4 font-mono text-sm text-foreground"
        key={key}
      >
        <code>{block.text}</code>
      </pre>
    );
  }

  if (block.type === "rule") {
    return <hr className="border-foreground/10" key={key} />;
  }

  return (
    <p className="break-words leading-8 text-muted" key={key}>
      {renderLines(block.lines, key)}
    </p>
  );
}

function renderLines(lines: string[], key: string) {
  return lines.flatMap((line, index) => [
    ...(index ? [<br key={`${key}-break-${index}`} />] : []),
    ...renderInline(line, `${key}-line-${index}`),
  ]);
}

function renderInline(text: string, key: string): React.ReactNode[] {
  return text
    .split(inlineTokenPattern)
    .filter(Boolean)
    .map((token, index) => {
      const tokenKey = `${key}-${index}`;
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (link && isSafeHref(link[2])) {
        const [, label, href] = link;
        const className =
          "rounded-sm font-semibold text-accent-text underline hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

        return href.startsWith("/") ? (
          <Link className={className} href={href} key={tokenKey}>
            {renderInline(label, `${tokenKey}-label`)}
          </Link>
        ) : (
          <a
            className={className}
            href={href}
            key={tokenKey}
            rel="noreferrer"
            target="_blank"
          >
            {renderInline(label, `${tokenKey}-label`)}
          </a>
        );
      }

      if (token.startsWith("**") || token.startsWith("__")) {
        return (
          <strong className="font-semibold text-foreground" key={tokenKey}>
            {renderInline(token.slice(2, -2), `${tokenKey}-strong`)}
          </strong>
        );
      }

      if (token.startsWith("*") || token.startsWith("_")) {
        return (
          <em key={tokenKey}>
            {renderInline(token.slice(1, -1), `${tokenKey}-em`)}
          </em>
        );
      }

      if (token.startsWith("~~")) {
        return (
          <s key={tokenKey}>
            {renderInline(token.slice(2, -2), `${tokenKey}-strike`)}
          </s>
        );
      }

      if (token.startsWith("`")) {
        return (
          <code
            className="rounded-sm bg-surface-warm px-1.5 py-0.5 font-mono text-sm text-foreground"
            key={tokenKey}
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      return token;
    });
}

function parseBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += index < lines.length ? 1 : 0;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: Math.min(heading[1].length, 3),
        text: heading[2],
      });
      index += 1;
      continue;
    }

    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*[-*+]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*\d+[.)]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", lines: quoteLines });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isSpecialBlockStart(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: "paragraph", lines: paragraphLines });
  }

  return blocks;
}

function isSpecialBlockStart(line: string) {
  return (
    /^#{1,6}\s+/.test(line) ||
    /^\s*```/.test(line) ||
    /^\s*(?:---+|\*\*\*+)\s*$/.test(line) ||
    /^\s*[-*+]\s+/.test(line) ||
    /^\s*\d+[.)]\s+/.test(line) ||
    /^\s*>\s?/.test(line)
  );
}

function isSafeHref(href: string) {
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}
