import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";
import { cn } from "../lib/cn";

export type LinkVariant = "default" | "quiet";

export interface LinkProps extends useRender.ComponentProps<"a"> {
  /** `default` is accent text for links that invite a click; `quiet` is ink text for links inside dense UI. */
  variant?: LinkVariant;
  /**
   * Goes to another site: adds a small ↗ and opens in a new tab unless you
   * pass a `target` yourself. `rel` always gets `noopener noreferrer` for a new tab.
   */
  external?: boolean;
}

const VARIANT: Record<LinkVariant, string> = {
  // The underline is a tint of the accent at rest so a paragraph full of
  // links still reads as text; hover gives it full colour and weight.
  default: "text-accent decoration-accent/35 hover:decoration-accent",
  // Ink text that only the hairline underline marks as a link. For rows,
  // footers and metadata where an accent link would shout.
  quiet: "text-ink decoration-line-strong hover:decoration-ink-3",
};

/**
 * An inline text link. Underlined at all times, so it never depends on colour
 * alone. Use `render` for a router link: `<Link render={<RouterLink to="/x" />}>`.
 */
export function Link({ variant = "default", external = false, target, rel, render, className, children, ...props }: LinkProps) {
  const opensTab = (target ?? (external ? "_blank" : undefined)) === "_blank";
  const safeRel = opensTab
    ? [...new Set([...(rel ?? "").split(/\s+/).filter((word) => word && word.toLowerCase() !== "opener"), "noopener", "noreferrer"])].join(" ")
    : rel;

  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        ...({ "data-variant": variant } as React.ComponentProps<"a">),
        target: target ?? (external ? "_blank" : undefined),
        rel: safeRel,
        className: cn(
          "rounded-[2px] underline underline-offset-[3px] decoration-1 outline-none transition-[text-decoration-color] duration-120",
          // Thickening the line on hover marks the target without moving a pixel of text.
          "hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          VARIANT[variant],
          typeof className === "string" ? className : undefined,
        ),
        children: (
          <>
            {children}
            {external ? <ExternalIcon /> : null}
            {opensTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </>
        ),
      },
      props,
    ),
  });
}

function ExternalIcon() {
  // Sized in em so it matches whatever text size the link sits in.
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="ml-[0.15em] inline-block size-[0.7em] align-[0.05em]">
      <path d="M3.5 8.5 8.5 3.5M4 3.5h4.5V8" />
    </svg>
  );
}
