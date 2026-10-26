---
title: Design
description: The visual contract — principles, tokens, type, spacing, corners, elevation, motion and copy. Every number here is what a change is judged against.
group: Start
order: 3
---

# Design

This is the whole visual contract of `@nils/ui`. When something here disagrees with a habit, a framework default, or another design system, this wins. Every value below exists as a token in `styles.css`; use the token, never the raw value.

## Principles

Four words, in priority order when they conflict.

1. **Firm.** Things feel solid. Hairlines instead of soft shadows, 4px corners instead of pills, controls that give a little under the finger and snap back. Nothing wobbles, bounces or floats.
2. **Swift.** Feedback lands on the frame you act. Hover is 120ms, overlays open in under 200ms and close faster than they open. Nothing makes you wait to see what happened.
3. **Simple.** Judged by how it feels to use, not by how empty it looks. Fewer kinds of things on a screen, each one plain about what it is.
4. **Delightful.** In the details: a copy icon that turns into a check, a menu that grows from its trigger, a keyboard hint where you'd want one. Never as decoration.

The mood is a **utility console** with the old web's honesty: white, grey, one blue; mono labels; tables and keyboard hints; colour only where it encodes something.

## Colour

White first. Greys recede. One blue means "do this" or "you are here". Status colours are the old web's, plain and saturated, and appear as a dot or a word — never as a filled background wash.

| Token | Tailwind | Light | Dark | Use |
| --- | --- | --- | --- | --- |
| `--ui-surface` | `bg-surface` | `#ffffff` | `#0e0e0f` | The page and content canvas |
| `--ui-panel` | `bg-panel` | `#fafafa` | `#141415` | Sidebars, recessed areas, code |
| `--ui-hover` | `bg-hover` | `#f4f4f5` | `#1c1c1e` | Hover fill |
| `--ui-active` | `bg-active` | `#ececee` | `#242427` | Pressed / selected fill |
| `--ui-raised` | `bg-raised` | `#ffffff` | `#18181a` | Floating layers: popovers, menus, dialogs, toasts |
| `--ui-line` | `border-line` | `#ededef` | `#222225` | Row dividers (whisper) |
| `--ui-line-strong` | `border-line-strong` | `#dcdcdf` | `#323236` | Control outlines, structural edges |
| `--ui-ink` | `text-ink` | `#18181a` | `#ededee` | Primary text. Never `#000` |
| `--ui-ink-2` | `text-ink-2` | `#6b6b72` | `#9a9aa1` | Secondary text |
| `--ui-ink-3` | `text-ink-3` | `#a1a1a8` | `#5e5e65` | Tertiary text, labels, placeholders |
| `--ui-accent` | `bg-accent` `text-accent` | `#2457f5` | `#4d7bff` | The one primary action, current location, links, focus |
| `--ui-accent-hover` | `bg-accent-hover` | `#1b47d6` | `#6a91ff` | Hover on accent fills |
| `--ui-accent-tint` | `bg-accent-tint` | `#eef2ff` | `#131a33` | Text selection, highlighted notes |
| `--ui-ok` | `text-ok` | `#14883e` | `#3fbf6a` | Success, online, done |
| `--ui-warn` | `text-warn` | `#b86e00` | `#e5a23a` | Needs attention |
| `--ui-err` | `text-err` | `#d1281c` | `#ff6a5c` | Errors, destructive actions |
| `--ui-scrim` | `bg-scrim` | 18% ink | 55% black | Behind modal dialogs only |

Rules:

- **Use tokens, not palette colours.** `bg-zinc-100`, `text-gray-500`, `bg-white`, `text-black`, `#hex` in a component are all defects. The only exceptions are `text-white` on a photo and `text-on-accent` on `bg-accent`.
- **One accent per view.** The accent is spent on the single primary action, the current-location marker, links, and focus rings. Never on counts, decoration, section headers, or icons that aren't interactive.
- **Status = dot + word.** A 6px square or round dot in the status colour, followed by an ink word: `● Online`. Don't colour the whole row, the whole badge, or the whole sentence.
- **Dark mode is a first-class theme, not an inversion.** Every token is a `light-dark()` pair. Set `data-theme="dark"` on `<html>`; never hand-write `dark:` colour overrides when a token exists.

## Type

Inter for everything you read, JetBrains Mono for everything that's data or a label. Both load from `styles.css`.

| Role | Classes | Size |
| --- | --- | --- |
| Page title | `text-[26px] leading-8 font-semibold tracking-[-0.02em]` | 26 |
| Section title | `text-[17px] leading-6 font-semibold tracking-[-0.01em]` | 17 |
| Body | `text-sm` | 14 |
| Controls (buttons, inputs, menu items) | `text-ui` | 13 |
| Meta, helper text | `text-xs text-ink-2` | 12 |
| Label (the console voice) | `ui-label` | 11, mono, uppercase, +6% tracking, `ink-3` |
| IDs, hashes, timestamps, code | `font-mono` | inherit |

Rules:

- **Weights: 400, 500, 600.** Body is 400, controls and row titles 500, titles 600. No 700+.
- **Sentence case everywhere** except `ui-label`, which is uppercase by design.
- **Numbers that change get `tabular-nums`** (counters, prices, times, tables).
- `ui-label` is for section labels, table headers, and key/value keys. Not for buttons and not for body text.

## Space and size

A 4px grid. Controls come in three heights, and everything on a row shares one.

| Size | Height | Use |
| --- | --- | --- |
| `sm` | 28px (`h-7`) | Toolbars, dense tables, inline actions |
| `md` | 32px (`h-8`) | Default for every control |
| `lg` | 36px (`h-9`) | Primary call-to-action on a sparse page, touch-first screens |

