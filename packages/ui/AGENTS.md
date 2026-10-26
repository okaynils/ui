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

Toasts need one `<Toaster />` near the root of the app. Everything else works standalone.

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
| Button | `Button`, `buttonClassName` | Every pressable action. One `primary` per view. |
| Kbd | `Kbd` | Keyboard shortcut hints. |
<!-- components:end -->

## Rules

These are what separates UI that belongs to this library from UI that merely imports it.

### Use what exists

1. **Use a library component whenever one fits.** Don't hand-roll a button, input, checkbox, menu, dialog, or tooltip with raw elements and Tailwind. If you need a link that looks like a button, use `buttonClassName()` or `<Button render={<a href="…" />} nativeButton={false}>`.
2. **Don't restyle components.** `className` is for layout (margin, width, grid placement), not for changing colour, radius, height, or font. If a variant you need doesn't exist, use the closest one and say so in your summary — don't invent one inline.
3. **Compose with `render`.** Components built on Base UI accept a `render` prop to swap the element or merge with another component (e.g. a `Tooltip` trigger that is also a `Button`). Read the component's page for the exact pattern.

### Use tokens

4. **Only token colours.** `bg-surface`, `bg-panel`, `bg-hover`, `bg-active`, `border-line`, `border-line-strong`, `text-ink`, `text-ink-2`, `text-ink-3`, `bg-accent`, `text-ok`, `text-warn`, `text-err`. Never `gray-*`, `zinc-*`, `slate-*`, `white`, `black`, or hex values in components.
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
- [ ] Nothing animates longer than 200ms; no custom easing except `ease-snap` / `ease-drawer`.
- [ ] Both `data-theme="light"` and `"dark"` look right (you used tokens, so they should).

## Contributing to the library itself

If you are changing `@nils/ui` rather than using it, read the repository's root `AGENTS.md`.
