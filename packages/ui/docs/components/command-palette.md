---
title: CommandPalette
description: The ⌘K command list. A modal search over grouped commands with icons and shortcut hints, arrow keys and Enter. Opens instantly.
group: Layout
order: 60
---

# CommandPalette

The ⌘K command list. It's a modal search field over grouped commands. Type to filter, use ↑ ↓ to move, ↵ to run, Esc to close. It **opens without animation**: it's summoned many times an hour from the keyboard, and any choreography gets in the way. It closes in 100ms.

```tsx
import { CommandPalette, useCommandPaletteShortcut } from "@nils/ui";
```

## Examples

### Basic

Keep `open` in state, bind ⌘K/Ctrl+K with `useCommandPaletteShortcut`, and pass your commands as groups. Each item's `onSelect` runs after the palette closes.

```tsx live
import { Button, CommandPalette, useCommandPaletteShortcut } from "@nils/ui";
import { FileIcon, GearSixIcon, MoonIcon, PlusIcon, SignOutIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("nothing yet");
  useCommandPaletteShortcut(setOpen);

  const run = (what: string) => () => setLast(what);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button shortcut="⌘K" onClick={() => setOpen(true)}>Search commands</Button>
      <p className="text-xs text-ink-2">Ran: <span className="font-mono text-ink">{last}</span></p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={[
          {
            label: "Projects",
            items: [
              { id: "new", label: "New project", icon: <PlusIcon />, shortcut: "⇧⌘N", onSelect: run("new project") },
              { id: "open", label: "Open recent file", icon: <FileIcon />, keywords: ["history"], onSelect: run("open recent") },
            ],
          },
          {
            label: "Preferences",
            items: [
              { id: "theme", label: "Toggle dark mode", icon: <MoonIcon />, keywords: ["theme", "light"], onSelect: run("toggle theme") },
              { id: "settings", label: "Open settings", icon: <GearSixIcon />, shortcut: "⌘,", onSelect: run("settings") },
              { id: "logout", label: "Sign out", icon: <SignOutIcon />, onSelect: run("sign out") },
            ],
          },
        ]}
      />
    </div>
  );
}
```

## Rules

- **Do** bind the shortcut with `useCommandPaletteShortcut(setOpen)` and show it on the trigger (`<Button shortcut="⌘K">`).
- **Do** name commands as verbs ("New project", "Toggle dark mode"), sentence case.
- **Do** add `keywords` for synonyms people will type ("theme" for "Toggle dark mode").
- **Do** show a `shortcut` on an item only if that shortcut is actually bound elsewhere.
- **Don't** add an opening animation or wrap it in a motion library. Instant is the design.
- **Don't** put forms or multi-step flows inside. An item does one thing; if it needs input, open a `Dialog` from `onSelect`.
- **Don't** mount more than one palette in an app.

## Props

### CommandPalette

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Required. Called on Esc, outside click, and after an item runs. |
| `groups` | `CommandGroup[]` | — | Required. `{ label, items }[]`. Empty groups are hidden while searching. |
| `placeholder` | `string` | `"Type a command or search…"` | Search field placeholder. |
| `label` | `string` | `"Command palette"` | Accessible name of the dialog. |

### CommandItem

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Required. Unique across all groups. |
| `label` | `string` | Required. What's shown and searched. |
| `onSelect` | `() => void` | Required. Runs after the palette closes. |
| `icon` | `ReactNode` | 16px icon before the label. |
| `shortcut` | `string` | Display-only hint, e.g. `"⇧⌘N"`. |
| `keywords` | `string[]` | Extra search terms. |
| `disabled` | `boolean` | Shown dimmed and skipped. |

Search is case-insensitive and order-free: every typed word must be the start of some word in the label or keywords. `dar mo` finds “Toggle dark mode”.

### useCommandPaletteShortcut

```ts
useCommandPaletteShortcut(setOpen: Dispatch<SetStateAction<boolean>>, key = "k"): void
```

Toggles on ⌘K (macOS) or Ctrl+K (elsewhere). Pass a different `key` to change the letter.

## Accessibility

- Built on Base UI Dialog and Autocomplete: focus moves into the search field on open and returns to the trigger on close, and focus is trapped while open.
- The input is a `combobox` controlling a `listbox`. The highlighted item is announced via `aria-activedescendant`, and the first match is highlighted automatically.
- The key hints in the footer are referenced by the input's `aria-describedby`.

## Motion

- Open: none. The palette and scrim appear on the next frame.
- Close: 100ms opacity and `scale(0.98)` on `ease-snap`.
- Highlight: instant. It follows the keyboard.
