import Link from "next/link";
import { ContentfulImage } from "./contentful-image";
import { MarkdownRenderer } from "./markdown-renderer";
import type { ContentfulImage as ContentfulImageData, RichTextDocument, RichTextNode } from "@/lib/contentful";

type RichTextRendererProps = {
  content: RichTextDocument | null;
  fallback?: string | null;
  className?: string;
};

const blockClassName = "break-words whitespace-pre-line leading-8 text-muted";

export function RichTextRenderer({
  content,
  fallback,
  className = "",
}: RichTextRendererProps) {
  if (!content?.json) {
    return fallback ? (
      <MarkdownRenderer className={className}>{fallback}</MarkdownRenderer>
    ) : null;
  }

  const assetsById = new Map(
    content.links.assets.map((asset) => [asset.id, asset]),
  );

  return (
    <div className={className}>
      {content.json.content?.map((node, index) =>
        renderNode(node, `${node.nodeType}-${index}`, assetsById),
      )}
    </div>
  );
}

function renderNode(
  node: RichTextNode,
  key: string,
  assetsById: Map<string, ContentfulImageData>,
): React.ReactNode {
  const children = node.content?.map((child, index) =>
    renderNode(child, `${key}-${index}`, assetsById),
  );

  switch (node.nodeType) {
    case "paragraph":
      return (
        <p className={blockClassName} key={key}>
          {hasRenderableContent(node) ? children : <br aria-hidden="true" />}
        </p>
      );
    case "heading-1":
      return (
        <h1 className="break-words pt-5 text-4xl font-semibold text-foreground" key={key}>
          {children}
        </h1>
      );
    case "heading-2":
      return (
        <h2 className="break-words pt-4 text-3xl font-semibold text-foreground" key={key}>
          {children}
        </h2>
      );
    case "heading-3":
      return (
        <h3 className="break-words pt-3 text-2xl font-semibold text-foreground" key={key}>
          {children}
        </h3>
      );
    case "heading-4":
      return (
        <h4 className="break-words pt-2 text-xl font-semibold text-foreground" key={key}>
          {children}
        </h4>
      );
    case "heading-5":
      return (
        <h5 className="break-words pt-2 text-lg font-semibold text-foreground" key={key}>
          {children}
        </h5>
      );
    case "heading-6":
      return (
        <h6
          className="break-words pt-2 text-base font-semibold uppercase tracking-wide text-foreground"
          key={key}
        >
          {children}
        </h6>
      );
    case "unordered-list":
      return (
        <ul className="list-disc space-y-2 pl-6 text-muted marker:text-accent-text" key={key}>
          {children}
        </ul>
      );
    case "ordered-list":
      return (
        <ol className="list-decimal space-y-2 pl-6 text-muted marker:text-accent-text" key={key}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li className="leading-8" key={key}>
          {children}
        </li>
      );
    case "blockquote":
      return (
        <blockquote
          className="border-l-2 border-accent pl-5 text-lg leading-8 text-foreground"
          key={key}
        >
          {children}
        </blockquote>
      );
    case "hr":
      return <hr className="border-foreground/10" key={key} />;
    case "table":
      return (
        <div className="overflow-x-auto" key={key}>
          <table className="w-full border-collapse text-left text-muted">
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case "table-row":
      return <tr key={key}>{children}</tr>;
    case "table-header-cell":
      return (
        <th
          className="border border-foreground/15 bg-surface px-4 py-3 font-semibold text-foreground"
          key={key}
          scope="col"
        >
          {children}
        </th>
      );
    case "table-cell":
      return (
        <td className="border border-foreground/15 px-4 py-3 align-top" key={key}>
          {children}
        </td>
      );
    case "hyperlink":
      return node.data?.uri ? (
        <InlineLink href={node.data.uri} key={key}>
          {children}
        </InlineLink>
      ) : (
        children
      );
    case "embedded-asset-block":
      return renderEmbeddedAsset(node, key, assetsById);
    case "text":
      return renderText(node, key);
    default:
      return children;
  }
}

function InlineLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  if (!isSafeHref(href)) {
    return children;
  }

  const isInternal = href.startsWith("/");
  const className =
    "break-words rounded-sm font-semibold text-accent-text underline hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return isInternal ? (
    <Link className={className} href={href}>
      {children}
    </Link>
  ) : (
    <a className={className} href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}

function renderEmbeddedAsset(
  node: RichTextNode,
  key: string,
  assetsById: Map<string, ContentfulImageData>,
) {
  const id = node.data?.target?.sys?.id;
  const asset = id ? assetsById.get(id) : null;

  if (!asset) {
    return null;
  }

  if (asset.contentType?.startsWith("image/")) {
    return (
      <figure className="space-y-3" key={key}>
        <ContentfulImage
          className="h-auto w-full rounded-sm border border-foreground/10 object-cover"
          image={asset}
          sizes="(min-width: 1024px) 768px, 100vw"
        />
        {asset.description ? (
          <figcaption className="text-sm leading-6 text-muted">
            {asset.description}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <a
      className="inline-flex break-words rounded-sm font-semibold text-accent-text hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      href={asset.url}
      key={key}
      rel="noreferrer"
      target="_blank"
    >
      {asset.title}
    </a>
  );
}

function renderText(node: RichTextNode, key: string) {
  let content: React.ReactNode = renderTextWithLineBreaks(node.value ?? "", key);

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") {
      content = (
        <strong className="font-semibold text-foreground" key={`${key}-bold`}>
          {content}
        </strong>
      );
    }

    if (mark.type === "italic") {
      content = <em key={`${key}-italic`}>{content}</em>;
    }

    if (mark.type === "underline") {
      content = <u key={`${key}-underline`}>{content}</u>;
    }

    if (mark.type === "superscript") {
      content = <sup key={`${key}-superscript`}>{content}</sup>;
    }

    if (mark.type === "subscript") {
      content = <sub key={`${key}-subscript`}>{content}</sub>;
    }

    if (mark.type === "strikethrough") {
      content = <s key={`${key}-strikethrough`}>{content}</s>;
    }

    if (mark.type === "code") {
      content = (
        <code
          className="rounded-sm bg-surface-warm px-1.5 py-0.5 font-mono text-sm text-foreground"
          key={`${key}-code`}
        >
          {content}
        </code>
      );
    }
  }

  return <span key={key}>{content}</span>;
}

function renderTextWithLineBreaks(value: string, key: string) {
  const lines = value.split(/\r?\n/);

  return lines.flatMap((line, index) =>
    index === 0
      ? [line]
      : [<br key={`${key}-line-break-${index}`} />, line],
  );
}

function hasRenderableContent(node: RichTextNode): boolean {
  return Boolean(
    node.content?.some((child) =>
      child.nodeType === "text"
        ? child.value?.trim()
        : hasRenderableContent(child),
    ),
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
