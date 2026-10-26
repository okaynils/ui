---
title: Collapsible
description: One show/hide region with a quiet caret trigger. For "Show advanced options" and similar, not for lists of sections.
group: Feedback
order: 50
---

# Collapsible

A single region that shows and hides, like "Advanced options" or "Show raw response". The trigger is quiet ink-2 text with a caret that turns when open; the region eases open in 180ms. For several stacked sections, use [Accordion](/components/accordion).

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@nils/ui";
```

## Examples

### Advanced options

```tsx live
<Collapsible className="w-72">
  <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
  <CollapsibleContent className="flex flex-col gap-3 pt-2 pl-5">
    <Field label="Disk size" description="In GB. Can only grow later.">
      <Input defaultValue="200" />
    </Field>
    <Switch label="Spot instance" />
  </CollapsibleContent>
</Collapsible>
```

### Raw output

```tsx live
<Collapsible defaultOpen className="w-full max-w-md">
  <CollapsibleTrigger>Response</CollapsibleTrigger>
  <CollapsibleContent>
    <CodeBlock lang="json">{`{
  "id": "h100-01",
  "state": "running",
  "region": "us-west"
}`}</CodeBlock>
  </CollapsibleContent>
</Collapsible>
```

### Your own trigger

Swap the trigger element with `render` and hide the caret if you draw your own.

```tsx live
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@nils/ui";

export default function Example() {
  return (
    <Collapsible className="w-72 items-start">
      <CollapsibleTrigger caret={false} render={<Button size="sm" />}>
        Show 3 more
      </CollapsibleTrigger>
      <CollapsibleContent className="text-sm text-ink-2">
        h100-04 · h100-05 · h100-06
      </CollapsibleContent>
    </Collapsible>
  );
}
```

## Rules

- **Do** label the trigger with what's inside ("Advanced options"), not "More".
- **Don't** put anything required inside a collapsed region.
- **Don't** nest collapsibles.

## Props

### Collapsible

Extends Base UI's [Collapsible.Root](https://base-ui.com/react/components/collapsible).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Open initially. |
| `open` / `onOpenChange` | `boolean` / `(open) => void` | — | Controlled. |
| `disabled` | `boolean` | `false` | |
| `className` | `string` | — | Layout only. |

### CollapsibleTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `caret` | `boolean` | `true` | Show the leading caret. |
| `render` | `ReactElement` | — | Swap the element, e.g. `<Button size="sm" />`. |

### CollapsibleContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | — | Applied to the inner wrapper (padding, layout). |
| `keepMounted` | `boolean` | `false` | Keep content in the DOM while closed. |

## Accessibility

The trigger is a `<button>` with `aria-expanded` and `aria-controls`. Enter and Space toggle it.
