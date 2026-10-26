---
title: AppShell
description: The frame of an app — a sidebar beside a main column with a sticky top bar. Folds the sidebar into a sheet when narrow.
group: Shell
order: 10
---

# AppShell

The frame every app starts from: a [Sidebar](/components/sidebar) on the left, a main column on the right, and an optional [TopBar](/components/top-bar) over it. The main column scrolls on its own, and content passes under the translucent top bar.

The shell responds to **its own width**, not the window's. Below 576px the sidebar folds into a left [Sheet](/components/sheet), opened by a ☰ button that the TopBar adds by itself. So the same shell works full-screen, in a split view, or inside a docs frame.

```tsx
import { AppShell, Sidebar, TopBar } from "@nils/ui";
```

## Examples

### A whole app

AppShell fills its parent's height. Give the parent a height, or pass `className="h-dvh"` for a full-window app. Click around in the sidebar.

```tsx live
import {
  AppShell, Breadcrumbs, Button, Kbd, PageHeader, Panel, List, ListItem, Sidebar,
  SidebarFooter, SidebarHeader, SidebarItem, SidebarSection, StatusDot, TopBar,
} from "@nils/ui";
import { CubeIcon, GearSixIcon, HouseIcon, ListChecksIcon, PlusIcon, TrayIcon } from "@phosphor-icons/react";
import { useState } from "react";

const NAV = [
  { id: "inbox", label: "Inbox", icon: <TrayIcon />, count: 4 },
  { id: "today", label: "Today", icon: <HouseIcon /> },
  { id: "tasks", label: "Tasks", icon: <ListChecksIcon />, count: 12 },
];

export default function Example() {
  const [page, setPage] = useState("inbox");
  const current = NAV.find((n) => n.id === page) ?? { label: page };
  return (
    <div className="h-[440px] w-full overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]">
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <span className="flex items-center gap-2 font-mono text-ui font-medium">
                <span className="size-2.5 bg-accent" /> console
              </span>
              <Kbd>⌘K</Kbd>
            </SidebarHeader>
            <SidebarSection>
              {NAV.map((n) => (
                <SidebarItem key={n.id} icon={n.icon} trailing={n.count} active={page === n.id} onClick={() => setPage(n.id)}>
                  {n.label}
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection label="Projects" action={<Button variant="ghost" size="sm" icon aria-label="New project" className="size-6"><PlusIcon /></Button>}>
              <SidebarItem icon={<CubeIcon />} active={page === "turbine"} onClick={() => setPage("turbine")}>turbine</SidebarItem>
              <SidebarItem icon={<CubeIcon />} active={page === "ui"} onClick={() => setPage("ui")}>ui</SidebarItem>
            </SidebarSection>
            <SidebarFooter>
              <SidebarItem icon={<GearSixIcon />} active={page === "settings"} onClick={() => setPage("settings")}>Settings</SidebarItem>
            </SidebarFooter>
          </Sidebar>
        }
        topBar={
          <TopBar
            start={<Breadcrumbs items={[{ label: "Workspace", href: "#" }, { label: current.label }]} />}
            end={<Button size="sm" variant="primary">New</Button>}
          />
        }
      >
        <div className="px-6 py-6">
          <PageHeader title={current.label} description="Everything that needs you, newest first." />
          <Panel flush className="mt-6">
            <List>
              <ListItem leading={<StatusDot tone="warn" />} title="Review deploy plan" meta="turbine" trailing="2m" />
              <ListItem leading={<StatusDot tone="ok" />} title="Invoice paid" meta="billing" trailing="1h" />
              <ListItem leading={<StatusDot />} title="Weekly digest" meta="system" trailing="Mon" />
            </List>
          </Panel>
        </div>
      </AppShell>
    </div>
  );
}
```

### Full window

The usual setup in an app's root.

```tsx
import { AppShell, Sidebar, TopBar } from "@nils/ui";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <AppShell className="h-dvh" sidebar={<Sidebar>{/* … */}</Sidebar>} topBar={<TopBar start="Inbox" />}>
      {children}
    </AppShell>
  );
}
```

### Without a top bar

Leave out `topBar` and the shell shows a slim bar with only the ☰ button, and only while narrow.

```tsx
<AppShell className="h-dvh" sidebar={<Sidebar>{/* … */}</Sidebar>}>
  <Page />
</AppShell>
```

## Rules

- **Do** give the shell a height: `className="h-dvh"` at the root, or a parent with a fixed height.
- **Do** keep page padding inside the page (`px-6 py-6` on a wrapper). The shell adds none.
- **Do** use one shell per app, at the root. Nested shells fight over the sidebar sheet.
- **Don't** put `position: fixed` bars inside the main column. Use `TopBar`, which is sticky inside the shell's scroll area.
- **Don't** hide the sidebar with your own media queries. The shell already folds it based on its own width.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sidebar` | `ReactNode` | — | Usually a `<Sidebar>`. Shown beside the main column when wide, and in a left sheet when narrow. |
| `topBar` | `ReactNode` | — | Usually a `<TopBar>`. Sticky at the top of the main column. |
| `children` | `ReactNode` | — | The page, rendered in a `<main>`. |
| `sidebarWidth` | `number` | `220` | Sidebar width in px when wide. |
| `className` | `string` | — | Height and placement, e.g. `h-dvh`. |

`SidebarTrigger` is the ☰ button on its own, for a custom bar. It renders nothing outside an AppShell, and hides itself while the shell is wide.

## Accessibility

- The page sits in a `<main>`, the sidebar in a `<nav aria-label="Main">`, and the top bar in a `<header>`.
- When narrow, the ☰ button is labelled "Open navigation". The sheet traps focus, closes on Esc, a click on the scrim, or a swipe left, and closes by itself when an item is chosen.

## Motion

When narrow, the sidebar sheet slides in from the left (200ms on `ease-drawer`) and leaves faster (150ms). Wide-to-narrow folding is instant: it's layout, not an event.
