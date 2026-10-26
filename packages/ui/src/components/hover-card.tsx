import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { popupSurface } from "../lib/surfaces";
import { withClass } from "./overlay-utils";

export type HoverCardProps = BasePreviewCard.Root.Props;

/** Root. Holds open state. Opens on hover or keyboard focus of its trigger. */
export function HoverCard(props: HoverCardProps) {
  return <BasePreviewCard.Root {...props} />;
}

export interface HoverCardTriggerProps extends BasePreviewCard.Trigger.Props {}

/**
 * The link or name that previews on hover. Renders an `<a>` — give it an
 * `href` so it still works as a link, or swap the element with `render`.
 * Opens after 400ms (long enough not to fire while the pointer passes over),
 * closes 150ms after leaving.
 */
export function HoverCardTrigger({ delay = 400, closeDelay = 150, className, ...props }: HoverCardTriggerProps) {
  return (
    <BasePreviewCard.Trigger
      {...props}
      delay={delay}
      closeDelay={closeDelay}
      className={withClass(
        "text-ink underline decoration-line-strong underline-offset-[3px] transition-colors hover:decoration-ink-3 data-popup-open:decoration-ink-3",
        className,
      )}
    />
  );
}

export interface HoverCardContentProps extends BasePreviewCard.Popup.Props {
  side?: BasePreviewCard.Positioner.Props["side"];
  align?: BasePreviewCard.Positioner.Props["align"];
  sideOffset?: number;
}

/** The floating preview. Portal and positioning built in; grows from the trigger. Default width 18rem. */
export function HoverCardContent({ side = "bottom", align = "start", sideOffset = 6, className, ...props }: HoverCardContentProps) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50 outline-none">
        <BasePreviewCard.Popup
          {...props}
          className={withClass(`${popupSurface} w-72 max-w-[calc(100vw-2rem)] p-3 text-ui`, className)}
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}
