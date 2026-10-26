import * as React from "react";
import { cn } from "../lib/cn";

export interface MiniMapMarker {
  id: string;
  /** Horizontal position as a percentage, 0 at the left edge. */
  x: number;
  /** Vertical position as a percentage, 0 at the top edge. */
  y: number;
  /** What is here. Read aloud and shown on hover. */
  label: string;
  /** Emphasise one place, usually the one the page is about. */
  primary?: boolean;
}

export interface MiniMapProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Accessible name of the area, e.g. "Södermalm, Stockholm". */
  name: string;
  /** Places to mark, positioned in percentages. */
  markers: readonly MiniMapMarker[];
  /** Draw the grid wash behind the markers. Defaults to true. */
  grid?: boolean;
  /** Link to a full map. The widget never embeds a map service. */
  href?: string;
  /** Text after the map, e.g. the street address. */
  caption?: React.ReactNode;
  /** Label for the map link. Defaults to "Open map". */
  linkLabel?: React.ReactNode;
}

const clamp = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50);

/**
 * A small, non-geographic map: a grid, supplied markers and a link out. It
 * draws nothing from a mapping service, so there are no keys, tiles or
 * network requests — the app decides where the places are.
 */
export function MiniMap({
  name,
  markers,
  grid = true,
  href,
  caption,
  linkLabel = "Open map",
  className,
  ...props
}: MiniMapProps) {
  const patternId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const placed = markers.filter((marker) => Number.isFinite(marker.x) && Number.isFinite(marker.y));
  const summary = markers.length
    ? `${name}. ${markers.length} ${markers.length === 1 ? "place" : "places"}: ${markers.map((marker) => marker.label).join(", ")}.`
    : `${name}. No places marked.`;

  return (
    <div
      {...props}
      className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface", className)}
    >
      <div className="flex items-baseline justify-between gap-3 p-3">
        <span className="text-ui font-medium text-ink">{name}</span>
        {href ? (
          <a
            href={href}
            className="shrink-0 rounded-ui text-ui text-accent underline decoration-transparent underline-offset-[3px] outline-none transition-colors hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {linkLabel}
          </a>
        ) : null}
      </div>

      <div role="img" aria-label={summary} className="relative h-32 overflow-hidden border-t border-line bg-panel">
        {grid ? (
          <svg aria-hidden="true" className="absolute inset-0 size-full text-line">
            <defs>
              <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M24 0V24M0 24H24" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        ) : null}

        {placed.map((marker) => (
          <span
            key={marker.id}
            title={marker.label}
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${clamp(marker.x)}%`, top: `${clamp(marker.y)}%` }}
          >
            <span
              className={cn(
                "block rounded-full",
                marker.primary ? "size-2.5 bg-accent" : "size-2 bg-ink-3",
              )}
              style={marker.primary ? { boxShadow: "0 0 0 3px var(--ui-accent-tint)" } : undefined}
            />
            {marker.primary ? (
              <span className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 rounded-ui bg-surface px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--ui-line)]">
                {marker.label}
              </span>
            ) : null}
          </span>
        ))}
      </div>

      {caption ? <div className="border-t border-line px-3 py-2 text-xs text-ink-3">{caption}</div> : null}
    </div>
  );
}
