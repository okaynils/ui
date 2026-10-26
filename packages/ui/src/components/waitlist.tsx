import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { CopyButton } from "./copy-button";
import { Field } from "./field";
import { Form } from "./form";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";

export interface WaitlistProps extends Omit<React.ComponentProps<"div">, "children" | "onSubmit"> {
  /** The visitor's place in line, 1 being next. `null` shows the sign-up form. */
  position: number | null;
  /** Everyone in line, for "of 3,204". Omit if you'd rather not say. */
  total?: number;
  /** Receives the email. Return a promise to keep the button pending; throw to show its message. */
  onJoin?: (email: string) => void | Promise<void>;
  /** A personal link that moves the visitor up when friends join through it. */
  referralUrl?: string;
  /** Label at the top. Defaults to "Waitlist". */
  label?: React.ReactNode;
  /** A line under the form or the position, e.g. "We'll email you when it's your turn." */
  note?: React.ReactNode;
  locale?: string;
}

// People drawn in the queue: a few ahead, you, a few behind. Enough to see
// the line, few enough that it stays a footnote.
const AHEAD = 8;
const BEHIND = 3;
const SLOT = 12;

/**
 * A waitlist sign-up that turns into your place in line. When your position
 * improves, the number rolls down and the little queue steps forward.
 */
export function Waitlist({
  position,
  total,
  onJoin,
  referralUrl,
  label = "Waitlist",
  note,
  locale = "en-GB",
  className,
  ...props
}: WaitlistProps) {
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const valid = position !== null && Number.isFinite(position) && position >= 1;
  const place = valid ? Math.floor(position) : 0;
  const count = new Intl.NumberFormat(locale);

  const join = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !email.trim()) return;
    setPending(true);
    setError(null);
    try {
      await onJoin?.(email.trim());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't join the waitlist. Try again in a moment.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div {...props} data-state={valid ? "joined" : "open"} className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface p-4", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="ui-label">{label}</span>
        {total !== undefined && Number.isFinite(total) ? (
          <span className="font-mono text-xs text-ink-3 tabular-nums">{count.format(total)} in line</span>
        ) : null}
      </div>

      {valid ? (
        <>
          <div className="mt-2 flex items-end justify-between gap-4">
            <NumberRoll value={place} locale={locale} prefix="#" className="font-mono text-[26px] leading-8 font-medium text-ink" />
            <Queue position={place} total={total} />
          </div>
          <p className="mt-1 text-xs text-ink-2">
            {place === 1 ? "You're next." : `${count.format(place - 1)} ahead of you.`}
          </p>
          {referralUrl ? (
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-xs text-ink-2">Share your link. Every friend who joins moves you up.</p>
              <div className="mt-2 flex items-center gap-1">
                <Input size="sm" readOnly value={referralUrl} aria-label="Your referral link" className="font-mono text-xs" onFocus={(event) => event.currentTarget.select()} />
                <CopyButton value={referralUrl} aria-label="Copy referral link" />
              </div>
            </div>
          ) : null}
          {note ? <p className="mt-3 text-xs text-ink-3">{note}</p> : null}
        </>
      ) : (
        <Form onSubmit={join} className="mt-3 gap-2">
          <Field label="Email" error={error ?? undefined}>
            <div className="flex gap-2">
              <Input type="email" required value={email} onValueChange={setEmail} placeholder="you@example.com" autoComplete="email" />
              <Button type="submit" variant="primary" loading={pending}>Join</Button>
            </div>
          </Field>
          {note ? <p className="text-xs text-ink-3">{note}</p> : null}
        </Form>
      )}
    </div>
  );
}

/**
 * The line itself: a gate on the left, the people ahead, you in accent, and
 * a few behind. When your position improves, everyone steps forward by the
 * number of places you gained.
 */
function Queue({ position, total }: { position: number; total?: number }) {
  const ahead = Math.min(position - 1, AHEAD);
  const behind = total !== undefined && Number.isFinite(total) ? Math.max(0, Math.min(BEHIND, Math.floor(total) - position)) : BEHIND;
  const strip = React.useRef<HTMLSpanElement>(null);
  const previous = React.useRef(position);

  React.useLayoutEffect(() => {
    const gained = previous.current - position;
    previous.current = position;
    const element = strip.current;
    if (gained <= 0 || !element || typeof element.animate !== "function") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    element.animate(
      [{ transform: `translateX(${Math.min(gained, 4) * SLOT}px)` }, { transform: "translateX(0)" }],
      { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    );
  }, [position]);

  return (
    <span aria-hidden="true" className="flex h-8 items-center gap-1.5 overflow-hidden pb-1">
      <span className="h-4 w-px shrink-0 bg-ink-2" />
      {position - 1 > AHEAD ? <span className="font-mono text-[11px] leading-none text-ink-3">…</span> : null}
      <span ref={strip} className="flex items-center" style={{ gap: SLOT - 8 }}>
        {Array.from({ length: ahead }, (_, i) => <span key={`a${i}`} className="size-2 rounded-[2px] bg-ink-3" />)}
        <span className="size-2 rounded-[2px] bg-accent outline-2 outline-offset-1 outline-accent/30" />
        {Array.from({ length: behind }, (_, i) => <span key={`b${i}`} className="size-2 rounded-[2px] bg-ink-3/35" />)}
      </span>
    </span>
  );
}
