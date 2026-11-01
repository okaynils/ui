---
title: Panel
description: A grouped region with a hairline edge and an optional header and footer row. Use it instead of cards.
group: Layout
order: 10
---

# Panel

A grouped region: one hairline ring, 8px corners, no shadow. It optionally has a header row (a title, a one-line description, and actions) and a footer row on the opposite tone. This is the library's answer to "cards". Use it to group related settings or a list, not to decorate every block of content.

```tsx
import { Panel } from "@nils/ui";
```

## Examples

### With a title and actions

```tsx live
<Panel title="Billing" actions={<Button size="sm" variant="ghost">Edit</Button>} className="w-full max-w-sm">
  <p className="text-sm text-ink-2">
    Pay as you go. Next invoice on <span className="font-mono text-ink">2026-11-01</span>.
  </p>
</Panel>
```

### Title, description and a footer action

The dashboard shape: a title with its scope underneath, an `sm` action on the right, and a footer band that carries a hint and the follow-up action.

```tsx live
<Panel
  title="Usage history"
  description="Hourly · Nov 1 (UTC)"
  actions={<Button size="sm">Export as CSV</Button>}
  footer={
    <>
      <span>Preemptible compute doesn’t count toward this limit.</span>
      <Button size="sm">Request increase</Button>
    </>
  }
  className="w-full max-w-lg"
>
  <StatGroup flush className="-m-3">
    <Stat label="Delivered compute" value={1284} unit="node-hrs" />
    <Stat label="Estimated price" value="$2.75" unit="/gpu/hr" />
  </StatGroup>
</Panel>
```

### Settings with a footer

The footer sits on the recessed tone. Put a short hint on the left and the committing action on the right.

```tsx live
<Panel
  title="Profile"
  className="w-full max-w-sm"
  footer={
    <>
      <span>Visible to your team.</span>
      <Button size="sm" variant="primary">Save</Button>
    </>
  }
>
  <dl className="grid grid-cols-[96px_1fr] gap-y-2 text-ui">
    <dt className="text-ink-2">Name</dt>
    <dd className="text-ink">Nils</dd>
    <dt className="text-ink-2">Handle</dt>
    <dd className="font-mono text-ink">@nils</dd>
  </dl>
</Panel>
```

### Flush, with a list

`flush` removes the body padding, so a `List` runs edge to edge and its hairlines meet the panel's ring.

```tsx live
<Panel title="Nodes" actions={<span className="text-ui text-ink-2 tabular-nums">3 / 12</span>} flush className="w-full max-w-md">
  <List>
    <ListItem leading={<StatusDot tone="ok" />} title="h100-01" meta="us-west" trailing="$2.10/h" />
    <ListItem leading={<StatusDot />} title="h100-02" meta="us-west" trailing="idle" />
    <ListItem leading={<StatusDot tone="warn" />} title="h100-03" meta="eu-north" trailing="draining" />
  </List>
</Panel>
```

### Recessed tone

`tone="panel"` puts the panel on grey. Use it for secondary groups that sit beside primary content.

```tsx live
<Panel tone="panel" title="Tip" className="w-full max-w-sm">
  <p className="text-ui text-ink-2">Press <Kbd>⌘K</Kbd> anywhere to jump to a command.</p>
</Panel>
```

## Rules

- **Do** use a Panel to group things that belong together: a settings section, a list, a summary.
- **Do** keep the title short and noun-like ("Billing", "Nodes"), in sentence case. Put scope or period ("All pools · Nov 1") in `description`, not in the title.
- **Do** use `size="sm"` buttons in the header and footer, so the rows stay compact.
- **Don't** nest panels. Inside a panel, separate content with `Separator` or a `List`.
- **Don't** add shadows, thicker borders or rounded-xl to make a panel "pop". Flat is the point.
- **Don't** wrap every block of a page in a panel. Plain sections with headings and hairlines are usually enough.

## Props

Extends every `<section>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Header title, 13px medium ink. |
| `description` | `ReactNode` | — | One quiet line under the title: scope, period, units. |
| `actions` | `ReactNode` | — | Right side of the header. Small (`size="sm"`) buttons, a count. |
| `footer` | `ReactNode` | — | Bottom row on the opposite tone. Space-between layout. |
| `tone` | `"surface" \| "panel"` | `"surface"` | White or recessed grey. |
| `flush` | `boolean` | `false` | No body padding, for lists and tables. |

## Accessibility

Renders a `<section>`. The title is an `<h3>`. If the panel has no title, give the section an `aria-label` when it's a meaningful landmark.
