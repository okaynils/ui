import type * as React from "react";
import { cn } from "../lib/cn";

export interface ReceiptItem {
  label: React.ReactNode;
  /** A second line under the label, e.g. "Billed yearly". */
  detail?: React.ReactNode;
  /** Shown after the label as "×3". */
  quantity?: number;
  /** Money for this line, already multiplied by quantity. Negative for discounts. Counts towards the total. */
  amount?: number;
  /** Text instead of an amount, e.g. "Included". Doesn't count towards the total. */
  value?: React.ReactNode;
}

export interface ReceiptMeta {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface ReceiptProps extends Omit<React.ComponentProps<"figure">, "children" | "title"> {
  /** Printed at the top in capitals, e.g. the shop or product name. */
  title: React.ReactNode;
  /** A line under the title, e.g. an address or a tagline. */
  subtitle?: React.ReactNode;
  /** Key/value lines under the header: order number, date, cashier. */
  meta?: readonly ReceiptMeta[];
  items: readonly ReceiptItem[];
  /** Total to print. Omit to sum the items' amounts; `null` prints no total. */
  total?: number | null;
  totalLabel?: React.ReactNode;
  /** ISO 4217 code, e.g. "EUR". Omit to print plain numbers. */
  currency?: string;
  /** Number formatting locale. Explicit, so server and browser agree. */
  locale?: string;
  /** Centred line at the bottom, e.g. "Thank you". */
  footer?: React.ReactNode;
  /** Feed the receipt out of the printer when it mounts. Use when it was just issued. */
  print?: boolean;
}

// The bottom edge is torn: a row of 14×7px teeth cut with a mask. The
// outline is the same shape one pixel larger behind the paper, because a
// masked element can't draw its own border along the cut.
const TEETH = "conic-gradient(from -45deg at 50% 100%, #000 90deg, #0000 0)";
const tornEdge = (shift: string): React.CSSProperties => {
  const mask = `linear-gradient(#000 0 0) top / 100% calc(100% - 7px) no-repeat, ${TEETH} ${shift} 100% / 14px 7px repeat-x`;
  return { mask, WebkitMask: mask };
};

function money(locale: string, currency?: string) {
  const options: Intl.NumberFormatOptions = currency
    ? { style: "currency", currency }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  try { return new Intl.NumberFormat(locale, options); }
  catch { return new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}

/**
 * A thermal-printer receipt: mono type, dashed rules, a torn bottom edge.
 * Lines and amounts are supplied; the total is summed unless you pass one.
 */
export function Receipt({
  title,
  subtitle,
  meta,
  items,
  total,
  totalLabel = "Total",
  currency,
  locale = "en-GB",
  footer,
  print = false,
  className,
  ...props
}: ReceiptProps) {
  const format = money(locale, currency);
  const amounts = items.map((item) => item.amount).filter((amount): amount is number => typeof amount === "number" && Number.isFinite(amount));
  const sum = total === undefined ? (amounts.length ? amounts.reduce((a, b) => a + b, 0) : null) : total;
  const rule = "border-t border-dashed border-line-strong";

  return (
    <figure
      {...props}
      data-print={print || undefined}
      className={cn("m-0 w-72 max-w-full", print && "overflow-hidden", className)}
    >
      <div
        className={cn("bg-line-strong px-px pt-px pb-px", print && "animate-[ui-print_480ms_steps(8,end)]")}
        style={tornEdge("0")}
      >
        <div className="bg-panel px-4 pt-4 pb-7 font-mono text-xs text-ink" style={tornEdge("-1px")}>
          <div className="text-center">
            <div className="text-ui font-medium tracking-[0.08em] uppercase">{title}</div>
            {subtitle ? <div className="mt-0.5 text-ink-2">{subtitle}</div> : null}
          </div>

          {meta?.length ? (
            <dl className={cn("mt-3 space-y-0.5 pt-3", rule)}>
              {meta.map((line, index) => (
                <div key={index} className="flex justify-between gap-4">
                  <dt className="text-ink-3">{line.label}</dt>
                  <dd className="m-0 text-right tabular-nums">{line.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <table className={cn("mt-3 w-full border-collapse", rule)}>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="align-top">
                  <td className={cn("pr-4", index === 0 ? "pt-3" : "pt-1.5")}>
                    {item.label}
                    {item.quantity !== undefined ? <span className="text-ink-3"> ×{item.quantity}</span> : null}
                    {item.detail ? <div className="text-ink-3">{item.detail}</div> : null}
                  </td>
                  <td className={cn("text-right whitespace-nowrap tabular-nums", index === 0 ? "pt-3" : "pt-1.5")}>
                    {typeof item.amount === "number" && Number.isFinite(item.amount) ? format.format(item.amount) : item.value ?? null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sum !== null ? (
            <div className={cn("mt-3 flex items-baseline justify-between gap-4 pt-3 text-sm font-medium", rule)}>
              <span className="uppercase">{totalLabel}</span>
              <span className="tabular-nums">{format.format(sum)}</span>
            </div>
          ) : null}

          {footer ? <div className={cn("mt-3 pt-3 text-center text-ink-2", rule)}>{footer}</div> : null}
        </div>
      </div>
    </figure>
  );
}
