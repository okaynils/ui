---
title: Banner
description: A full-width, one-line announcement bar for the top of a page or app, with a status dot, an optional action and dismiss.
group: Feedback
order: 110
---

# Banner

A full-width, one-line announcement across the top of a page or app: scheduled maintenance, a plan limit, a deprecation, an incident. The bar is panel grey with a hairline underneath. Its tone shows only as a status dot beside a short label, so it informs without shouting louder than the page. It can carry one action and a dismiss button.

```tsx
import { Banner } from "@nils/ui";
import type { BannerProps, BannerTone } from "@nils/ui";
```

## Examples

### Tones

```tsx live
<div className="flex w-full flex-col overflow-hidden rounded-box border border-line">
  <Banner label="Free plan">You've used 8 of 10 projects.</Banner>
  <Banner tone="accent" label="New">Workspaces can now share API keys.</Banner>
  <Banner tone="warn" label="Maintenance">Scheduled for Sunday 02:00–03:00 UTC. Deploys will queue.</Banner>
  <Banner tone="err" label="Incident">Builds in eu-north-1 are failing. We're on it.</Banner>
</div>
```

### With an action and dismiss

Put one action at the end. `onDismiss` adds a dismiss button: the bar collapses itself, then calls you, so you can remember the dismissal (in storage or on the server).

```tsx live
import { useState } from "react";
import { Banner, Button } from "@nils/ui";

export default function Example() {
  const [shown, setShown] = useState(true);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="w-full overflow-hidden rounded-box border border-line">
        {shown ? (
          <Banner
            tone="warn"
            label="Maintenance"
            action={<Button size="sm" variant="ghost" render={<a href="#status" />} nativeButton={false}>Status page</Button>}
            onDismiss={() => setShown(false)}
          >
            Sunday 02:00–03:00 UTC. Deploys will queue.
          </Banner>
        ) : null}
        <div className="p-4 text-ui text-ink-2">Page content</div>
      </div>
      {!shown ? <Button size="sm" onClick={() => setShown(true)}>Show again</Button> : null}
    </div>
  );
}
```

### Above an app shell

Stack the banner above the shell in a column, so it pushes the whole app down instead of covering the top bar.

```tsx live
import { AppShell, Banner, Sidebar, SidebarItem, SidebarSection, TopBar } from "@nils/ui";

export default function Example() {
  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-box border border-line">
      <Banner tone="accent" label="Trial">12 days left on Pro.</Banner>
      <AppShell
        className="min-h-0 flex-1"
        sidebar={
          <Sidebar>
            <SidebarSection label="Workspace">
              <SidebarItem active>Overview</SidebarItem>
              <SidebarItem>Deploys</SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
        topBar={<TopBar start={<span className="text-ui font-medium text-ink">Overview</span>} />}
      >
        <div className="p-4 text-ui text-ink-2">Page content</div>
      </AppShell>
    </div>
  );
}
```

## Rules

- **Do** use a Banner for something that applies to the whole page or app and stays true for a while: maintenance, plan limits, an ongoing incident, a deprecation.
- **Do** keep it to one line: a label of one or two words, then a sentence. Link to details with the action.
- **Do** use `err` only while something is actually broken; it's announced immediately.
- **Do** persist dismissal in your app via `onDismiss`, or the banner comes back on every load.
- **Don't** show more than one banner at a time. If two things are true, the more urgent one wins.
- **Don't** use a Banner for something about one section of the page. That's a **Callout**, which sits next to what it describes.
- **Don't** use a Banner to confirm an action ("Saved"). That's a **Toast**, which arrives because of what you did and leaves on its own.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"neutral" \| "accent" \| "warn" \| "err"` | `"neutral"` | Colour of the dot. The bar stays panel grey. |
| `label` | `ReactNode` | — | A word or two in ink after the dot, e.g. "Maintenance". |
| `children` | `ReactNode` | — | The message, in secondary ink. |
| `action` | `ReactNode` | — | One action at the end: a ghost `Button size="sm"` or a link. |
| `onDismiss` | `() => void` | — | Shows a dismiss button. Called after the bar has collapsed. |
| `dismissLabel` | `string` | `"Dismiss"` | Accessible name of the dismiss button. |
| `className` | `string` | — | Layout classes on the outer element. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

Exports `BannerProps` and `BannerTone`.

## Motion

The banner appears without animation, because it's part of the page, not an event. Dismissing collapses its height and fades it out together over 150ms on `ease-snap`, so the content below slides up into place instead of jumping. `onDismiss` fires when the collapse finishes. Under `prefers-reduced-motion` it disappears at once.

## Accessibility

An `err` banner has `role="alert"` and is announced as soon as it appears; every other tone has `role="status"` and is read politely. The dot is decorative; the label and message carry the meaning, so the tone never relies on colour alone. The dismiss button is named "Dismiss" (change it with `dismissLabel`, e.g. "Dismiss maintenance notice"). After dismissal the bar is hidden from assistive technology while it collapses.
