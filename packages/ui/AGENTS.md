---
title: AGENTS.md
description: Start here. How to install and use @nils/ui, where every doc lives, and the rules an agent must follow when building UI with it.
group: Start
order: 1
---

# AGENTS.md

You are an agent building an interface with `@nils/ui`. This file tells you how to install it, where the rest of the documentation is, and the rules you must follow. Read it fully before writing UI code. It is short on purpose.

## What this is

A small, opinionated React 19 + Tailwind CSS v4 component library, built on [Base UI](https://base-ui.com) for accessibility. The look is a **utility console**: white and grey surfaces, hairline dividers, one saturated blue accent, Inter for text, JetBrains Mono for labels and data, 4px corners, and quick, firm motion. The library has taste baked in; your job is to compose it, not to restyle it.

## Install

```bash
bun add @nils/ui   # or: npm i @nils/ui
```

The project needs React 19+ and Tailwind CSS v4. In the CSS file that imports Tailwind, add the library's styles **after** Tailwind:

```css
@import "tailwindcss";
@import "@nils/ui/styles.css";
```

That one import gives you the fonts, every design token as a Tailwind utility (`bg-panel`, `text-ink-2`, `border-line`, `rounded-ui`, `shadow-pop`, `ease-snap`, `ui-label`, …), the base text styles, and the class scanning the components need. Do not install or configure a second font, colour palette, or reset.

Dark mode: set `data-theme="dark"` (or `"light"`) on `<html>`. Without it, the library is light.

Mount these once near the root of the app:

```tsx
import { Toaster, TooltipProvider } from "@nils/ui";

<TooltipProvider>
  <App />
  <Toaster />
</TooltipProvider>
```

`Toaster` is required for `toast()` to show anything. `TooltipProvider` makes neighbouring tooltips open instantly once one is showing. Everything else works standalone.

```tsx
import { Button } from "@nils/ui";

export function Save() {
  return <Button variant="primary">Save changes</Button>;
}
```

## Where the docs are

All documentation is plain markdown and ships inside the package. Read the file for a component **before** you use it — the examples are copy-pasteable and the rules are not suggestions.

| What | In the package | On the docs site |
| --- | --- | --- |
| This file | `node_modules/@nils/ui/AGENTS.md` | `/agents.md` |
| Visual contract: tokens, type, motion, copy | `node_modules/@nils/ui/DESIGN.md` | `/design.md` |
| Setup in detail | `node_modules/@nils/ui/docs/getting-started.md` | `/getting-started.md` |
| One page per component | `node_modules/@nils/ui/docs/components/<name>.md` | `/components/<name>.md` |
| Index of everything | — | `/llms.txt`, `/llms-full.txt` |

Each component page has: what it's for, the import, live examples (` ```tsx live ` blocks are real, runnable code), do/don't rules, a props table, and accessibility notes.

## Components

<!-- components:start -->
| Component | Import | Use it for |
| --- | --- | --- |
| **Controls** | | |
| Button | `Button`, `buttonClassName` | Every pressable action. One `primary` per view. |
| Kbd | `Kbd` | Keyboard shortcut hints. |
| Link | `Link` | Inline text link, always underlined; `quiet` for ink links, `external` adds ↗ and a new tab; `render` for router links. |
| Field | `Field`, `Form`, `FieldRoot`, `FieldLabel`, `FieldDescription`, `FieldError` | Label + control + help/error for every form control; `Form` for native and server validation. |
| Input | `Input` | Single-line text, three sizes, with leading/trailing icons, units or hints. |
| Textarea | `Textarea` | Multi-line text; `autoGrow` to grow with content. |
| SearchField | `SearchField` | Search input with magnifier, clear button, Escape to clear and an optional page-wide focus shortcut. |
| PasswordInput | `PasswordInput` | Password field with a show/hide toggle that keeps the cursor, a Caps Lock warning, and current/new autocomplete. |
| Checkbox | `Checkbox` | On/off that applies on save, multi-select, indeterminate parents. |
| Radio group | `RadioGroup`, `Radio` | One of 2–5 options that should all stay visible. |
| Switch | `Switch` | A setting that takes effect immediately. |
| CheckboxGroup | `CheckboxGroup`, `Fieldset` | Several checkboxes with one array value and optional "select all"; Fieldset names any group of controls. |
| Toggle | `Toggle`, `ToggleGroup` | A button that stays pressed (bold, pin, mute); ToggleGroup shares one value across several, single or multiple. |
| Segmented control | `SegmentedControl` | One of 2–5 short options side by side (view, range); the selection slides. |
| Select | `Select`, `SelectRoot`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectSeparator` | Pick one value from a longer list in a popup. |
| Combobox | `Combobox` | Searchable single or multiple selection; `multiple creatable` for tag entry. |
| NumberField | `NumberField` | Numeric quantities with keyboard stepping, units and a scrubbable label. |
| Slider | `Slider` | A bounded quantity or range, with one or more thumbs. |
| Calendar | `Calendar` | Pick a day or date range with keyboard navigation. |
| DatePicker | `DatePicker` | Type an ISO date or pick one from a calendar. |
| OTPField | `OTPField` | One-time codes with paste, autofill and visual grouping. |
| FileDrop | `FileDrop` | Browse or drop files; type, size and count limits with rejection reasons. |
| **Overlays** | | |
| Popover | `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverTitle`, `PopoverDescription`, `PopoverClose` | A small floating panel for extra detail or a few quick controls. |
| Menu | `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuLinkItem`, `MenuCheckboxItem`, `MenuRadioGroup`, `MenuRadioItem`, `MenuGroup`, `MenuLabel`, `MenuSeparator`, `MenuSub`, `MenuSubTrigger`, `MenuSubContent` | Dropdown lists of actions from a button. Not for picking form values (that's Select). |
| ContextMenu | `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent` (+ Menu item parts) | Right-click shortcuts on rows, cards, canvas objects. |
| Dialog | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` | Modal panel for one short, focused task. |
| ConfirmDialog | `ConfirmDialog` | "Are you sure?" before destructive or hard-to-undo actions. Async-aware. |
| Tooltip | `Tooltip`, `TooltipProvider` | Naming icon-only controls, with an optional shortcut. |
| Toast | `Toaster`, `toast` | Short notices that something happened; `toast.success/error/warning/promise`. Mount one `<Toaster />`. |
| **Layout** | | |
| Panel | `Panel` | Grouping related content with a hairline edge, title row and footer. Use instead of cards. |
| List | `List`, `ListItem` | Flat hairline-separated rows; whole-row links/buttons, `selected` for the current row. |
| Status | `Status`, `StatusDot` | Status as dot + word. The only place status colour appears. |
| Separator | `Separator` | A hairline between groups, optionally labelled; vertical in toolbars. |
| EmptyState | `EmptyState` | What an empty list/page shows: the fact, one sentence, the next action. |
| CommandPalette | `CommandPalette`, `useCommandPaletteShortcut` | The ⌘K command list. One per app. |
| ScrollArea | `ScrollArea` | Scroll region with thin overlay scrollbars and edge fades where more content is hidden; vertical, horizontal or both. |
| **Data** | | |
| Table | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell` | Console table parts for custom cells and structure. |
| DataTable | `DataTable` | Rows and columns with sorting, selection, loading and change flashes. |
| NumberRoll | `NumberRoll` | Numbers whose changed digits roll when updated. |
| Stat | `Stat`, `StatGroup` | Dashboard metrics with rolling values and directional deltas. |
| KeyValue | `KeyValue`, `KeyValueItem` | Properties of one thing as a description list. |
| Tabs | `Tabs`, `TabsList`, `Tab`, `TabsPanel` | Switch between related views; sliding underline, instant panels. |
| Progress | `Progress`, `Meter` | Task completion or a measured quantity; optional discrete segments. |
| Skeleton | `Skeleton` | Loading placeholders delayed 300ms to avoid flashing on fast loads. |
| Pagination | `Pagination` | Page navigation for tables and lists: buttons or real links (`getHref`), ellipses, accent current page; `compact` "Page 3 of 12". |
| Timeline | `Timeline` | Vertical activity/audit log with mono times, day headers and a change flash on new entries. |
| Tree | `Tree` | File/resource explorer: expandable branches, single selection, full WAI-ARIA tree keyboard model. |
| Sparkline | `Sparkline` | Word-sized line, area or bar trend for stats and table cells; gaps stay gaps, hover readout. |
| **Feedback** | | |
| Callout | `Callout` | An inline note in the page; tone colours only the dot. Page-wide announcements are `Banner`. |
| Badge | `Badge` | Counts, versions and tags as a small hairline label. |
| Avatar | `Avatar`, `AvatarGroup` | People and organisations with initials fallback. |
| Accordion | `Accordion`, `AccordionItem` | Stacked sections that expand in place. |
| Collapsible | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` | One region of optional detail, such as advanced settings. |
| Spinner | `Spinner` | Short waits beside a word. Use `Button loading` for actions. |
| CopyButton | `CopyButton` | Copy a value with an icon-to-check confirmation. |
| Code | `Code`, `CodeBlock` | Inline IDs and snippet blocks with filename, line numbers and copy. |
| HoverCard | `HoverCard`, `HoverCardTrigger`, `HoverCardContent` | Non-essential previews of links, people or IDs. |
| Steps | `Steps` | Progress through a fixed multi-step flow; completed steps can be revisited, failed steps say why. |
| Banner | `Banner` | Full-width one-line announcement for the top of a page or app; dot + label tone, one action, dismiss that collapses. |
| LinkPreview | `LinkPreview` | A bookmark preview with supplied title, image, favicon and annotation. |
| ReleaseBadge | `ReleaseBadge` | A version label with release date and change details. |
| **Shell** | | |
| AppShell | `AppShell`, `SidebarTrigger` | Sidebar and main column; navigation becomes a sheet below 576px of shell width. Give it a height. |
| Sidebar | `Sidebar`, `SidebarHeader`, `SidebarSection`, `SidebarItem`, `SidebarFooter` | App navigation with sections, counts and one active item. |
| TopBar | `TopBar` | Sticky 48px bar with breadcrumbs and actions. |
| Breadcrumbs | `Breadcrumbs` | Location trail; long trails fold into a menu. |
| PageHeader | `PageHeader` | Page title, description, actions and metadata. |
| Toolbar | `Toolbar`, `ToolbarGroup`, `ToolbarButton`, `ToolbarToggle`, `ToolbarSeparator` | Related controls with one tab stop and arrow navigation. |
| Sheet | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetBody`, `SheetFooter`, `SheetClose` | Side panel for details or editing; swipe to dismiss. |
| **Gimmicks** | | |
| NowPlaying | `NowPlaying` | Listening badge: artwork, track, equaliser bars while playing, a playhead that keeps time between updates. |
| LocalTime | `LocalTime` | A place's clock with a tiny analog dial that steps each minute and darkens at night; optional working hours and time difference. |
| Availability | `Availability` | A compact availability status with optional explanation. |
| ActivityCalendar | `ActivityCalendar` | A year of daily activity as a neutral grid with current/longest streaks; pointing at a streak outlines the run. |
| CurrentlyReading | `CurrentlyReading` | The book on your nightstand: cover, a page block as thick as the book, and a bookmark ribbon at your page. |
| WeatherBadge | `WeatherBadge` | Compact weather report with a daylight arc: the sun on its path from sunrise to sunset, and the daylight left. |
| Webring | `Webring` | A ring of member dots marking this site, prev/next links, and a Random that shuffles before it lands. |
| UptimeStrip | `UptimeStrip` | Daily service health with incident detail. |
| Countdown | `Countdown` | Departure-board blocks whose digits roll down to an event; `inline` variant for sentences. |
| FocusTimer | `FocusTimer` | Focus/break timer on a kitchen-timer dial that drains while running; optional countdown in the tab title. |
| Waveform | `Waveform` | An audio waveform with elapsed time and seeking. |
| KeystrokeDisplay | `KeystrokeDisplay` | Screencast key overlay: keycaps that physically press while held, older chords fade; fixed (with `pressed`) or captured on focus. |
| BeforeAfter | `BeforeAfter` | An accessible draggable divider comparing two images. |
| Guestbook | `Guestbook` | Old-web ledger of numbered signatures, newest on top, with a sign form; a new entry lands with a change flash while the count rolls. Storage and moderation stay in the app. |
| VisitorCounter | `VisitorCounter` | An odometer whose changed wheels roll; the app supplies the count. |
| MiniMap | `MiniMap` | A map readout with rulers, a crosshair on the primary place and mono coordinates; point at a marker to move the crosshair. |
| Receipt | `Receipt` | Thermal-printer receipt with a torn edge; sums its lines and can feed out of the printer. |
| Ticket | `Ticket` | Event ticket with a perforated stub and a real Code 128 barcode; tear the stub to check in. |
| SplitFlap | `SplitFlap` | Departure-board text whose changed cells flip; fixed or rotating through words. |
| Waitlist | `Waitlist` | Email sign-up that becomes your place in line; the number rolls and the queue steps forward. |
| Stamp | `Stamp` | Rubber stamp ("Paid", "Shipped") that lands with a thunk when an action completes. |
| DeployStamp | `DeployStamp` | Footer line "Deployed 14 min ago from a1b2c3d on main"; the age keeps counting, deploying pulses, failed says so. |
| StarButton | `StarButton` | "Star · 1,284" split button; starring fills the star and rolls the count; optional stargazers link. |
| SeatsLeft | `SeatsLeft` | "7 of 20 spots left" with every seat drawn; a claimed seat lights up and the count rolls down. |
| Kudos | `Kudos` | Applause button: click or hold to give, the count rolls with a floating "+1", bursts reach the app as one batch. |
| ScratchCard | `ScratchCard` | Scratch-off card hiding a promo code, date or invite; scratch the coating away or press Reveal. |
<!-- components:end -->

For a complete console screen composed from these parts, read `docs/examples/console.md` ([Console showcase](/examples/console) on the docs site). For a full-window app, use `<AppShell className="h-dvh">`; for a contained preview, give its parent a height.

## Gimmicks

These optional widgets cover personal sites and specialised screens. Read their component docs before using them. The consuming app supplies service data, authentication, storage and moderation; widgets work with local data in the examples. They follow the same tokens and keyboard access as the core components, and each gets one signature move: a playful detail that shows real state, such as the odometer roll or the equaliser. Don't add a second one; see the Gimmicks section of DESIGN.md.

## Rules

These are what separates UI that belongs to this library from UI that merely imports it.

### Use what exists

1. **Use a library component whenever one fits.** Don't hand-roll a button, input, checkbox, menu, dialog, or tooltip with raw elements and Tailwind. If you need a link that looks like a button, use `buttonClassName()` or `<Button render={<a href="…" />} nativeButton={false}>`.
2. **Don't restyle components.** `className` is for layout (margin, width, grid placement), not for changing colour, radius, height, or font. If a variant you need doesn't exist, use the closest one and say so in your summary — don't invent one inline.
3. **Compose with `render`.** Components built on Base UI accept a `render` prop to swap the element or merge with another component (e.g. a `Tooltip` trigger that is also a `Button`). Read the component's page for the exact pattern.

### Use tokens

4. **Only token colours.** `bg-surface`, `bg-panel`, `bg-raised`, `bg-hover`, `bg-active`, `border-line`, `border-line-strong`, `text-ink`, `text-ink-2`, `text-ink-3`, `bg-accent`, `text-ok`, `text-warn`, `text-err`. Never `gray-*`, `zinc-*`, `slate-*`, `white`, `black`, or hex values in components.
5. **One accent per view.** At most one `variant="primary"` button visible at a time. Blue also marks the current location and links — nothing else.
6. **Status is a dot plus a word.** Never a coloured row, coloured badge background, or coloured paragraph.
7. **Corners:** `rounded-ui` (4px) for controls, `rounded-box` (6px) for floating surfaces and panels. Never `rounded-lg`, `rounded-xl`, `rounded-2xl`, or pill-shaped buttons.
8. **No shadows on in-page things.** Separate with hairlines (`border-line`) and tone (`bg-panel`). `shadow-pop` and `shadow-modal` are for floating layers only, and the components already apply them.

### Type

9. **Text sizes:** `text-sm` (14) body, `text-ui` (13) controls, `text-xs` (12) meta, `ui-label` (11 mono uppercase) for section labels and table headers. Titles per DESIGN.md. Don't invent sizes.
10. **IDs, hashes, timestamps, versions, prices in tables → `font-mono`**; changing numbers → `tabular-nums`.
11. **Sentence case**, verbs on buttons, no exclamation marks.

### Motion

12. **Under 200ms for anything the user triggers, exits faster than entrances, `ease-snap` curve.** The components already do this — don't wrap them in extra animation libraries or add `transition-all duration-500`.
13. **No animation on things the user does many times a minute** via keyboard (⌘K, arrowing through lists).
14. **Wide elements respond with tone, compact ones with scale.** Use `ui-press` on your own small pressables; never scale a row.

### Layout

15. **Hairlines, not boxes.** Lists are rows separated by `border-line`, not stacks of cards. Group related settings in a `Panel`, not in nested bordered boxes.
16. **One height per row.** Controls placed side by side share a `size`.
17. **Keyboard hints where they help.** If an action has a shortcut, show it with `Kbd` (or `Button`'s `shortcut` prop) and actually bind it.

## Before you finish

Check your work against this list:

- [ ] Every interactive element is a library component (or uses `buttonClassName` / `ui-press`).
- [ ] No raw palette colours, hex values, or `rounded-lg`+ in your code.
- [ ] At most one primary button per view.
- [ ] Icon-only buttons have `aria-label`.
- [ ] Inputs have a visible label (`Field`) or an `aria-label`.
- [ ] User-triggered transitions finish within 200ms; the passive change flash fades over 1s (see DESIGN.md).
- [ ] Both `data-theme="light"` and `"dark"` look right (you used tokens, so they should).

## Contributing to the library itself

If you are changing `@nils/ui` rather than using it, read the repository's root `AGENTS.md`.