Rhythm: 4–8px inside a control group, 12–16px between related blocks, 32–48px between sections. A page's content column is at most ~760px for reading, wider only for tables and canvases.

## Corners

| Token | Tailwind | Value | Use |
| --- | --- | --- | --- |
| `--radius-ui` | `rounded-ui` | 4px | Buttons, inputs, menu items, chips |
| `--radius-box` | `rounded-box` | 6px | Popovers, menus, dialogs, panels, code blocks |
| — | `rounded-full` | — | Only status dots, switch tracks, avatars |

No `rounded-lg`/`rounded-xl`/pill buttons. Nested corners stay concentric: inner radius = outer radius − padding. A highlighted item inside a 6px menu with 4px padding is `rounded-[2px]`.

## Elevation

Flat by default. Things on the page are separated by **hairlines and tone**, never by shadows. Only floating layers get a shadow, and there are exactly two:

| Token | Tailwind | Use |
| --- | --- | --- |
| `--ui-shadow-pop` | `shadow-pop` | Popovers, menus, tooltips, select lists, toasts |
| `--ui-shadow-modal` | `shadow-modal` | Dialogs, command palette |

Both already include a 1px `line-strong` ring, so a floating surface needs no border. Never add `shadow-sm/md/lg` to cards; there are no cards — use a `Panel` or a hairline.

Outlines on controls are drawn as **inset box-shadow hairlines** (`shadow-[inset_0_0_0_1px_var(--ui-line-strong)]`), not borders, so a control's content box never shifts by a pixel when variants change.

## Motion

Motion is a UX aid: it shows where something came from, confirms that something happened, or keeps you oriented. If it does none of those, delete it.

| Token | Value | Use |
| --- | --- | --- |
| `ease-snap` | `cubic-bezier(0.23, 1, 0.32, 1)` | Everything that answers the user. Fast start, soft landing |
| `ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Sheets and drawers sliding from an edge |
| default duration | `120ms` | Hover, colour, press |

| Interaction | Duration | What moves |
| --- | --- | --- |
| Hover / colour change | 120ms | colour, background |
| Press | 120ms | `scale(0.97)` via `ui-press`, compact controls only |
| Tooltip | 100ms in, 75ms out | opacity + 2px offset; instant when moving between tooltips |
| Popover / menu / select | 150ms in, 100ms out | opacity + `scale(0.96 → 1)` from `--transform-origin` (the trigger) |
| Dialog | 180ms in, 120ms out | opacity + `scale(0.97 → 1)`; scrim fades |
| Toast | 200ms in, 150ms out | slide 8px + opacity |
| Segmented control indicator | 180ms | slides to the chosen segment; no animation on first render |
| Command palette | none in, 100ms out | opens instantly (⌘K is a high-frequency action) |
| Switch thumb, checkbox mark | 120–150ms | transform / stroke |

Rules:

- **Never longer than 200ms** for anything the user triggered. Exits are faster than entrances.
- **Never `ease-in`** on something that is appearing — it hesitates exactly when the eye is on it. Never `linear` except for spinners.
- **Scale from the trigger**, not from the centre: popovers use `origin-(--transform-origin)`.
- **Don't animate from `scale(0)`.** Start at 0.96–0.97 with opacity; nothing in the real world appears from nothing.
- **No animation on high-frequency keyboard actions** (opening the command palette with ⌘K, moving through a list with arrows). Speed beats choreography there.
- **No bounce, no overshoot, no wobble, no parallax, no long staggers.** A stagger, if ever, is ≤ 30ms per item and ≤ 5 items.
- **Wide things don't scale.** Rows and panels respond with tone (background), not transform; scaling a 600px row by 3% is a distortion.
- **Respect `prefers-reduced-motion`.** `styles.css` zeroes durations globally.

### Signature moments

A few small touches carry the library's personality. Each one shows **what changed**, not that something is clever. There are only these, and new ones need a reason as good as theirs.

| Moment | Where | What happens |
| --- | --- | --- |
| Rolling numbers | `NumberRoll`, `Stat` | When a value changes, only the digits that changed roll vertically to the new digit (≤ 200ms, `ease-snap`). Direction follows the change: up for increase, down for decrease. |
| Change flash | `Table` rows, `ui-flash` | Something that updated in place gets a brief `accent-tint` wash that fades out over 1s. It never blocks, never moves layout, and isn't replayed on first render. |
| Copy confirm | `CopyButton`, `Code` | The copy icon crossfades and scales into a check (150ms), holds for 1.2s, then returns. |
| Scrub | `NumberField` | Drag horizontally on the label to change the value; the cursor becomes `ew-resize`. Direct manipulation, no animation needed. |

The 1s flash is the only duration above 200ms in the library. It's allowed because it fades out *after* the change has already landed, so nothing waits on it.

## Icons

[Phosphor](https://phosphoricons.com) (`@phosphor-icons/react`), `regular` weight, 16px (`size-4`) in controls, 14px (`size-3.5`) in dense rows. `bold` only for a check confirming an action. Icons are `text-ink-2` beside text, `text-ink` alone. An icon-only button always has an `aria-label` and usually a `Tooltip`.

## Copy

- **Sentence case.** "Save changes", not "Save Changes".
- **Buttons are verbs** that say what will happen: "Delete project", not "OK" or "Yes".
- **Plain words.** No exclamation marks, no "Oops!", no emoji in UI chrome.
- **Errors say what happened and what to do**: "Couldn't save — the file is read-only." Not "Something went wrong."
- **Keyboard hints** use symbols: `⌘K`, `⇧⌘P`, `⌥`, `⌃`, `↵`, `Esc`.
- **Empty states** state the fact and offer the next action: "No projects yet." + a button.
