---
title: Getting started
description: Install the package, import the stylesheet, set the theme, and render a first component.
group: Start
order: 2
---

# Getting started

`@nils/ui` needs **React 19+** and **Tailwind CSS v4**. Fonts, tokens and component styles come with the package. You don't configure Tailwind beyond one import.

## 1. Install

`@nils/ui` isn't published to npm, so `bun add @nils/ui` won't find it. You use it from a local clone of the repository, linked into your app.

**Clone and build the library once:**

```bash
git clone https://github.com/okaynils/ui.git
cd ui
bun install
bun run --cwd packages/ui build   # builds packages/ui/dist, which isn't committed
cd packages/ui && bun link        # registers @nils/ui on this machine
```

**Link it into your app:**

```bash
cd ~/path/to/your-app
bun link @nils/ui --save          # adds "@nils/ui": "link:@nils/ui" to package.json
```

Your app needs its own `react` and `react-dom` (19+) and Tailwind CSS v4 (e.g. `tailwindcss` with `@tailwindcss/vite`).

**Use one copy of React.** The link is a symlink into the clone, and the clone has its own React for development. Tell your bundler to resolve React from your app, or you'll get "Invalid hook call" errors. In Vite:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom"] },
});
```

**Updating:** pull and rebuild in the clone; the link picks up the new build.

```bash
cd ui && git pull && bun install && bun run --cwd packages/ui build
```

While you change the library itself, `bun run --cwd packages/ui dev` rebuilds on save.

## 2. Import the styles

In the CSS entry that already has `@import "tailwindcss"`:

```css
@import "tailwindcss";
@import "@nils/ui/styles.css";
```

Order matters: the library's import comes **after** Tailwind's, so its tokens extend the theme.

This gives you:

- **Fonts:** Inter Variable (`font-sans`) and JetBrains Mono Variable (`font-mono`), self-hosted.
- **Tokens as utilities:** `bg-surface`, `bg-panel`, `text-ink-2`, `border-line`, `bg-accent`, `text-err`, `rounded-ui`, `rounded-box`, `shadow-pop`, `text-ui`, `ease-snap`, …. See [Design](/design).
- **Two helper utilities:** `ui-label` (the mono uppercase label) and `ui-press` (press-to-scale feedback for your own pressables).
- **Base styles:** body text, focus rings, selection colour, reduced-motion handling.

## 3. Pick a theme

The library is light unless told otherwise. Put the theme on `<html>` before first paint so nothing flashes:

```html
<script>
  document.documentElement.dataset.theme =
    localStorage.getItem("theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
</script>
```

Every token is a `light-dark()` pair, so switching `data-theme` is all a theme change takes. The `dark:` variant also follows `data-theme`.

## 4. Use a component

```tsx
import { Button, Kbd } from "@nils/ui";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button>Cancel</Button>
      <Button variant="primary" shortcut="⌘S">Save</Button>
    </div>
  );
}
```

```tsx live
<div className="flex items-center gap-2">
  <Button>Cancel</Button>
  <Button variant="primary" shortcut="⌘S">Save</Button>
</div>
```

## 5. Overlays and toasts

Popovers, menus, dialogs and tooltips portal to `document.body` and need no provider. Toasts need one `<Toaster />` mounted near the root. See [Toast](/components/toast).

## Icons

The library doesn't bundle an icon set. Its docs and examples use [Phosphor](https://phosphoricons.com):

```bash
bun add @phosphor-icons/react
```

Components size any `<svg>` child to 16px automatically.

## Merging classes

`cn()` is exported. It joins class names and resolves Tailwind conflicts, and it knows about the library's own tokens (so `text-ui` and `text-ink` don't cancel each other):

```tsx
import { cn } from "@nils/ui";

<div className={cn("rounded-box bg-panel p-4", selected && "bg-active")} />
```
