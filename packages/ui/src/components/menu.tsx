import { Menu as BaseMenu } from "@base-ui/react/menu";
import type * as React from "react";
import { cn } from "../lib/cn";
import { popupItem, popupList, popupSurface } from "../lib/surfaces";
import { CaretRightGlyph, CheckGlyph, withClass } from "./overlay-utils";

/*
 * Menu items are shared with ContextMenu (Base UI uses the same parts for
 * both), so everything below works inside either.
 */

const menuPopup = `${popupSurface} ${popupList} max-h-(--available-height) overflow-y-auto`;
// Leaves room for the check/radio indicator so labels line up in a mixed menu.
const insetPad = "pl-7";

export type MenuProps = BaseMenu.Root.Props;

/** Root of a dropdown menu. Holds open state; renders nothing itself. */
export function Menu(props: MenuProps) {
  return <BaseMenu.Root {...props} />;
}

export type MenuTriggerProps = BaseMenu.Trigger.Props;

/** Opens the menu on click (and arrow keys). Compose with Button: `<MenuTrigger render={<Button />}>`. */
export function MenuTrigger(props: MenuTriggerProps) {
  return <BaseMenu.Trigger {...props} />;
}

export interface MenuContentProps extends BaseMenu.Popup.Props {
  side?: BaseMenu.Positioner.Props["side"];
  align?: BaseMenu.Positioner.Props["align"];
  sideOffset?: number;
  alignOffset?: number;
}

/** The floating list. Portal and positioning built in; grows from the trigger. Defaults: below, start-aligned. */
export function MenuContent({ side = "bottom", align = "start", sideOffset = 6, alignOffset = 0, className, ...props }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} className="z-50 outline-none">
        <BaseMenu.Popup {...props} className={withClass(menuPopup, className)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export interface MenuItemProps extends BaseMenu.Item.Props {
  /** Keyboard hint at the right edge, e.g. "⌘D". Display only. */
  shortcut?: string;
  /** `danger` turns the item red. Only for actions that destroy something. */
  variant?: "default" | "danger";
  /** Indent the label to line up with checkbox/radio items in the same menu. */
  inset?: boolean;
}

/** An action. Closes the menu when chosen. Put a 16px icon first if you like. */
export function MenuItem({ shortcut, variant = "default", inset, className, children, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      className={withClass(
        cn(
          popupItem,
          inset && insetPad,
          variant === "danger" && "text-err data-highlighted:bg-err/8 [&_svg]:text-err",
        ),
        className,
      )}
    >
      {children}
      {shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : null}
    </BaseMenu.Item>
  );
}

export interface MenuLinkItemProps extends BaseMenu.LinkItem.Props {
  inset?: boolean;
}

/** An item that navigates. Renders an `<a>`; pass `href`. */
export function MenuLinkItem({ inset, className, ...props }: MenuLinkItemProps) {
  return <BaseMenu.LinkItem {...props} className={withClass(cn(popupItem, inset && insetPad), className)} />;
}

function MenuShortcut({ children }: { children: React.ReactNode }) {
  return <span className="ml-auto pl-6 font-mono text-[11px] tracking-normal text-ink-3">{children}</span>;
}

export interface MenuCheckboxItemProps extends BaseMenu.CheckboxItem.Props {
  shortcut?: string;
}

/** A toggle. Stays open when chosen, so several can be flipped in a row. */
export function MenuCheckboxItem({ shortcut, className, children, closeOnClick = false, ...props }: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem {...props} closeOnClick={closeOnClick} className={withClass(cn(popupItem, insetPad), className)}>
      <BaseMenu.CheckboxItemIndicator className="absolute left-2 flex size-4 items-center justify-center">
        <CheckGlyph className="size-3.5 text-ink!" />
      </BaseMenu.CheckboxItemIndicator>
      {children}
      {shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : null}
    </BaseMenu.CheckboxItem>
  );
}

export interface MenuRadioGroupProps extends BaseMenu.RadioGroup.Props {
  /** Optional label shown above the options (mono, uppercase). */
  label?: React.ReactNode;
}

/** A set of mutually exclusive `MenuRadioItem`s. Controlled via `value` / `onValueChange`. */
export function MenuRadioGroup({ label, children, ...props }: MenuRadioGroupProps) {
  return (
    <BaseMenu.RadioGroup {...props}>
      {label ? <BaseMenu.GroupLabel className={menuLabel}>{label}</BaseMenu.GroupLabel> : null}
      {children}
    </BaseMenu.RadioGroup>
  );
}

export type MenuRadioItemProps = BaseMenu.RadioItem.Props;

/** One option in a `MenuRadioGroup`. Stays open when chosen. */
export function MenuRadioItem({ className, children, closeOnClick = false, ...props }: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem {...props} closeOnClick={closeOnClick} className={withClass(cn(popupItem, insetPad), className)}>
      <BaseMenu.RadioItemIndicator className="absolute left-2 flex size-4 items-center justify-center">
        <span className="size-1.5 rounded-full bg-ink" />
      </BaseMenu.RadioItemIndicator>
      {children}
    </BaseMenu.RadioItem>
  );
}

const menuLabel = "ui-label flex h-7 items-center px-2 pt-1 select-none";

export interface MenuGroupProps extends BaseMenu.Group.Props {
  /** Optional label shown above the group (mono, uppercase). Also names the group for screen readers. */
  label?: React.ReactNode;
}

/** Groups related items under an optional label. */
export function MenuGroup({ label, children, ...props }: MenuGroupProps) {
  return (
    <BaseMenu.Group {...props}>
      {label ? <BaseMenu.GroupLabel className={menuLabel}>{label}</BaseMenu.GroupLabel> : null}
      {children}
    </BaseMenu.Group>
  );
}

export interface MenuLabelProps extends React.ComponentProps<"div"> {
  inset?: boolean;
}

/** A standalone heading inside a menu (not tied to a group). Prefer `MenuGroup label="…"`. */
export function MenuLabel({ inset, className, ...props }: MenuLabelProps) {
  return <div role="presentation" {...props} className={cn(menuLabel, inset && insetPad, className)} />;
}

export type MenuSeparatorProps = BaseMenu.Separator.Props;

/** A hairline between groups of items. */
export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <BaseMenu.Separator {...props} className={withClass("-mx-1 my-1 h-px bg-line", className)} />;
}

export type MenuSubProps = BaseMenu.SubmenuRoot.Props;

/** Root of a nested menu. Contains a `MenuSubTrigger` and a `MenuSubContent`. */
export function MenuSub(props: MenuSubProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export interface MenuSubTriggerProps extends BaseMenu.SubmenuTrigger.Props {
  inset?: boolean;
}

/** The item that opens a nested menu (hover, click, or →). Shows a caret. */
export function MenuSubTrigger({ inset, className, children, ...props }: MenuSubTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger
      {...props}
      className={withClass(cn(popupItem, "data-popup-open:bg-hover", inset && insetPad), className)}
    >
      {children}
      <CaretRightGlyph className="ml-auto size-3.5" />
    </BaseMenu.SubmenuTrigger>
  );
}

export type MenuSubContentProps = BaseMenu.Popup.Props;

/** The nested list. Opens beside its trigger, aligned with the item. */
export function MenuSubContent({ className, ...props }: MenuSubContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4} alignOffset={-4} className="z-50 outline-none">
        <BaseMenu.Popup {...props} className={withClass(menuPopup, className)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}
