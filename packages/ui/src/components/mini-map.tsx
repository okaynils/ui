import * as React from "react";
import { cn } from "../lib/cn";

export interface MiniMapMarker {
  id: string;
  /** Horizontal position as a percentage, 0 at the left edge. */
  x: number;
  /** Vertical position as a percentage, 0 at the top edge. */
  y: number;
  /** What is here, e.g. "The studio". Shown in the readout and read aloud. */
  label: string;
  /** Emphasise one place, usually the one the page is about. The crosshair rests on it. */
  primary?: boolean;
  /** Real latitude in degrees, north positive. With `lng`, printed in the readout. */
  lat?: number;
  /** Real longitude in degrees, east positive. */
  lng?: number;
  /** Readout text instead of `lat`/`lng`, e.g. a grid reference or "Floor 3, desk 12". */
  coordinates?: string;
}

export interface MiniMapProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Accessible name of the area, e.g. "Södermalm, Stockholm". */
  name: string;
  /** Places to mark, positioned in percentages. */
  markers: readonly MiniMapMarker[];
  /** Draw the grid and edge rulers behind the markers. Defaults to true. */
  grid?: boolean;
  /** Link to a full map. The widget never embeds a map service. */
  href?: string;
  /** Text after the map, e.g. the street address. */
  caption?: React.ReactNode;
  /** Label for the map link. Defaults to "Open map". */
  linkLabel?: React.ReactNode;
}

const clamp = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50);

function degrees(value: number, positive: string, negative: string): string {
  return `${Math.abs(value).toFixed(4)}° ${value < 0 ? negative : positive}`;
}

/** The mono readout for a marker: supplied text, real coordinates, or nothing. */
function readout(marker: MiniMapMarker): string | null {
  if (marker.coordinates) return marker.coordinates;
  if (Number.isFinite(marker.lat) && Number.isFinite(marker.lng)) {
    return `${degrees(marker.lat!, "N", "S")}, ${degrees(marker.lng!, "E", "W")}`;
  }
  return null;
}

/**
 * A small map readout: rulers, a crosshair on the place that matters and its
 * coordinates in mono. Point at or tab to another marker and the crosshair
 * slides over to it. Positions are supplied percentages; no map service.
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
  const home = placed.find((marker) => marker.primary) ?? placed[0];
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const active = placed.find((marker) => marker.id === activeId) ?? home;
  // With one place there is nothing to point at; the markers only become
  // controls when there is somewhere else for the crosshair to go.
  const interactive = placed.length > 1;
  const buttons = React.useRef(new Map<string, HTMLButtonElement>());
  const summary = markers.length
    ? `${name}. ${markers.length} ${markers.length === 1 ? "place" : "places"}: ${markers.map((marker) => [marker.label, readout(marker)].filter(Boolean).join(", ")).join("; ")}.`
    : `${name}. No places marked.`;

  const move = (event: React.KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    const target = event.key === "Home" ? 0 : event.key === "End" ? placed.length - 1 : step ? (index + step + placed.length) % placed.length : -1;
    if (target < 0) return;
    event.preventDefault();
    const marker = placed[target]!;
    setActiveId(marker.id);
    buttons.current.get(marker.id)?.focus();
  };

  const activeText = active ? readout(active) : null;

  return (
    <div {...props} className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface", className)}>
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

      <div
        role={interactive ? "group" : "img"}
        aria-label={interactive ? `${name}. Use the arrow keys to move between places.` : summary}
        onPointerLeave={interactive ? () => setActiveId(null) : undefined}
        onBlur={interactive ? (event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveId(null); } : undefined}
        className="relative h-36 overflow-hidden border-t border-line bg-panel"
      >
        {grid ? (
          <svg aria-hidden="true" className="absolute inset-0 size-full text-line">
            <defs>
              <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M24 0V24M0 24H24" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            {/* Rulers along the top and left edges: what makes a frame read as an instrument. */}
            {Array.from({ length: 21 }, (_, i) => (
              <React.Fragment key={i}>
                <line x1={`${i * 5}%`} x2={`${i * 5}%`} y1="0" y2={i % 2 ? 3 : 6} stroke="var(--ui-ink-3)" strokeWidth="1" />
                <line y1={`${i * 5}%`} y2={`${i * 5}%`} x1="0" x2={i % 2 ? 3 : 6} stroke="var(--ui-ink-3)" strokeWidth="1" />
              </React.Fragment>
            ))}
          </svg>
        ) : null}

        {active ? (
          <>
            {/* Crosshair: two hairlines through the active place, gliding on change. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 w-px -translate-x-1/2 bg-ink-3/60 transition-[left] duration-180 ease-snap"
              style={{ left: `${clamp(active.x)}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 h-px -translate-y-1/2 bg-ink-3/60 transition-[top] duration-180 ease-snap"
              style={{ top: `${clamp(active.y)}%` }}
            />
          </>
        ) : null}

        {placed.map((marker, index) => {
          const isActive = marker.id === active?.id;
          const dot = (
            <span
              aria-hidden="true"
              className={cn(
                "block rounded-[1px]",
                marker.primary ? "size-2.5 bg-accent shadow-[0_0_0_2px_var(--ui-panel),0_0_0_3px_var(--ui-accent)]" : "size-2 bg-ink-2",
              )}
            />
          );
          const position = { left: `${clamp(marker.x)}%`, top: `${clamp(marker.y)}%` };
          return interactive ? (
            <button
              key={marker.id}
              ref={(node) => { if (node) buttons.current.set(marker.id, node); else buttons.current.delete(marker.id); }}
              type="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={[marker.label, readout(marker)].filter(Boolean).join(", ")}
              aria-current={marker.primary ? "location" : undefined}
              onPointerEnter={() => setActiveId(marker.id)}
              onFocus={() => setActiveId(marker.id)}
              onKeyDown={(event) => move(event, index)}
              className="absolute z-10 flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-crosshair items-center justify-center rounded-ui outline-none focus-visible:outline-2 focus-visible:outline-accent"
              style={position}
            >
              {dot}
            </button>
          ) : (
            <span key={marker.id} aria-hidden="true" className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={position}>{dot}</span>
          );
        })}

        {active ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-2 z-20 flex max-w-[calc(100%-1rem)] items-baseline gap-2 rounded-ui bg-surface px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap shadow-[inset_0_0_0_1px_var(--ui-line-strong)]"
          >
            <span className="truncate text-ink">{active.label}</span>
            {activeText ? <span className="text-ink-3 tabular-nums">{activeText}</span> : null}
          </div>
        ) : null}
      </div>

      {caption ? <div className="border-t border-line px-3 py-2 text-xs text-ink-3">{caption}</div> : null}
    </div>
  );
}
