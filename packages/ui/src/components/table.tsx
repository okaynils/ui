import * as React from "react";
import { cn } from "../lib/cn";

export type TableDensity = "default" | "compact";
export type TableAlign = "left" | "right" | "center";

const DensityContext = React.createContext<TableDensity>("default");

const ALIGN: Record<TableAlign, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export interface TableProps extends React.ComponentProps<"table"> {
  /** `default` rows are 36px, `compact` 28px. */
  density?: TableDensity;
  /**
   * Classes for the scrolling wrapper. Give it a max height
   * (`max-h-96`) and the header sticks while the body scrolls.
   */
  containerClassName?: string;
}

/**
 * A console table: mono labels in the header, hairlines between rows,
 * numbers right-aligned in tabular figures. No outer frame — put it in a
 * `<Panel flush>` or let it sit on the page.
 */
export function Table({ density = "default", containerClassName, className, ...props }: TableProps) {
  return (
    <DensityContext.Provider value={density}>
      <div className={cn("relative w-full overflow-auto", containerClassName)}>
        <table {...props} className={cn("w-full border-separate border-spacing-0 text-ui", className)} />
      </div>
    </DensityContext.Provider>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead {...props} className={cn("", className)} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody {...props} className={cn("[&>tr:last-child>td]:border-b-0", className)} />;
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      {...props}
      className={cn("bg-panel font-medium [&>tr>td]:border-t [&>tr>td]:border-b-0 [&>tr>td]:border-line", className)}
    />
  );
}

export interface TableRowProps extends React.ComponentProps<"tr"> {
  /** Marks the row as selected (tinted, `aria-selected`). */
  selected?: boolean;
  /** Make the whole row respond to the pointer (tone on hover). Pair with `onClick` and `tabIndex={0}`. */
  interactive?: boolean;
}

export function TableRow({ selected = false, interactive = false, className, ...props }: TableRowProps) {
  return (
    <tr
      {...props}
      aria-selected={selected || undefined}
      data-selected={selected || undefined}
      className={cn(
        "group/row",
        selected && "bg-accent-tint/60",
        interactive && [
          "cursor-default outline-none",
          !selected && "hover:bg-hover",
          // Keyboard focus lands instantly: it follows the arrow keys.
          "focus-visible:bg-hover focus-visible:transition-none focus-visible:shadow-[inset_2px_0_0_var(--ui-accent)]",
        ],
        "transition-colors duration-120",
        className,
      )}
    />
  );
}

export interface TableHeadProps extends React.ComponentProps<"th"> {
  align?: TableAlign;
}

export function TableHead({ align = "left", className, ...props }: TableHeadProps) {
  return (
    <th
      scope="col"
      {...props}
      className={cn(
        "ui-label sticky top-0 z-1 h-8 bg-panel px-3 font-normal whitespace-nowrap",
        // Sticky cells lose collapsed borders, so the hairline is a shadow.
        "shadow-[inset_0_-1px_0_var(--ui-line)]",
        ALIGN[align],
        className,
      )}
    />
  );
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  align?: TableAlign;
  /** Mono for IDs, hashes, regions, timestamps. */
  mono?: boolean;
}

export function TableCell({ align = "left", mono = false, className, ...props }: TableCellProps) {
  const density = React.useContext(DensityContext);
  return (
    <td
      {...props}
      className={cn(
        "border-b border-line px-3 text-ink",
        density === "compact" ? "h-7" : "h-9",
        align === "right" && "tabular-nums",
        mono && "font-mono text-xs",
        ALIGN[align],
        className,
      )}
    />
  );
}
