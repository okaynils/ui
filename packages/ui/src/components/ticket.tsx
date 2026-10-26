import * as React from "react";
import { cn } from "../lib/cn";

export interface TicketDetail {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface TicketProps extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  /** The event or thing the ticket is for. */
  title: React.ReactNode;
  /** A line under the title, e.g. the venue. */
  subtitle?: React.ReactNode;
  /** Small label above the title. Defaults to "Admit one". */
  eyebrow?: React.ReactNode;
  /** Columns along the bottom: date, doors, seat, tier. Keep it to four. */
  details?: readonly TicketDetail[];
  /** Printed on the stub and encoded as a scannable Code 128 barcode. Printable ASCII only. */
  code: string;
  /** Let the visitor tear the stub off by dragging it or pressing it. Defaults to true. */
  tearable?: boolean;
  /** Controlled torn state. */
  torn?: boolean;
  defaultTorn?: boolean;
  /** Called once when the stub is torn off. */
  onTear?: () => void;
}

/* ---- Code 128 (set B) ---- */

// Bar/space widths for each symbol, checked against the published table.
const PATTERNS = "212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112".split(" ");
const START_B = 104;
const STOP = 106;
const QUIET = 10;

/** Bars as [x, width] in modules, plus the total width, or null if the text can't be encoded. */
function code128(text: string): { bars: [number, number][]; width: number } | null {
  if (!text || ![...text].every((char) => char >= " " && char <= "~")) return null;
  const values = [...text].map((char) => char.charCodeAt(0) - 32);
  const check = values.reduce((sum, value, index) => sum + value * (index + 1), START_B) % 103;
  const bars: [number, number][] = [];
  let x = QUIET;
  for (const symbol of [START_B, ...values, check, STOP]) {
    [...PATTERNS[symbol]!].forEach((digit, index) => {
      const width = Number(digit);
      if (index % 2 === 0) bars.push([x, width]);
      x += width;
    });
  }
  return { bars, width: x + QUIET };
}

function Barcode({ value, className }: { value: string; className?: string }) {
  const encoded = React.useMemo(() => code128(value), [value]);
  if (!encoded) return null;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${encoded.width} 40`} preserveAspectRatio="none" shapeRendering="crispEdges" className={cn("fill-ink", className)}>
      {encoded.bars.map(([x, width]) => <rect key={x} x={x} width={width} height={40} />)}
    </svg>
  );
}

/* ---- Paper ---- */

const NOTCH = 8;

/**
 * Half-circle notches where the perforation meets the edges. Like Receipt,
 * the outline is a slightly larger copy of the shape behind the paper; the
 * inner layer's notches are 1px wider and offset by its inset.
 */
function notches(side: "left" | "right", radius: number, inset: { x: number; y: number }): React.CSSProperties {
  const x = side === "right" ? `calc(100% + ${inset.x}px)` : `${-inset.x}px`;
  const hole = (y: string) => `radial-gradient(circle ${radius}px at ${x} ${y}, #0000 ${radius - 0.5}px, #000 ${radius}px)`;
  const mask = `${hole(`${-inset.y}px`)}, ${hole(`calc(100% + ${inset.y}px)`)}`;
  return { mask, WebkitMask: mask, maskComposite: "intersect", WebkitMaskComposite: "source-in" };
}

// Drag the stub this far and letting go tears it.
const TEAR_AT = 40;

/**
 * A ticket with a perforated stub. The stub carries the code as a real Code
 * 128 barcode, and can be torn off: drag it away or press it.
 */
export function Ticket({
  title,
  subtitle,
  eyebrow = "Admit one",
  details,
  code,
  tearable = true,
  torn: tornProp,
  defaultTorn = false,
  onTear,
  className,
  ...props
}: TicketProps) {
  const [tornState, setTornState] = React.useState(defaultTorn);
  const torn = tornProp ?? tornState;
  const [drag, setDrag] = React.useState<number | null>(null);
  const start = React.useRef<{ x: number; moved: boolean } | null>(null);
  // A drag ends in a click too; only a press without movement tears on click.
  const dragged = React.useRef(false);

  const tear = () => {
    if (torn) return;
    setTornState(true);
    onTear?.();
  };

  const interactive = tearable && !torn;
  const offset = drag ?? (torn ? 14 : 0);
  const stubStyle: React.CSSProperties = {
    // The stub pivots from its bottom-left corner, the last bit of paper to let go.
    transform: offset ? `translateX(${offset}px) rotate(${offset / 3.5}deg)` : undefined,
    transformOrigin: "0 100%",
  };

  const stub = (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-3 py-4">
      <span className="ui-label">Stub</span>
      <Barcode value={code} className="h-10 w-24" />
      <span className="font-mono text-[11px] text-ink tabular-nums">{code}</span>
    </div>
  );

  return (
    <div {...props} data-torn={torn || undefined} className={cn("flex w-full max-w-md items-stretch", className)}>
      <div className="flex min-w-0 flex-1 bg-line-strong" style={{ ...notches("right", NOTCH, { x: 0, y: 0 }), borderRadius: "var(--radius-box) 0 0 var(--radius-box)" }}>
        <div
          className={cn("flex min-w-0 flex-1 flex-col gap-3 bg-panel py-4 pr-4 pl-5", torn ? "m-px" : "my-px ml-px")}
          style={{ ...notches("right", NOTCH + 1, { x: torn ? 1 : 0, y: 1 }), borderRadius: "5px 0 0 5px" }}
        >
          <div>
            <span className="ui-label">{eyebrow}</span>
            <div className="mt-1 text-[17px] leading-6 font-semibold tracking-[-0.01em] text-ink">{title}</div>
            {subtitle ? <div className="text-xs text-ink-2">{subtitle}</div> : null}
          </div>
          {details?.length ? (
            <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-2">
              {details.map((detail, index) => (
                <div key={index}>
                  <dt className="ui-label">{detail.label}</dt>
                  <dd className="m-0 font-mono text-xs text-ink tabular-nums">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <div
        className={cn("flex shrink-0 bg-line-strong", drag === null && "transition-transform duration-200 ease-snap")}
        style={{ ...notches("left", NOTCH, { x: 0, y: 0 }), borderRadius: "0 var(--radius-box) var(--radius-box) 0", ...stubStyle }}
      >
        <div
          className="my-px mr-px flex-1 border-l-2 border-dashed border-line-strong bg-panel"
          style={{ ...notches("left", NOTCH + 1, { x: 0, y: 1 }), borderRadius: "0 5px 5px 0" }}
        >
          {interactive ? (
            <button
              type="button"
              aria-label={`Tear off stub ${code}`}
              onPointerDown={(event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                start.current = { x: event.clientX, moved: false };
              }}
              onPointerMove={(event) => {
                if (!start.current) return;
                const dx = Math.max(0, Math.min(80, event.clientX - start.current.x));
                if (dx > 4) start.current.moved = true;
                if (start.current.moved) setDrag(dx);
              }}
              onPointerUp={() => {
                const moved = start.current?.moved ?? false;
                start.current = null;
                dragged.current = moved;
                if (moved && (drag ?? 0) >= TEAR_AT) tear();
                setDrag(null);
              }}
              onPointerCancel={() => { start.current = null; setDrag(null); }}
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false;
                  return;
                }
                tear();
              }}
              className="h-full cursor-grab touch-pan-y rounded-r-[5px] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent active:cursor-grabbing"
            >
              {stub}
            </button>
          ) : stub}
        </div>
      </div>
      <span role="status" className="sr-only">{torn ? "Stub torn off." : ""}</span>
    </div>
  );
}
