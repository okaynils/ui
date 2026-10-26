import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { withClass, XGlyph } from "./overlay-utils";

export type SheetSide = "right" | "left";

const SheetSideContext = React.createContext<SheetSide>("right");

export interface SheetProps extends Omit<BaseDrawer.Root.Props, "swipeDirection"> {
  /** Which edge the sheet slides in from. It is swiped back toward the same edge to dismiss. */
  side?: SheetSide;
}

/**
 * Root of a side panel. Controlled via `open` / `onOpenChange`, or
 * uncontrolled with a `SheetTrigger`.
 */
export function Sheet({ side = "right", ...props }: SheetProps) {
  return (
    <SheetSideContext.Provider value={side}>
      <BaseDrawer.Root {...props} swipeDirection={side} />
    </SheetSideContext.Provider>
  );
}

export type SheetTriggerProps = BaseDrawer.Trigger.Props;

/** Opens the sheet. Compose with Button: `<SheetTrigger render={<Button />}>`. */
export function SheetTrigger(props: SheetTriggerProps) {
  return <BaseDrawer.Trigger {...props} />;
}

const WIDTH = {
  sm: "w-[min(320px,calc(100vw-3rem))]",
  md: "w-[min(400px,calc(100vw-3rem))]",
  lg: "w-[min(520px,calc(100vw-3rem))]",
} as const;
export type SheetSize = keyof typeof WIDTH;

/*
 * The scrim follows the swipe: it fades as the sheet is dragged away. While
 * dragging, transitions are off so the panel tracks the finger 1:1.
 */
const backdrop = [
  "fixed inset-0 z-50 bg-scrim",
  "opacity-[calc(1-var(--drawer-swipe-progress,0))]",
  "transition-opacity duration-200 ease-drawer data-ending-style:duration-150 data-swiping:duration-0",
  "data-starting-style:opacity-0 data-ending-style:opacity-0",
].join(" ");

/*
 * Edge-attached and square: a sheet is part of the window's frame, not a
 * floating card. It enters on the drawer curve (200ms) and leaves faster
 * (150ms). The swipe offset is folded into the resting transform.
 */
function popup(side: SheetSide, size: SheetSize) {
  return cn(
    "relative flex h-full max-h-dvh flex-col bg-raised text-ink shadow-modal outline-none",
    "overflow-hidden overscroll-contain touch-auto",
    "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
    "transition-transform duration-200 ease-drawer data-ending-style:duration-150 data-swiping:duration-0 data-swiping:select-none",
    side === "right"
      ? "data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]"
      : "data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)]",
    WIDTH[size],
  );
}

export interface SheetContentProps extends BaseDrawer.Popup.Props {
  /** Width: sm 320px, md 400px (default), lg 520px. Never wider than the viewport minus 48px. */
  size?: SheetSize;
  /** Show the × button in the top-right corner. */
  showClose?: boolean;
}

/**
 * The panel: portal, scrim and edge placement built in. Esc, a click on the
 * scrim, or a swipe toward its edge closes it. Lay it out with SheetHeader,
 * SheetBody and SheetFooter.
 */
export function SheetContent({ size = "md", showClose = true, className, children, ...props }: SheetContentProps) {
  const side = React.useContext(SheetSideContext);
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className={backdrop} />
      <BaseDrawer.Viewport className={cn("fixed inset-0 z-50 flex", side === "right" ? "justify-end" : "justify-start")}>
        <BaseDrawer.Popup {...props} className={withClass(popup(side, size), className)}>
          <BaseDrawer.Content className="flex min-h-0 flex-1 flex-col">{children}</BaseDrawer.Content>
          {showClose ? (
            <BaseDrawer.Close
              render={<Button variant="ghost" size="sm" icon aria-label="Close" />}
              className="absolute top-3 right-3"
            >
              <XGlyph />
            </BaseDrawer.Close>
          ) : null}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export interface SheetHeaderProps extends React.ComponentProps<"div"> {}

/** Title and description at the top, on a hairline. Leaves room for the × button. */
export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return <div {...props} className={cn("shrink-0 border-b border-line py-3.5 pr-12 pl-5", className)} />;
}

export type SheetTitleProps = BaseDrawer.Title.Props;

/** The sheet's heading. Required: it names the sheet for screen readers. */
export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return <BaseDrawer.Title {...props} className={withClass("text-[15px] leading-6 font-semibold tracking-[-0.01em] text-ink", className)} />;
}

export type SheetDescriptionProps = BaseDrawer.Description.Props;

/** One sentence under the title. */
export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return <BaseDrawer.Description {...props} className={withClass("mt-0.5 text-xs text-ink-2", className)} />;
}

export interface SheetBodyProps extends React.ComponentProps<"div"> {}

/** The scrolling middle. Takes the remaining height. */
export function SheetBody({ className, ...props }: SheetBodyProps) {
  return <div {...props} className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)} />;
}

export interface SheetFooterProps extends React.ComponentProps<"div"> {}

/** The action row, pinned to the bottom: a hairline, a panel tone, buttons right-aligned. */
export function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      {...props}
      className={cn("flex shrink-0 items-center justify-end gap-2 border-t border-line bg-panel px-5 py-3", className)}
    />
  );
}

export type SheetCloseProps = BaseDrawer.Close.Props;

/** Closes the sheet. Compose with Button: `<SheetClose render={<Button />}>Cancel</SheetClose>`. */
export function SheetClose(props: SheetCloseProps) {
  return <BaseDrawer.Close {...props} />;
}
