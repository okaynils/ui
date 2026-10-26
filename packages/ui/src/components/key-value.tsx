import * as React from "react";
import { cn } from "../lib/cn";

export interface KeyValueEntry {
  /** The key, shown in the mono label voice. */
  label: React.ReactNode;
  value: React.ReactNode;
  /** Set the value in mono: IDs, hashes, regions, versions, timestamps. */
  mono?: boolean;
}

export type KeyValueLayout = "horizontal" | "stacked";

export interface KeyValueProps extends Omit<React.ComponentProps<"dl">, "children"> {
  /** The rows. Or pass `KeyValueItem` children instead. */
  items?: readonly KeyValueEntry[];
  children?: React.ReactNode;
  /** `horizontal` (default): key column + value column. `stacked`: key above value, for narrow spaces. */
  layout?: KeyValueLayout;
  /** Width of the key column in `horizontal` layout. Default 140px. */
  keyWidth?: number | string;
  /** Hairlines between rows. Default true. */
  dividers?: boolean;
}

const LayoutContext = React.createContext<{ layout: KeyValueLayout; dividers: boolean }>({ layout: "horizontal", dividers: true });

/**
 * A description list: the properties of one thing (a machine, an order, a
 * deploy). Keys in the mono label voice, values in ink.
 */
export function KeyValue({
  items,
  children,
  layout = "horizontal",
  keyWidth = 140,
  dividers = true,
  className,
  style,
  ...props
}: KeyValueProps) {
  const width = typeof keyWidth === "number" ? `${keyWidth}px` : keyWidth;
  return (
    <LayoutContext.Provider value={{ layout, dividers }}>
      <dl
        {...props}
        style={{ ...style, ["--kv-key" as string]: width }}
        className={cn("flex w-full flex-col", dividers && "divide-y divide-line", className)}
      >
        {items?.map((item, i) => (
          <KeyValueItem key={i} label={item.label} mono={item.mono}>
            {item.value}
          </KeyValueItem>
        ))}
        {children}
      </dl>
    </LayoutContext.Provider>
  );
}

export interface KeyValueItemProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: React.ReactNode;
  children?: React.ReactNode;
  mono?: boolean;
}

/** One row of a `KeyValue`. */
export function KeyValueItem({ label, mono = false, className, children, ...props }: KeyValueItemProps) {
  const { layout, dividers } = React.useContext(LayoutContext);
  const horizontal = layout === "horizontal";
  return (
    <div
      {...props}
      className={cn(
        horizontal ? "grid grid-cols-[var(--kv-key)_minmax(0,1fr)] items-baseline gap-4" : "flex flex-col gap-1",
        dividers ? "py-2.5" : "py-1.5",
        className,
      )}
    >
      <dt className="ui-label truncate">{label}</dt>
      <dd className={cn("min-w-0 text-ui text-ink break-words", mono && "font-mono text-xs leading-5")}>
        {children ?? <span className="text-ink-3">—</span>}
      </dd>
    </div>
  );
}
