import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { popupList, popupSurface } from "../lib/surfaces";
import { withClass } from "./overlay-utils";

/*
 * Right-click (or long-press) menus. Fill ContextMenuContent with the same
 * item parts as a dropdown: MenuItem, MenuCheckboxItem, MenuRadioGroup,
 * MenuGroup, MenuSeparator, MenuSub… — Base UI shares them between both.
 */

export type ContextMenuProps = BaseContextMenu.Root.Props;

/** Root of a context menu. */
export function ContextMenu(props: ContextMenuProps) {
  return <BaseContextMenu.Root {...props} />;
}

export type ContextMenuTriggerProps = BaseContextMenu.Trigger.Props;

/** The area that opens the menu on right-click / long-press. Renders a `<div>`. */
export function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  return <BaseContextMenu.Trigger {...props} />;
}

export type ContextMenuContentProps = BaseContextMenu.Popup.Props;

/** The floating list, opened at the pointer. Grows from the pointer position. */
export function ContextMenuContent({ className, ...props }: ContextMenuContentProps) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="z-50 outline-none">
        <BaseContextMenu.Popup
          {...props}
          className={withClass(`${popupSurface} ${popupList} max-h-(--available-height) overflow-y-auto`, className)}
        />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}
