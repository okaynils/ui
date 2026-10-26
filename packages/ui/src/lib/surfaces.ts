/*
 * Shared class recipes, so every floating surface, list item and field in the
 * library looks and moves the same. Components compose these; they're not
 * exported from the package.
 */

/** Popover, menu, select list, tooltip-sized surfaces. Grows from its trigger. */
export const popupSurface = [
  "rounded-box bg-surface text-ink shadow-pop outline-none",
  "origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-snap",
  "data-starting-style:scale-96 data-starting-style:opacity-0",
  "data-ending-style:scale-96 data-ending-style:opacity-0 data-ending-style:duration-100",
].join(" ");

/** Padding for a list-like popup (menu, select). Items inside use `popupItem`. */
export const popupList = "min-w-40 p-1";

/**
 * An item inside a menu, select or command list. Highlight is instant (no
 * transition) — it follows the keyboard, and lag there reads as sluggishness.
 */
export const popupItem = [
  "relative flex h-8 cursor-default select-none items-center gap-2 rounded-[2px] px-2 text-ui text-ink outline-none",
  "data-highlighted:bg-hover data-disabled:pointer-events-none data-disabled:opacity-45",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-ink-2",
].join(" ");

/** Hairline + focus ring for text-like fields (input, textarea, select trigger). */
export const fieldSurface = [
  "rounded-ui bg-surface text-ui text-ink outline-none",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-shadow duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_12%)]",
  "focus-visible:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "data-focused:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "data-invalid:shadow-[inset_0_0_0_1px_var(--ui-err)]",
  "data-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--ui-err),0_0_0_3px_color-mix(in_oklab,var(--ui-err)_18%,transparent)]",
  "placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-45 data-disabled:cursor-not-allowed data-disabled:opacity-45",
].join(" ");
