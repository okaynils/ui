import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import * as React from "react";
import { cn } from "../lib/cn";

export interface TabsProps extends Omit<BaseTabs.Root.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/**
 * Switch between views of the same thing (Overview / Logs / Settings).
 * Compose `TabsList` + `Tab`s, then one `TabsPanel` per tab value.
 */
export function Tabs({ className, ...props }: TabsProps) {
  return <BaseTabs.Root {...props} className={cn("flex flex-col", className)} />;
}

export type TabsVariant = "line" | "pill";

const VariantContext = React.createContext<TabsVariant>("line");

export interface TabsListProps extends Omit<BaseTabs.List.Props, "className"> {
  /**
   * `line` (default): tabs on a hairline with a sliding underline, for the
   * top of a page or panel. `pill`: no hairline, the active tab sits on a grey
   * fill — for a tab row that shares a toolbar with filters and actions.
   */
  variant?: TabsVariant;
  /** Layout classes only. */
  className?: string;
}

/**
 * The row of tabs. The indicator (underline or fill) slides to the active tab
 * so the eye follows the switch; it doesn't animate on first render.
 */
export function TabsList({ variant = "line", className, children, ...props }: TabsListProps) {
  // The indicator's first placement must not slide in from the left edge.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <VariantContext.Provider value={variant}>
      <BaseTabs.List
        {...props}
        className={cn(
          "relative z-0 flex items-center",
          variant === "line" ? "gap-1 shadow-[inset_0_-1px_0_var(--ui-line)]" : "gap-0.5",
          className,
        )}
      >
        {children}
        <BaseTabs.Indicator
          className={cn(
            "absolute left-0 w-(--active-tab-width) translate-x-(--active-tab-left)",
            variant === "line" ? "bottom-0 h-0.5 bg-ink" : "top-0 -z-10 h-(--active-tab-height) rounded-ui bg-active",
            ready && "transition-[translate,width] duration-180 ease-snap",
          )}
        />
      </BaseTabs.List>
    </VariantContext.Provider>
  );
}

export interface TabProps extends Omit<BaseTabs.Tab.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/** One tab. Put an icon or a `Kbd`/count after the label if it helps. */
export function Tab({ className, ...props }: TabProps) {
  const variant = React.useContext(VariantContext);
  return (
    <BaseTabs.Tab
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center gap-1.5 text-ui whitespace-nowrap text-ink-2",
        variant === "line" ? "h-8 px-2 font-medium" : "h-7 rounded-ui px-2.5 hover:bg-hover data-active:font-medium data-active:hover:bg-transparent",
        "transition-colors hover:text-ink data-active:text-ink data-disabled:pointer-events-none data-disabled:opacity-45",
        "outline-none focus-visible:rounded-ui focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
    />
  );
}

export interface TabsPanelProps extends Omit<BaseTabs.Panel.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/** The content for one tab value. Swaps instantly — no fade, nothing to wait for. */
export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel {...props} className={cn("pt-3 outline-none", className)} />;
}
