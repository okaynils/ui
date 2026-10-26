import * as React from "react";
import { cn } from "../lib/cn";
import { Button, buttonClassName } from "./button";

export interface WebringMember {
  /** Stable identity, independent of a site's URL. */
  id: string;
  name: string;
  href: string;
}

export type WebringDirection = "previous" | "random" | "next";

export interface WebringProps extends Omit<React.ComponentProps<"nav">, "children"> {
  members: readonly WebringMember[];
  /** Current member id or exact member URL. */
  current: string;
  name?: string;
  /** Optional ring directory or about page. */
  href?: string;
  /**
   * Called before navigation; preventDefault for client-side routing or previews.
   * For Random it fires after the shuffle, with the site it landed on.
   */
  onNavigate?: (member: WebringMember, direction: WebringDirection, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Six stops at 70ms: long enough to read as a spin, short enough that the
// shuffle is over before anyone wonders whether the click worked.
const SHUFFLE_STEPS = 6;
const SHUFFLE_STEP_MS = 70;
// Past this, dots would touch; the ring then marks only where you are.
const MAX_DOTS = 24;

function sameURL(a: string, b: string): boolean {
  try {
    return new URL(a, "https://webring.invalid/").href === new URL(b, "https://webring.invalid/").href;
  } catch {
    return a === b;
  }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** A small ring of native links. The supplied ordering defines previous and next. */
export function Webring({ members, current, name = "Webring", href, onNavigate, className, "aria-label": ariaLabel, ...props }: WebringProps) {
  // A repeated member id should never let “random” land back on this site.
  const sites = members.filter((member, index) => members.findIndex((candidate) => candidate.id === member.id) === index);
  const currentIndex = sites.findIndex((site) => site.id === current || sameURL(site.href, current));
  const currentSite = sites[currentIndex];
  const others = currentSite ? sites.filter((site) => site.id !== currentSite.id && !sameURL(site.href, currentSite.href)) : [];
  const ready = currentIndex >= 0 && others.length > 0;
  const adjacent = (step: -1 | 1) => {
    for (let distance = 1; distance < sites.length; distance++) {
      const candidate = sites[(currentIndex + step * distance + sites.length) % sites.length]!;
      if (candidate.id !== currentSite?.id && !sameURL(candidate.href, currentSite?.href ?? "")) return candidate;
    }
    return undefined;
  };
  const previous = ready ? adjacent(-1) : undefined;
  const next = ready ? adjacent(1) : undefined;

  const [shuffle, setShuffle] = React.useState<WebringMember | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const pick = (exclude?: WebringMember) => {
    const pool = others.length > 1 && exclude ? others.filter((site) => site.id !== exclude.id) : others;
    return pool[Math.floor(Math.random() * pool.length)]!;
  };

  const spin = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const chosen = pick();
    event.preventDefault();
    if (shuffle) return;
    // The click event is long gone when the shuffle lands, so the app gets a
    // stand-in that records whether it took over navigation.
    let prevented = false;
    const landed = Object.create(event, {
      preventDefault: { value: () => { prevented = true; } },
      defaultPrevented: { get: () => prevented },
    }) as React.MouseEvent<HTMLAnchorElement>;
    let step = 0;
    let shown: WebringMember | undefined;
    const tick = () => {
      step += 1;
      shown = step === SHUFFLE_STEPS ? chosen : pick(shown);
      setShuffle(shown);
      if (step < SHUFFLE_STEPS) {
        timer.current = setTimeout(tick, SHUFFLE_STEP_MS);
        return;
      }
      timer.current = setTimeout(() => {
        setShuffle(null);
        onNavigate?.(chosen, "random", landed);
        if (!prevented) window.location.assign(chosen.href);
      }, SHUFFLE_STEP_MS * 2);
    };
    tick();
  };

  const link = (direction: WebringDirection, member: WebringMember | undefined, text: string) => {
    if (!member) return <Button variant="ghost" size="sm" disabled>{text}</Button>;
    const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
      const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (direction === "random" && !modified && !prefersReducedMotion()) return spin(event);
      // The initial href is deterministic for hydration, copy-link and context
      // menus. Activation picks a destination before the browser follows it.
      const chosen = direction === "random" ? pick() : member;
      event.currentTarget.href = chosen.href;
      onNavigate?.(chosen, direction, event);
    };
    return (
      <a
        href={member.href}
        aria-label={direction === "random" ? "Visit a random site in the webring" : `${direction === "previous" ? "Previous" : "Next"}: ${member.name}`}
        title={direction === "random" ? undefined : member.name}
        onClick={navigate}
        onAuxClick={(event) => { if (event.button === 1) navigate(event); }}
        aria-disabled={shuffle ? true : undefined}
        className={buttonClassName({ variant: "ghost", size: "sm" })}
      >
        {direction === "previous" ? <span aria-hidden>←</span> : null}
        {text}
        {direction === "next" ? <span aria-hidden>→</span> : null}
      </a>
    );
  };

  const status = !ready
    ? sites.length === 0 ? "No sites yet." : currentIndex < 0 ? "This site is not in the ring." : "No other sites yet."
    : shuffle ? `→ ${shuffle.name}` : `Site ${currentIndex + 1} of ${sites.length}`;

  return (
    <nav
      {...props}
      aria-label={ariaLabel ?? `${name} navigation`}
      data-state={shuffle ? "shuffling" : ready ? "ready" : "unavailable"}
      className={cn("inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-box border border-line-strong bg-surface py-2 pr-1.5 pl-2.5", className)}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Ring count={sites.length} current={currentIndex} highlight={shuffle ? sites.findIndex((site) => site.id === shuffle.id) : -1} />
        <div className="flex min-w-0 flex-col">
          {href ? (
            <a href={href} className="truncate rounded-ui text-ui font-medium text-ink underline decoration-line-strong underline-offset-[3px] outline-none hover:decoration-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{name}</a>
          ) : <span className="truncate text-ui font-medium text-ink">{name}</span>}
          <span className="truncate font-mono text-[11px] text-ink-3 tabular-nums">{status}</span>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        {link("previous", previous, "Prev")}
        {link("random", ready ? others[0] : undefined, "Random")}
        {link("next", next, "Next")}
      </div>
    </nav>
  );
}

/**
 * The ring itself: every member as a dot on a circle, this site in accent
 * ("you are here"). During a shuffle the candidate dot lights up in ink.
 */
function Ring({ count, current, highlight }: { count: number; current: number; highlight: number }) {
  const size = 32;
  const radius = 12;
  const at = (index: number) => {
    const angle = (index / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2;
    return { cx: size / 2 + Math.cos(angle) * radius, cy: size / 2 + Math.sin(angle) * radius };
  };
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} className="size-8 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ui-line-strong)" strokeWidth="1" />
      {count <= MAX_DOTS
        ? Array.from({ length: count }, (_, index) => (
          index === current || index === highlight ? null : <circle key={index} {...at(index)} r={2} fill="var(--ui-ink-3)" />
        ))
        : null}
      {highlight >= 0 ? <circle {...at(highlight)} r={2.5} fill="var(--ui-ink)" /> : null}
      {current >= 0 ? <circle {...at(current)} r={3} fill="var(--ui-accent)" stroke="var(--ui-surface)" strokeWidth="1.5" /> : null}
    </svg>
  );
}
