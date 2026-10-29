import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Callout } from "./callout";
import { Field } from "./field";
import { Form } from "./form";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";
import { Textarea } from "./textarea";

export interface GuestbookEntry {
  id: string;
  /** The name the visitor signed with. */
  name: string;
  message: string;
  /** When it was signed: a `Date`, an ISO string or Unix milliseconds. */
  createdAt: Date | string | number;
  /** The visitor's site or profile, if they left one. Links their name. */
  href?: string;
  /** Where they signed from, shown as "from Stockholm". */
  location?: string;
  /** The entry's number in your ledger. Defaults to its position in `entries`, oldest being #0001. */
  number?: number;
}

export interface GuestbookSigned {
  /** The trimmed name, or "Anonymous" when it was left empty. */
  name: string;
  message: string;
  /** Only present when `fields` asks for it and the visitor filled it in. */
  homepage?: string;
  location?: string;
}

export type GuestbookField = "homepage" | "location";

export interface GuestbookProps extends Omit<React.ComponentProps<"div">, "children" | "onSubmit"> {
  /** Entries the app supplies, oldest first. The ledger shows them newest first. */
  entries: readonly GuestbookEntry[];
  /**
   * Receives each signed message. Return a promise to keep the form pending;
   * throw to show the message's error. Without it the demo clears the form.
   */
  onSubmit?: (entry: GuestbookSigned) => void | Promise<void>;
  /** Label at the top of the ledger. */
  heading?: React.ReactNode;
  /** Optional fields to ask for besides name and message. */
  fields?: readonly GuestbookField[];
  /** Maximum message length, shown in a counter. Defaults to 280. */
  maxLength?: number;
  /** Note under the form, e.g. how entries are reviewed. */
  note?: React.ReactNode;
  /** Shown in place of the ledger when the app supplies no entries. */
  emptyMessage?: React.ReactNode;
  /** Locale for the entry dates. */
  locale?: Intl.LocalesArgument;
}

// How long a newly signed entry keeps its change flash; matches `ui-flash`.
const FLASH_MS = 1000;

