import { Popover as BasePopover } from "@base-ui/react/popover";
import { popupSurface } from "../lib/surfaces";
import { withClass } from "./overlay-utils";

export type PopoverProps = BasePopover.Root.Props;

/** Root. Holds open state; renders nothing itself. Controlled via `open` / `onOpenChange`. */
export function Popover(props: PopoverProps) {
  return <BasePopover.Root {...props} />;
}

export type PopoverTriggerProps = BasePopover.Trigger.Props;

/** The element that toggles the popover. Compose with Button: `<PopoverTrigger render={<Button />}>`. */
export function PopoverTrigger(props: PopoverTriggerProps) {
  return <BasePopover.Trigger {...props} />;
}

export interface PopoverContentProps extends BasePopover.Popup.Props {
  /** Which side of the trigger to open on. Flips when there's no room. */
  side?: BasePopover.Positioner.Props["side"];
  /** Alignment along that side. */
  align?: BasePopover.Positioner.Props["align"];
  /** Gap between trigger and popover, in px. */
  sideOffset?: number;
  alignOffset?: number;
}

/**
 * The floating panel. Portal and positioning are built in; it grows out of
 * its trigger (150ms in, 100ms out). Default width 18rem; set `className="w-…"` to change.
 */
export function PopoverContent({
  side = "bottom",
  align = "center",
  sideOffset = 6,
  alignOffset = 0,
  className,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} className="z-50 outline-none">
        <BasePopover.Popup
          {...props}
          className={withClass(`${popupSurface} w-72 max-w-[calc(100vw-2rem)] p-4 text-sm`, className)}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export type PopoverTitleProps = BasePopover.Title.Props;

/** Heading inside the popover; labels it for screen readers. */
export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      {...props}
      className={withClass("text-sm font-semibold text-ink", className)}
    />
  );
}

export type PopoverDescriptionProps = BasePopover.Description.Props;

/** Supporting text under the title. */
export function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      {...props}
      className={withClass("mt-1 text-ui text-ink-2", className)}
    />
  );
}

export type PopoverCloseProps = BasePopover.Close.Props;

/** Closes the popover. Compose with Button: `<PopoverClose render={<Button />}>Done</PopoverClose>`. */
export function PopoverClose(props: PopoverCloseProps) {
  return <BasePopover.Close {...props} />;
}
