---
title: Steps
description: Progress through a multi-step flow, with numbered squares joined by hairlines that darken as you pass them.
group: Feedback
order: 100
---

# Steps

Shows where someone is in a flow with a fixed number of stages: onboarding, checkout, an import wizard, a deploy pipeline. Each step is a small numbered square. Completed steps show a check, the current step is the accent ("you are here"), and the hairlines between steps darken once you've passed them. A failed step shows `!` in the error colour. Steps can be horizontal across a header or vertical down a sidebar.

```tsx
import { Steps } from "@nils/ui";
import type { StepItem, StepState, StepsProps } from "@nils/ui";
```

## Examples

### A checkout

`current` is the index of the step in progress. Earlier steps are complete, later ones upcoming.

```tsx live
<Steps
  current={1}
  steps={[
    { label: "Cart" },
    { label: "Shipping" },
    { label: "Payment" },
    { label: "Review" },
  ]}
/>
```

### Going back

With `onStepClick`, completed steps become buttons so people can revisit them. Upcoming steps stay static: you can't skip ahead.

```tsx live
import { useState } from "react";
import { Button, Steps } from "@nils/ui";

const STEPS = [
  { label: "Account", description: "Name and email" },
  { label: "Workspace", description: "Pick a URL" },
  { label: "Invite", description: "Optional" },
  { label: "Done" },
];

export default function Example() {
  const [current, setCurrent] = useState(2);
  return (
    <div className="flex w-full flex-col gap-4">
      <Steps steps={STEPS} current={current} onStepClick={(index) => setCurrent(index)} />
      <div className="flex gap-2">
        <Button size="sm" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>Back</Button>
        <Button size="sm" variant="primary" disabled={current >= STEPS.length} onClick={() => setCurrent((step) => step + 1)}>
          {current >= STEPS.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
```

### A pipeline that failed

Vertical steps suit a sidebar or a log. Set `state` on a step to override the derived state, e.g. `"error"` with a description that says what went wrong.

```tsx live
<Steps
  orientation="vertical"
  current={2}
  aria-label="Deploy pipeline"
  steps={[
    { label: "Build", description: "1m 12s" },
    { label: "Test", description: "842 passed" },
    { label: "Migrate", state: "error", description: "Lock timeout on table users. Retry the deploy." },
    { label: "Release" },
  ]}
/>
```

## Rules

- **Do** keep labels to one or two words. The description holds the rest.
- **Do** use Steps only when the number of stages is known up front. For an open-ended history, use `Timeline`.
- **Do** say what failed and what to do in an error step's description.
- **Don't** make upcoming steps clickable, or use Steps as tabs. Steps show order; `Tabs` switch views.
- **Don't** use more than about six steps horizontally. Go vertical, or merge stages.

## Props

### Steps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `readonly StepItem[]` | Required | The steps, in order. |
| `current` | `number` | `0` | Index of the step in progress. Use `steps.length` to show everything complete. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Row across the page or column down it. |
| `onStepClick` | `(index, step) => void` | — | Turns completed steps into buttons. |
| `aria-label` | `string` | `"Progress"` | Name of the list; say what the steps are, e.g. "Checkout". |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"ol">` | — | Standard list attributes, including `ref`. |

### StepItem

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `ReactNode` | Step name. |
| `description` | `ReactNode` | Second line in ink-2, or err for a failed step. |
| `state` | `"complete" \| "current" \| "upcoming" \| "error"` | Overrides the state derived from `current`. |

## Motion

When `current` changes, the markers and connectors change colour on the shared 120ms curve. Nothing slides or scales: the step you're on is a fact, not an event.

## Accessibility

Steps render as an ordered list, and the current step has `aria-current="step"`. Each label is prefixed with its state for screen readers ("Completed: Cart", "Current: Shipping", "Failed: Migrate"), so the state never depends on colour or on the check icon alone. Markers and connectors are hidden from assistive technology. Clickable steps are real buttons with a visible focus ring.
