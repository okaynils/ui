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

export interface TabsListProps extends Omit<BaseTabs.List.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/**
 * The row of tabs, on a hairline. The ink underline slides to the active tab
 * so the eye follows the switch; it doesn't animate on first render.
 */
export function TabsList({ className, children, ...props }: TabsListProps) {
  // The indicator's first placement must not slide in from the left edge.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <BaseTabs.List
      {...props}
      className={cn("relative z-0 flex items-center gap-1 shadow-[inset_0_-1px_0_var(--ui-line)]", className)}
    >
      {children}
      <BaseTabs.Indicator
        className={cn(
          "absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-ink",
          ready && "transition-[translate,width] duration-180 ease-snap",
        )}
      />
    </BaseTabs.List>
  );
}

export interface TabProps extends Omit<BaseTabs.Tab.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/** One tab. Put an icon or a `Kbd`/count after the label if it helps. */
export function Tab({ className, ...props }: TabProps) {
  return (
    <BaseTabs.Tab
      {...props}
      className={cn(
        "relative flex h-9 cursor-default select-none items-center gap-1.5 px-2 text-ui font-medium whitespace-nowrap text-ink-2",
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
  return <BaseTabs.Panel {...props} className={cn("pt-4 outline-none", className)} />;
}
