---
title: Sheet
description: A panel that slides in from the side of the window, for details, editing and filters without leaving the page. Swipe to dismiss.
group: Shell
order: 70
---

# Sheet

A panel attached to the right (or left) edge of the window. It's for detail views, editing a record, or a long filter form: work that needs more room than a [Popover](/components/popover) but shouldn't take over the page the way a [Dialog](/components/dialog) does. It slides in on the drawer curve, the scrim fades, and you can swipe it back toward its edge to dismiss. Built on Base UI's Drawer.

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose } from "@nils/ui";
```

## Examples

### Editing a record

Header, a scrolling body, and a footer pinned to the bottom.

```tsx live
<Sheet>
  <SheetTrigger render={<Button />}>Edit node</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit h100-01</SheetTitle>
      <SheetDescription>Changes apply on the next restart.</SheetDescription>
    </SheetHeader>
    <SheetBody className="flex flex-col gap-4">
      <Field label="Name">
        <Input defaultValue="h100-01" />
      </Field>
      <Field label="Region">
        <Select defaultValue="us-west" items={[{ value: "us-west", label: "us-west" }, { value: "eu-north", label: "eu-north" }]} />
      </Field>
      <Field label="Notes" description="Only visible to your team.">
        <Textarea placeholder="What's this node for?" />
      </Field>
    </SheetBody>
    <SheetFooter>
      <SheetClose render={<Button />}>Cancel</SheetClose>
      <SheetClose render={<Button variant="primary" />}>Save</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### From the left, small

`side="left"` for navigation-like content, and `size` for width (sm 320, md 400, lg 520).

```tsx live
<Sheet side="left">
  <SheetTrigger render={<Button variant="ghost" />}>Show filters</SheetTrigger>
  <SheetContent size="sm">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    <SheetBody className="flex flex-col gap-3">
      <Checkbox label="Running" defaultChecked />
      <Checkbox label="Idle" />
      <Checkbox label="Failed" defaultChecked />
    </SheetBody>
  </SheetContent>
</Sheet>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>…</SheetContent>
</Sheet>
```

## Rules

- **Do** always include a `SheetTitle`. It names the sheet for screen readers; hide it with `className="sr-only"` if the design has no visible title.
- **Do** put committing actions in `SheetFooter`, with the primary one last.
- **Do** use a right sheet for details and editing, and a left sheet for navigation or filters.
- **Don't** open a sheet from a sheet. Replace its content, or use a Dialog for the confirmation.
- **Don't** use a sheet for a yes/no question. That's a [ConfirmDialog](/components/confirm-dialog).

## Props

### Sheet

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `"right" \| "left"` | `"right"` | The edge it slides from, and the direction it's swiped to close. |
| `open` | `boolean` | — | Controlled state. |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
| `onOpenChange` | `(open, details) => void` | — | Called on open and close. |
| `modal` | `boolean \| "trap-focus"` | `true` | Whether the rest of the page is inert while open. |

### SheetContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Width 320 / 400 / 520px, never wider than the viewport minus 48px. |
| `showClose` | `boolean` | `true` | The × in the top-right corner. |

### Parts

| Part | Description |
| --- | --- |
| `SheetTrigger` | Opens it. Compose: `render={<Button />}`. |
| `SheetHeader` | Top block on a hairline; leaves room for the ×. |
| `SheetTitle`, `SheetDescription` | The heading (required) and one sentence. |
| `SheetBody` | The scrolling middle. |
| `SheetFooter` | Bottom action row on the panel tone. |
| `SheetClose` | Closes it. Compose: `render={<Button />}`. |

## Accessibility

- Focus moves into the sheet on open, is trapped while it's open, and returns to the trigger on close.
- Esc, a click on the scrim, or a swipe toward the sheet's edge closes it.
- The sheet is labelled by `SheetTitle` and described by `SheetDescription`.

## Motion

In: 200ms on `ease-drawer`, sliding from the edge while the scrim fades in. Out: 150ms. While swiping, the panel follows the finger 1:1 with no transition, and the scrim fades in proportion.
