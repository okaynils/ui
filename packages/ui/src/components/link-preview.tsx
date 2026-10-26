import * as React from "react";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";

export interface LinkPreviewProps extends Omit<React.ComponentProps<"div">, "title" | "children"> {
  /** Destination supplied by the app. HTTP(S), mailto, tel and relative links are supported. */
  href: string;
  title: string;
  description?: string;
  /** A small site icon. Missing or broken icons show a link outline. */
  favicon?: string;
  /** Optional preview image, displayed as a square thumbnail with rounded corners. */
  image?: string;
  /** Your own note, outside the link so it can contain separate interactive content. */
  annotation?: React.ReactNode;
  /** Opt into a new tab with `_blank`. Defaults to normal same-tab navigation. */
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  /** Reserve the preview's space without exposing a clickable placeholder. */
  loading?: boolean;
}

function destination(href: string): { href?: string; label: string } {
  const trimmed = href.trim();
  // Browser URL parsing ignores control characters in schemes; validate the
  // same normalised form so a copied metadata URL cannot become script code.
  const normalised = trimmed.replace(/[\u0000-\u0020\u007f]/g, "");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(normalised)?.[1]?.toLowerCase();
  if (!trimmed || (scheme && !["http", "https", "mailto", "tel"].includes(scheme))) return { label: "Link unavailable" };
  if (scheme === "mailto") return { href: trimmed, label: "Email" };
  if (scheme === "tel") return { href: trimmed, label: "Phone" };
  try {
    const url = new URL(trimmed, "https://local.invalid");
    const local = !scheme && !normalised.startsWith("//");
    return { href: trimmed, label: local ? (trimmed.startsWith("#") ? "On this page" : "Local link") : url.hostname.replace(/^www\./, "") };
  } catch {
    return { label: "Link unavailable" };
  }
}

/** A supplied bookmark preview. Metadata and personal annotations stay separate. */
export function LinkPreview({
  href,
  title,
  description,
  favicon,
  image,
  annotation,
  target,
  rel,
  loading = false,
  className,
  ...props
}: LinkPreviewProps) {
  const link = destination(href);
  const safeRel = target === "_blank"
    ? [...new Set([...(rel ?? "").split(/\s+/).filter((word) => word && word.toLowerCase() !== "opener"), "noopener", "noreferrer"])].join(" ")
    : rel;
  const content = (
    <>
      {image ? <PreviewImage key={image} src={image} thumbnail /> : null}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex min-w-0 items-center gap-1.5 text-xs text-ink-3">
          <PreviewImage key={favicon ?? "favicon"} src={favicon} />
          <span className="min-w-0 truncate font-mono text-[11px]">{link.label}</span>
          {link.href && target === "_blank" ? <span className="sr-only">, opens in a new tab</span> : null}
        </div>
        <div className={cn("line-clamp-2 text-ui font-medium break-words", link.href ? "text-accent group-hover:underline" : "text-ink")}>{title || "Untitled link"}</div>
        {description ? <p className="mt-1 line-clamp-2 text-xs leading-relaxed break-words text-ink-2">{description}</p> : null}
      </div>
      {link.href ? <ArrowIcon /> : null}
    </>
  );

  return (
    <div
      {...props}
      aria-busy={loading || undefined}
      className={cn("w-full max-w-sm overflow-hidden rounded-box border border-line-strong bg-surface", className)}
    >
      {loading ? (
        <div role="status" className="flex items-start gap-3 p-3">
          <span className="sr-only">Loading link preview</span>
          {image ? <Skeleton delay={0} className="size-16 shrink-0 rounded-ui" /> : null}
          <div className="flex min-w-0 flex-1 flex-col gap-2 py-0.5"><Skeleton delay={0} className="h-2.5 w-24" /><Skeleton delay={0} className="h-3 w-3/4" /><Skeleton delay={0} className="h-3 w-full" /></div>
        </div>
      ) : link.href ? (
        <a
          href={link.href}
          target={target}
          rel={safeRel}
          className="group flex min-w-0 items-start gap-3 p-3 outline-none transition-colors duration-120 hover:bg-panel focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          {content}
        </a>
      ) : <div className="flex min-w-0 items-start gap-3 p-3">{content}</div>}
      {!loading && annotation !== undefined && annotation !== null ? (
        <div className="border-t border-line bg-panel px-3 py-2.5 text-ui leading-relaxed break-words text-ink-2">{annotation}</div>
      ) : null}
    </div>
  );
}

function PreviewImage({ src, thumbnail = false }: { src?: string; thumbnail?: boolean }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <span aria-hidden="true" className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-ui text-ink-3", thumbnail ? "size-16 bg-panel shadow-[inset_0_0_0_1px_var(--ui-line)]" : "size-3.5")}>
      {src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="size-full object-cover" /> : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className={thumbnail ? "size-5" : "size-3.5"}>
          <path d="m6.5 9.5 3-3M5 10.5l-1 1a2.5 2.5 0 0 1-3.5-3.5l3-3A2.5 2.5 0 0 1 7 5m2 6a2.5 2.5 0 0 0 3.5 0l3-3A2.5 2.5 0 0 0 12 4.5l-1 1" transform="translate(.25 0) scale(.94)" />
        </svg>
      )}
    </span>
  );
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-3.5 shrink-0 text-ink-3"><path d="M4 12 12 4M4.5 4H12v7.5" /></svg>;
}
