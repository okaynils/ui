---
title: TopBar
description: The 48px bar over the main column — breadcrumbs on the left, actions on the right, translucent and sticky.
group: Shell
order: 30
---

# TopBar

The 48px bar over an app's main column. It sits on a hairline, sticks to the top, and lets content blur underneath. It has three slots: `start` (usually [Breadcrumbs](/components/breadcrumbs)), an optional `center`, and `end` for a few actions. Inside an [AppShell](/components/app-shell) it also carries the ☰ button while the shell is narrow.

```tsx
import { TopBar } from "@nils/ui";
```

## Examples

### Breadcrumbs and actions

```tsx live
import { Breadcrumbs, Button, TopBar, Tooltip } from "@nils/ui";
import { BellIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]">
      <TopBar
        start={<Breadcrumbs items={[{ label: "Projects", href: "#" }, { label: "turbine", href: "#" }, { label: "Deploys" }]} />}
        end={
          <>
            <Tooltip content="Search" shortcut="⌘K">
              <Button variant="ghost" size="sm" icon aria-label="Search"><MagnifyingGlassIcon /></Button>
            </Tooltip>
            <Tooltip content="Notifications">
              <Button variant="ghost" size="sm" icon aria-label="Notifications"><BellIcon /></Button>
            </Tooltip>
            <Button size="sm" variant="primary" className="ml-1">Deploy</Button>
          </>
        }
      />
      <div className="h-24 bg-panel" />
    </div>
  );
}
```

### A centred control

`center` stays centred whatever the sides hold. It's good for a view switch.

```tsx live
<div className="w-full overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]">
  <TopBar
    start={<span className="text-ui font-medium">Calendar</span>}
    center={<SegmentedControl size="sm" defaultValue="week" items={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} />}
    end={<Button size="sm">Today</Button>}
  />
  <div className="h-24 bg-panel" />
</div>
```

## Rules

- **Do** keep `end` to at most three controls, with the primary action last. Everything else goes in a Menu.
- **Do** use `size="sm"` controls in the bar. Its 48px height fits 28px controls.
- **Don't** put a page title here *and* in a PageHeader. Breadcrumbs in the bar, the title in the page.
- **Don't** stack two bars. Filters and view options belong in a [Toolbar](/components/toolbar) inside the page.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `start` | `ReactNode` | — | Left side, after the ☰ button. |
| `center` | `ReactNode` | — | Centred. When set, the sides become equal columns. |
| `end` | `ReactNode` | — | Right side. |
| `children` | `ReactNode` | — | Appended to `start`. |
| `sticky` | `boolean` | `true` | Sticky, on a translucent, blurred surface. Set `false` for a plain bar. |

All `<header>` props pass through.

## Accessibility

Renders a `<header>`. Icon-only buttons in it need an `aria-label`, and usually a `Tooltip`.
