import type * as React from "react";
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
  /** Called before native link navigation; preventDefault for client-side routing or previews. */
  onNavigate?: (member: WebringMember, direction: WebringDirection, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

function sameURL(a: string, b: string): boolean {
  try {
    return new URL(a, "https://webring.invalid/").href === new URL(b, "https://webring.invalid/").href;
  } catch {
    return a === b;
  }
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
  const link = (direction: WebringDirection, member: WebringMember | undefined, text: string) => {
    if (!member) return <Button variant="ghost" size="sm" disabled>{text}</Button>;
    const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
      // The initial href is deterministic for hydration, copy-link and context
      // menus. Activation picks a destination before the browser follows it.
      const chosen = direction === "random" ? others[Math.floor(Math.random() * others.length)]! : member;
      event.currentTarget.href = chosen.href;
      onNavigate?.(chosen, direction, event);
    };
    return (
      <a
        href={member.href}
        aria-label={direction === "random" ? "Visit a random site in the webring" : `${text}: ${member.name}`}
        onClick={navigate}
        onAuxClick={(event) => { if (event.button === 1) navigate(event); }}
        className={buttonClassName({ variant: "ghost", size: "sm" })}
      >
        {direction === "previous" ? <span aria-hidden>←</span> : null}
        {text}
        {direction === "next" ? <span aria-hidden>→</span> : null}
      </a>
    );
  };

  return (
    <nav {...props} aria-label={ariaLabel ?? `${name} navigation`} className={cn("inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-box border border-line-strong bg-surface px-3 py-2", className)}>
      {href ? <a href={href} className="rounded-ui font-mono text-xs text-accent outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{name}</a> : <span className="font-mono text-xs text-ink-2">{name}</span>}
      <div className="flex items-center gap-0.5">
        {link("previous", previous, "Previous")}
        {link("random", ready ? others[0] : undefined, "Random")}
        {link("next", next, "Next")}
      </div>
      {!ready ? <span className="basis-full text-xs text-ink-3">{sites.length === 0 ? "No sites yet." : currentIndex < 0 ? "This site is not in the ring." : "No other sites yet."}</span> : null}
    </nav>
  );
}
