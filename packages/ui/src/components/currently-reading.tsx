import * as React from "react";
import { cn } from "../lib/cn";
import { Progress } from "./progress";
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
  /** Total pages. A positive finite number is required to display progress. */
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

/** A small bookshelf entry with truthful, app-supplied reading progress. */
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
      className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface p-3", className)}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="ui-label">Bookshelf</span>
        {loading ? <span className="text-xs text-ink-2">Loading</span> : book ? (
          <Status tone={state === "finished" ? "ok" : "neutral"} className="text-xs">{label}</Status>
        ) : null}
      </div>
      {loading ? (
        <div className="flex items-start gap-3" aria-label="Loading book">
          <Skeleton delay={0} className="h-[72px] w-12 shrink-0 rounded-ui" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1"><Skeleton delay={0} className="h-3 w-3/4" /><Skeleton delay={0} className="h-3 w-1/2" /></div>
        </div>
      ) : book ? (
        <>
          <div className="flex items-start gap-3">
            <BookCover key={book.cover} src={book.cover} />
            <div className="min-w-0 flex-1 pt-0.5">
              {book.href ? (
                <a href={book.href} className="block rounded-ui text-ui font-medium break-words text-accent outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{book.title}</a>
              ) : <div className="text-ui font-medium break-words text-ink">{book.title}</div>}
              <div className="mt-0.5 text-xs break-words text-ink-2">{book.author}</div>
              {current !== null && total !== null ? (
                <div className="mt-3">
                  <Progress value={current} max={total} aria-label="Reading progress" aria-valuetext={`Page ${current} of ${total}`} />
                  <div aria-hidden="true" className="mt-1.5 font-mono text-[11px] text-ink-3 tabular-nums">{current} / {total} pages</div>
                </div>
              ) : null}
            </div>
          </div>
          {note ? <div className="mt-3 border-t border-line pt-3 text-ui leading-relaxed text-ink-2">{note}</div> : null}
        </>
      ) : <p className="text-ui text-ink-2">Nothing on the bookshelf right now.</p>}
    </div>
  );
}

function BookCover({ src }: { src?: string }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <div aria-hidden="true" className="flex h-[72px] w-12 shrink-0 items-center justify-center overflow-hidden rounded-ui bg-panel text-ink-3 shadow-[inset_0_0_0_1px_var(--ui-line)]">
      {src && !failed ? <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} /> : (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 4h13v16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0v12m-2 2a2 2 0 0 1 2-2h13M9 8h7M9 11h5" />
        </svg>
      )}
    </div>
  );
}
