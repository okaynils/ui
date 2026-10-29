import * as React from "react";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";
import { Skeleton } from "./skeleton";
import { Status } from "./status";

export type CurrentlyReadingState = "reading" | "paused" | "finished";

export interface CurrentlyReadingBook {
  title: string;
  author: string;
  /** Cover URL. Missing or failed images show a quiet book outline. */
  cover?: string;
  /** Explicit destination for the title, such as a review or book page. */
  href?: string;
  /** Total pages. A positive finite number is required to place the bookmark. */
  totalPages?: number;
}

export interface CurrentlyReadingProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Supplied book data, or null for an empty bookshelf. */
  book: CurrentlyReadingBook | null;
  state?: CurrentlyReadingState;
  /** Current page. Omit when progress is unknown. Clamped to the book's page range. */
  page?: number;
  /** A short personal annotation, separate from the book's metadata. */
  note?: React.ReactNode;
  loading?: boolean;
}

// The page block under the cover grows with the book: 3px for a novella,
// 10px for a brick. Clamped so a 1,500-page book doesn't dwarf its cover.
const EDGE_MIN = 3;
const EDGE_MAX = 10;
const PAGES_PER_PX = 80;

/**
 * A book on the nightstand: the cover, a block of pages as thick as the book,
 * and a bookmark ribbon hanging out of the pages where you are.
 */
export function CurrentlyReading({
  book,
  state = "reading",
  page,
  note,
  loading = false,
  className,
  ...props
}: CurrentlyReadingProps) {
  const total = typeof book?.totalPages === "number" && Number.isFinite(book.totalPages) && book.totalPages >= 1
    ? Math.floor(book.totalPages)
    : null;
  const current = state === "finished" && total !== null
    ? total
    : total !== null && typeof page === "number" && Number.isFinite(page)
      ? Math.min(total, Math.max(0, Math.floor(page)))
      : null;
  const label = state === "finished" ? "Finished" : state === "paused" ? "Paused" : "Reading";

  return (
    <div
      role="group"
      aria-label="Reading activity"
      {...props}
      aria-busy={loading || undefined}
      data-state={loading ? "loading" : book ? state : "empty"}
      className={cn("flex w-full max-w-sm items-start gap-4", className)}
    >
      {loading ? (
        <>
          <Skeleton delay={0} className="h-[84px] w-14 shrink-0 rounded-ui" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1" aria-label="Loading book">
            <Skeleton delay={0} className="h-3 w-1/3" /><Skeleton delay={0} className="h-3 w-3/4" /><Skeleton delay={0} className="h-3 w-1/2" />
          </div>
        </>
      ) : book ? (
        <>
          <Book cover={book.cover} total={total} current={current} />
          <div className="min-w-0 flex-1">
            <Status tone={state === "finished" ? "ok" : "neutral"} className="text-xs">{label}</Status>
            {book.href ? (
              <a href={book.href} className="mt-1 block rounded-ui text-ui font-medium break-words text-accent outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{book.title}</a>
            ) : <div className="mt-1 text-ui font-medium break-words text-ink">{book.title}</div>}
            <div className="text-xs break-words text-ink-2">{book.author}</div>
            {current !== null && total !== null ? (
              <div className="mt-2 font-mono text-[11px] text-ink-3 tabular-nums">
                <span className="sr-only">Page {current} of {total}</span>
                <span aria-hidden="true" className="inline-flex items-baseline">
                  p.&nbsp;<NumberRoll value={current} locale="en" format={{ useGrouping: false }} className="text-ink-2" />&nbsp;of {total}
                </span>
              </div>
            ) : null}
            {note ? <div className="mt-2 text-ui leading-relaxed text-ink-2">{note}</div> : null}
          </div>
        </>
      ) : (
        <>
          {/* An empty slot on the shelf, where a book would stand. */}
          <span aria-hidden="true" className="h-[84px] w-14 shrink-0 rounded-ui border border-dashed border-line-strong" />
          <p className="pt-1 text-ui text-ink-2">Nothing on the bookshelf right now.</p>
        </>
      )}
    </div>
  );
}

function Book({ cover, total, current }: { cover?: string; total: number | null; current: number | null }) {
  const edge = total === null ? EDGE_MIN : Math.round(Math.min(EDGE_MAX, Math.max(EDGE_MIN, total / PAGES_PER_PX)));
  const fraction = current !== null && total !== null ? current / total : null;
  return (
    <div aria-hidden="true" className="relative w-14 shrink-0 pb-3">
      <BookCover key={cover} src={cover} />
      {/* The page block: fine vertical lines, like the edges of the leaves. */}
      <div
        className="mx-0.5 rounded-b-[2px] shadow-[inset_0_0_0_1px_var(--ui-line-strong)]"
        style={{
          height: edge,
          background: "repeating-linear-gradient(90deg, var(--ui-surface) 0 1px, var(--ui-line-strong) 1px 2px)",
        }}
      />
      {fraction !== null ? (
        // The ribbon hangs out of the pages where the reader is. Its left
        // edge moves, so a change of page is a short slide along the book.
        <span
          className="absolute h-3 w-1 -translate-x-1/2 bg-ink-2 transition-[left] duration-200 ease-snap [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]"
          style={{ left: `calc(4px + (100% - 8px) * ${fraction})`, top: `calc(84px + ${edge}px - 2px)` }}
        />
      ) : null}
    </div>
  );
}

function BookCover({ src }: { src?: string }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <div className="relative z-1 flex h-[84px] w-14 items-center justify-center overflow-hidden rounded-ui bg-panel text-ink-3 shadow-[inset_0_0_0_1px_var(--ui-line)]">
      {src && !failed ? <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} /> : (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 4h13v16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0v12m-2 2a2 2 0 0 1 2-2h13M9 8h7M9 11h5" />
        </svg>
      )}
    </div>
  );
}