// Visitors type these links, so only web addresses become links; anything
// else (javascript:, data:, a typo) shows the name as plain text.
function webLink(href: string | undefined): string | undefined {
  if (!href) return undefined;
  try {
    const url = new URL(href.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function parseDate(value: Date | string | number): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Entries the ledger didn't have before, after the first render. */
function useFreshIds(ids: readonly string[]): ReadonlySet<string> {
  const seen = React.useRef<Set<string> | null>(null);
  const [fresh, setFresh] = React.useState<ReadonlySet<string>>(() => new Set());
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());

  React.useLayoutEffect(() => {
    // Entries already there on first render are history, not news.
    if (seen.current === null) {
      seen.current = new Set(ids);
      return;
    }
    const arrived = ids.filter((id) => !seen.current!.has(id));
    ids.forEach((id) => seen.current!.add(id));
    if (!arrived.length) return;
    setFresh((current) => new Set([...current, ...arrived]));
    // The flash lives in state, not in a render-time check, so typing in the
    // form (which re-renders) can't cut it short.
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setFresh((current) => new Set([...current].filter((id) => !arrived.includes(id))));
    }, FLASH_MS);
    timers.current.add(timer);
  }, [ids.join("\u0000")]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return fresh;
}

/**
 * An old-web guestbook: a numbered ledger of supplied entries, newest on
 * top, and a form to sign it. A new entry lands with a change flash while
 * the entry count rolls. Nothing is stored here — the app receives each
 * signature, decides whether it's published and supplies the entries back.
 */
export function Guestbook({
  entries,
  onSubmit,
  heading = "Guestbook",
  fields = [],
  maxLength = 280,
  note,
  emptyMessage = "No signatures yet. Be the first.",
  locale,
  className,
  ...props
}: GuestbookProps) {
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [homepage, setHomepage] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fresh = useFreshIds(entries.map((entry) => entry.id));
  const formTitle = React.useId();

  const dateFormat = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    setPending(true);
    setError(null);
    try {
      await onSubmit?.({
        name: name.trim() || "Anonymous",
        message: trimmed,
        ...(fields.includes("homepage") && homepage.trim() ? { homepage: homepage.trim() } : {}),
        ...(fields.includes("location") && location.trim() ? { location: location.trim() } : {}),
      });
      setName("");
      setMessage("");
      setHomepage("");
      setLocation("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't save your signature. Try again in a moment.");
    } finally {
      setPending(false);
    }
  };

  // Ledger order: newest on top, each keeping the number it was signed under.
  const rows = entries.map((entry, index) => ({ entry, number: entry.number ?? index + 1 })).reverse();

  return (
    <div {...props} className={cn("w-full max-w-md rounded-box border border-line-strong bg-surface", className)}>
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
        <span className="ui-label">{heading}</span>
        <span className="font-mono text-xs text-ink-3">
          <NumberRoll value={entries.length} locale="en" format={{ minimumIntegerDigits: 4, useGrouping: false }} className="text-ink" />
          {" "}{entries.length === 1 ? "signature" : "signatures"}
        </span>
      </div>

      <Form onSubmit={handleSubmit} aria-labelledby={formTitle} className="gap-3 border-b border-line px-4 py-4">
        <div id={formTitle} className="text-ui font-medium text-ink">Sign the guestbook</div>
        <div className={cn("grid gap-3", fields.length ? "sm:grid-cols-2" : null)}>
          <Field label="Name" description={fields.length ? undefined : "Leave it empty to sign as anonymous."}>
            <Input value={name} onValueChange={setName} maxLength={40} placeholder="Anonymous" autoComplete="name" />
          </Field>
          {fields.includes("location") ? (
            <Field label="From">
              <Input value={location} onValueChange={setLocation} maxLength={40} placeholder="City or place" autoComplete="address-level2" />
            </Field>
          ) : null}
          {fields.includes("homepage") ? (
            <Field label="Homepage" className={fields.length === 1 ? undefined : "sm:col-span-2"}>
              <Input type="url" value={homepage} onValueChange={setHomepage} placeholder="https://" autoComplete="url" />
            </Field>
          ) : null}
        </div>
        <Field label="Message">
          <Textarea
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={maxLength}
            rows={3}
            placeholder="Say hello."
          />
        </Field>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-ink-3 tabular-nums">
            {message.length}/{maxLength}
          </span>
          <Button type="submit" variant="primary" size="sm" loading={pending}>
            Sign
          </Button>
        </div>
        {error ? (
          <Callout role="alert" tone="err" title="Signature not saved">
            {error}
          </Callout>
        ) : null}
        {note ? <p className="text-xs text-ink-3">{note}</p> : null}
      </Form>

      {rows.length === 0 ? (
        <p className="px-4 py-4 text-ui text-ink-2">{emptyMessage}</p>
      ) : (
        <ol aria-label={`${typeof heading === "string" ? heading : "Guestbook"} entries, newest first`} className="divide-y divide-line">
          {rows.map(({ entry, number }) => {
            const date = parseDate(entry.createdAt);
            return (
              <li key={entry.id} className={cn("flex gap-3 px-4 py-3", fresh.has(entry.id) && "ui-flash")}>
                <span className="w-11 shrink-0 pt-px font-mono text-xs text-ink-3 tabular-nums">
                  #{String(number).padStart(4, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="min-w-0 text-ui">
                      {webLink(entry.href) ? (
                        <a
                          href={webLink(entry.href)}
                          rel="ugc nofollow"
                          className="rounded-ui font-medium text-ink underline decoration-line-strong underline-offset-[3px] outline-none transition-colors hover:decoration-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {entry.name}
                        </a>
                      ) : (
                        <span className="font-medium text-ink">{entry.name}</span>
                      )}
                      {entry.location ? <span className="text-ink-3"> from {entry.location}</span> : null}
                    </span>
                    {date ? (
                      <time dateTime={date.toISOString()} className="shrink-0 font-mono text-xs text-ink-3">
                        {dateFormat.format(date)}
                      </time>
                    ) : null}
                  </div>
                  <p className="mt-1 break-words whitespace-pre-line text-sm text-ink-2">{entry.message}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
