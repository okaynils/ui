import * as React from "react";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Callout } from "./callout";
import { Field } from "./field";
import { Form } from "./form";
import { Input } from "./input";
import { List } from "./list";
import { Textarea } from "./textarea";

export interface GuestbookEntry {
  id: string;
  /** The name the visitor signed with. */
  name: string;
  message: string;
  /** When it was signed: a `Date`, an ISO string or Unix milliseconds. */
  createdAt: Date | string | number;
  /** The visitor's site or profile, if they left one. */
  href?: string;
}

export interface GuestbookSigned {
  /** The trimmed name, or "Anonymous" when it was left empty. */
  name: string;
  message: string;
}

export interface GuestbookProps extends Omit<React.ComponentProps<"div">, "children" | "onSubmit"> {
  /** Entries the app supplies, newest last. Storage, moderation and pagination belong to the app. */
  entries: readonly GuestbookEntry[];
  /**
   * Receives each signed message. Return a promise to keep the form pending;
   * throw to show the message's error. Without it the demo clears the form.
   */
  onSubmit?: (entry: GuestbookSigned) => void | Promise<void>;
  /** Heading over the form. */
  heading?: React.ReactNode;
  /** Maximum message length, shown in a counter. Defaults to 280. */
  maxLength?: number;
  /** Note under the form, e.g. how entries are reviewed. */
  note?: React.ReactNode;
  /** Shown in place of the list when the app supplies no entries. */
  emptyMessage?: React.ReactNode;
  /** Locale for the entry dates. */
  locale?: Intl.LocalesArgument;
}

function parseDate(value: Date | string | number): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * A message form with a list of supplied entries. Nothing is stored here: the
 * app receives each signed message, decides whether it is published and
 * supplies the entries back.
 */
export function Guestbook({
  entries,
  onSubmit,
  heading = "Guestbook",
  maxLength = 280,
  note,
  emptyMessage = "No messages yet. Be the first to sign.",
  locale,
  className,
  ...props
}: GuestbookProps) {
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      await onSubmit?.({ name: name.trim() || "Anonymous", message: trimmed });
      setName("");
      setMessage("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The message could not be saved.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      {...props}
      className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface", className)}
    >
      <div className="flex items-baseline justify-between gap-3 p-3">
        <span className="ui-label">{heading}</span>
        <span className="font-mono text-xs text-ink-3 tabular-nums">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <Form onSubmit={handleSubmit} className="gap-3 border-y border-line p-3">
        <Field label="Name" description="Leave it empty to sign as anonymous.">
          <Input value={name} onValueChange={setName} maxLength={40} placeholder="Anonymous" autoComplete="name" />
        </Field>
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
          <Callout role="alert" tone="err" title="Message not saved">
            {error}
          </Callout>
        ) : null}
        {note ? <p className="text-xs text-ink-3">{note}</p> : null}
      </Form>

      <div className="p-3">
        {entries.length === 0 ? (
          <p className="text-ui text-ink-2">{emptyMessage}</p>
        ) : (
          <List>
            {entries.map((entry) => {
              const date = parseDate(entry.createdAt);
              return (
                <li key={entry.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar name={entry.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      {entry.href ? (
                        <a
                          href={entry.href}
                          className="truncate rounded-ui text-ui font-medium text-ink underline decoration-line-strong underline-offset-[3px] outline-none transition-colors hover:decoration-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {entry.name}
                        </a>
                      ) : (
                        <span className="truncate text-ui font-medium text-ink">{entry.name}</span>
                      )}
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
          </List>
        )}
      </div>
    </div>
  );
}
