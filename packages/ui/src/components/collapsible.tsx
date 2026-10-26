import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "../lib/cn";
import { DisclosureCaret, panelMotion } from "./accordion";

export interface CollapsibleProps extends Omit<BaseCollapsible.Root.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/** One show/hide region. Controlled with `open` / `onOpenChange`, or `defaultOpen`. */
export function Collapsible({ className, ...props }: CollapsibleProps) {
  return <BaseCollapsible.Root {...props} className={cn("flex flex-col", className)} />;
}

export interface CollapsibleTriggerProps extends Omit<BaseCollapsible.Trigger.Props, "className"> {
  /** Hide the leading caret, e.g. when rendering your own trigger via `render`. */
  caret?: boolean;
  /** Layout classes only. */
  className?: string;
}

/**
 * The toggle: quiet ink-2 text with a caret that turns when open. Swap the
 * element with `render` (e.g. `render={<Button variant="ghost" />}`).
 */
export function CollapsibleTrigger({ caret = true, className, children, ...props }: CollapsibleTriggerProps) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      className={cn(
        "group inline-flex h-7 w-fit cursor-default items-center gap-1.5 rounded-ui text-ui text-ink-2 transition-colors hover:text-ink data-panel-open:text-ink",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {caret ? <DisclosureCaret className="group-data-panel-open:rotate-90" /> : null}
      {children}
    </BaseCollapsible.Trigger>
  );
}

export interface CollapsibleContentProps extends Omit<BaseCollapsible.Panel.Props, "className"> {
  /** Layout classes only (applied to the inner wrapper). */
  className?: string;
}

/** The region that opens: height and opacity in 180ms, out in 120ms. */
export function CollapsibleContent({ className, children, ...props }: CollapsibleContentProps) {
  return (
    <BaseCollapsible.Panel {...props} className={cn("h-(--collapsible-panel-height)", panelMotion)}>
      <div className={cn("pt-1", className)}>{children}</div>
    </BaseCollapsible.Panel>
  );
}
