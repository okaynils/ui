---
title: Tabs
description: Switch between views of the same thing. An ink underline slides to the active tab; panels swap instantly.
group: Data
order: 60
---

# Tabs

Switch between views of the same thing: Overview / Logs / Settings of one machine. The active tab gets an ink underline that slides over from the previous one, so you see where you moved. Panels swap instantly.

```tsx
import { Tabs, TabsList, Tab, TabsPanel } from "@nils/ui";
```

## Examples

### Basic

```tsx live
import { KeyValue, Tab, Tabs, TabsList, TabsPanel } from "@nils/ui";

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList>
        <Tab value="overview">Overview</Tab>
        <Tab value="logs">Logs</Tab>
        <Tab value="metrics">Metrics</Tab>
        <Tab value="settings" disabled>Settings</Tab>
      </TabsList>
      <TabsPanel value="overview">
        <KeyValue items={[{ label: "Region", value: "us-west-2", mono: true }, { label: "Uptime", value: "4d 3h" }]} />
      </TabsPanel>
      <TabsPanel value="logs">
        <pre className="font-mono text-xs text-ink-2">09:12:04 boot ok{"\n"}09:12:09 cuda 12.6 ready{"\n"}09:13:41 job 4821 started</pre>
      </TabsPanel>
      <TabsPanel value="metrics">
        <p className="text-sm text-ink-2">No metrics yet.</p>
      </TabsPanel>
    </Tabs>
  );
}
```

### With counts and icons

Put a quiet count or an icon inside the tab. Counts are mono `ink-3`.

```tsx live
import { Tab, Tabs, TabsList } from "@nils/ui";
import { BellIcon, ListIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Tabs defaultValue="all" className="w-full max-w-lg">
      <TabsList>
        <Tab value="all"><ListIcon /> All <span className="font-mono text-xs text-ink-3">128</span></Tab>
        <Tab value="alerts"><BellIcon /> Alerts <span className="font-mono text-xs text-ink-3">3</span></Tab>
      </TabsList>
    </Tabs>
  );
}
```

## Rules

- **Do** use Tabs for 2–6 sibling views of one object or page section.
- **Do** keep labels to one or two words.
- **Don't** use Tabs to pick a value or filter a list. That's [SegmentedControl](/components/segmented-control). Tabs change *what you're looking at*; a segmented control changes *a setting*.
- **Don't** use Tabs for top-level app navigation. That belongs in the sidebar.
- **Don't** nest tabs inside tabs.

## Props

| Part | Props |
| --- | --- |
| `Tabs` | `defaultValue`, `value`, `onValueChange(value)`, `orientation`. Base UI [Tabs.Root](https://base-ui.com/react/components/tabs). |
| `TabsList` | `activateOnFocus` (default `false`: arrows move focus, Enter/Space activates), `loopFocus`. Includes the sliding indicator. |
| `Tab` | `value` (required), `disabled`. |
| `TabsPanel` | `value` (required), `keepMounted` to preserve state of hidden panels. |

`className` on every part is for layout only.

## Motion

- The underline slides between tabs in 180ms on `ease-snap` (position and width).
- It doesn't animate on first render: it's simply there.
- Panels have no transition. The content you asked for is there on the next frame.

## Accessibility

Base UI provides `role="tablist"`/`tab`/`tabpanel`, `aria-selected` and `aria-controls`, plus arrow-key navigation between tabs, with Home and End. Disabled tabs are skipped.
