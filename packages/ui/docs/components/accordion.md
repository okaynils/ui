---
title: Accordion
description: Stacked, hairline-separated sections that open in place. A caret turns, the height eases open in 180ms.
group: Feedback
order: 40
---

# Accordion

Sections stacked on hairlines, each opening in place. Good for FAQs, grouped settings, and long detail that most people skip. A disclosure caret turns 90° (150ms) and the panel's height and opacity ease open (180ms in, 120ms out), so you see exactly where the new content came from.

For a single show/hide region, use [Collapsible](/components/collapsible).

```tsx
import { Accordion, AccordionItem } from "@nils/ui";
```

## Examples

### Basic

One section open at a time.

```tsx live
<Accordion className="max-w-md">
  <AccordionItem title="How is usage billed?">
    By the second, from the moment a machine boots until it's stopped. Stopped machines cost nothing.
  </AccordionItem>
  <AccordionItem title="Can I reserve capacity?">
    Yes. Reservations lock a price for 1–12 months and are billed up front.
  </AccordionItem>
  <AccordionItem title="Which regions are available?">
    us-west, us-east and eu-north.
  </AccordionItem>
</Accordion>
```

### Multiple, with meta and a default

`multiple` lets several stay open. `meta` sits at the right of the row. `defaultValue` opens items by their `value`.

```tsx live
<Accordion multiple defaultValue={["env"]} className="max-w-md">
  <AccordionItem value="env" title="Environment variables" meta={<Badge mono>4</Badge>}>
    <div className="font-mono text-xs leading-6 text-ink">
      DATABASE_URL<br />REDIS_URL<br />API_KEY<br />NODE_ENV
    </div>
  </AccordionItem>
  <AccordionItem value="domains" title="Domains" meta={<Badge mono>1</Badge>}>
    nils.dev
  </AccordionItem>
  <AccordionItem value="danger" title="Danger zone">
    <Button variant="danger" size="sm">Delete project</Button>
  </AccordionItem>
</Accordion>
```

## Rules

- **Do** write titles that tell people whether they need to open it.
- **Do** keep it to one level. No accordions inside accordions.
- **Don't** hide the one thing everybody needs inside a closed section.
- **Don't** wrap the accordion in a bordered box. It already has hairlines top and bottom; put it in a `Panel` if it needs grouping.

## Props

### Accordion

Extends Base UI's [Accordion.Root](https://base-ui.com/react/components/accordion).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | Allow several items open at once. |
| `defaultValue` | `any[]` | — | Values of items open initially. |
| `value` / `onValueChange` | `any[]` / `(value) => void` | — | Controlled open items. |
| `disabled` | `boolean` | `false` | Disable every item. |
| `className` | `string` | — | Layout only. |

### AccordionItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | The row text. |
| `meta` | `ReactNode` | — | Right-aligned detail, e.g. a `Badge`. |
| `value` | `any` | auto | Identifies the item for `defaultValue` / `value`. |
| `disabled` | `boolean` | `false` | |
| `children` | `ReactNode` | — | The content, indented to the title. |

## Motion

Caret: `rotate(90deg)` in 150ms. Panel: height and opacity, 180ms in and 120ms out, `ease-snap`. `prefers-reduced-motion` makes both instant.

## Accessibility

- Each row is a `<button>` inside an `<h3>`, with `aria-expanded` and `aria-controls`.
- Enter or Space toggles; Tab moves between rows.
