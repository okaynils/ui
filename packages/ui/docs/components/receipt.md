---
title: Receipt
description: A thermal-printer receipt with mono lines, dashed rules and a torn edge; it can feed out of the printer when it's just been issued.
group: Gimmicks
order: 190
---

# Receipt

A receipt from a thermal printer: mono type, dashed rules, a summed total and a torn bottom edge. Use it wherever a list of things and what they cost should feel like a tangible thing: an order confirmation, a pricing breakdown, "what's in Pro", or a playful year-in-review. Lines and amounts come from your app; the widget sums them unless you pass a total.

```tsx
import { Receipt } from "@nils/ui";
import type { ReceiptItem, ReceiptMeta, ReceiptProps } from "@nils/ui";
```

## Examples

### An order confirmation

```tsx live
<Receipt
  title="nils/ui"
  subtitle="Stockholm, Sweden"
  meta={[
    { label: "Order", value: "#00421" },
    { label: "Date", value: "26 Oct 2026" },
  ]}
  items={[
    { label: "Pro seat", quantity: 3, detail: "Billed yearly", amount: 432 },
    { label: "Priority support", value: "Included" },
    { label: "Founder discount", amount: -43.2 },
  ]}
  currency="EUR"
  footer="Thank you. Come again."
/>
```

### Printing a new receipt

`print` feeds the receipt out of the printer when it mounts, a line at a time. Use it for a receipt that was just issued, such as after checkout; leave it off for receipts that are simply part of the page.

```tsx live
import { useState } from "react";
import { Button, Receipt } from "@nils/ui";

export default function Example() {
  const [issued, setIssued] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button size="sm" onClick={() => setIssued((count) => count + 1)}>Print receipt</Button>
      {issued > 0 ? (
        <Receipt
          key={issued}
          print
          title="Coffee bar"
          meta={[{ label: "Ticket", value: String(issued).padStart(4, "0") }]}
          items={[
            { label: "Flat white", amount: 4.5 },
            { label: "Cardamom bun", amount: 3.75 },
          ]}
          currency="EUR"
          footer="Have a good one"
        />
      ) : null}
    </div>
  );
}
```

### A year in review

Amounts don't have to be money. Without `currency`, numbers print plainly, and `total={null}` drops the total line when a sum makes no sense.

```tsx live
<Receipt
  title="2026, itemised"
  items={[
    { label: "Commits", value: "1,284" },
    { label: "Books finished", value: "14" },
    { label: "Kilometres run", value: "612" },
    { label: "Side projects started", value: "9" },
    { label: "Side projects finished", value: "2" },
  ]}
  total={null}
  footer="No refunds"
/>
```

## Rules

- **Do** pass `amount` already multiplied by `quantity`. The widget prints numbers, it doesn't do your billing.
- **Do** pass `total` when tax, rounding or currency conversion means the lines don't simply add up. The supplied total always wins.
- **Do** use `value` for lines without a price ("Included", "Free", "1,284").
- **Do** use `print` only for a receipt that was just issued. On page load it is a stunt.
- **Don't** use a receipt as a legal invoice. It's a summary in a fun shape; issue real invoices separately.
- **Don't** put more than about ten lines on one. Long receipts belong in a `Table`.

## Props

### Receipt

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Printed in capitals at the top. |
| `subtitle` | `ReactNode` | — | A line under the title, e.g. an address. |
| `meta` | `readonly ReceiptMeta[]` | — | Key/value lines under the header: order number, date. |
| `items` | `readonly ReceiptItem[]` | Required | The lines. |
| `total` | `number \| null` | Sum of `amount`s | Total to print. `null` prints no total line. |
| `totalLabel` | `ReactNode` | `"Total"` | Label of the total line. |
| `currency` | `string` | — | ISO 4217 code such as `"EUR"`. Without it, amounts print with two decimals. |
| `locale` | `string` | `"en-GB"` | Number formatting locale. |
| `footer` | `ReactNode` | — | Centred line at the bottom. |
| `print` | `boolean` | `false` | Feed out of the printer on mount. |
| `className` | `string` | — | Layout classes. The receipt is 288px wide, narrower if its container is. |
| `...props` | `ComponentProps<"figure">` | — | Standard attributes, including `ref`. |

### ReceiptItem

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `ReactNode` | What the line is. |
| `detail` | `ReactNode` | A second, quieter line. |
| `quantity` | `number` | Shown as `×3` after the label. |
| `amount` | `number` | Money for the whole line. Negative for discounts. Counted in the total. |
| `value` | `ReactNode` | Text in place of an amount. Not counted. |

`ReceiptMeta` is `{ label: ReactNode; value: ReactNode }`.

## Motion

Printing is the receipt's signature move. With `print`, the paper feeds down out of the top edge in eight steps over 480ms. It moves in jerks rather than a smooth slide, because that's how a thermal printer advances paper. It runs once, on mount. Under `prefers-reduced-motion` the receipt is simply there.

## Accessibility

The receipt is a `figure`. Meta lines are a description list and items are a table, so screen readers can move by row. The torn edge and dashed rules are purely visual. Amounts are formatted with `Intl.NumberFormat`, so currencies read naturally.
