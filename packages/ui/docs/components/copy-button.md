---
title: CopyButton
description: Copies a value to the clipboard; the icon crossfades into a green check, holds 1.2s, and returns. The library's signature confirm.
group: Feedback
order: 70
---

# CopyButton

Copies a value to the clipboard. On success the copy icon crossfades and scales into a green check (150ms), holds for 1.2 seconds, then turns back. It's one of the library's [signature moments](/design#signature-moments): it confirms exactly what happened, right where you clicked.

```tsx
import { CopyButton } from "@nils/ui";
```

## Examples

### Icon only

Icon-only by default, as a small ghost button. Name what it copies in `aria-label`.

```tsx live
<div className="flex items-center gap-1 rounded-box bg-panel py-1 pr-1 pl-3 font-mono text-xs text-ink shadow-[inset_0_0_0_1px_var(--ui-line)]">
  sk_live_51NzQ…8f2a
  <CopyButton value="sk_live_51NzQ8f2a" aria-label="Copy API key" />
</div>
```

### With a label

`label` adds text that turns into "Copied". The button keeps its width while it changes.

```tsx live
<CopyButton value="bun add @nils/ui" label="Copy" variant="outline" size="md" />
<CopyButton value="h100-01" label="Copy ID" copiedLabel="Copied ID" variant="outline" size="md" />
```

### Beside an ID in a row

```tsx live
<div className="flex w-full max-w-sm items-center justify-between border-y border-line py-2 text-ui">
  <span className="text-ink-2">Machine ID</span>
  <span className="flex items-center gap-1 font-mono text-ink">
    h100-01-us-west
    <CopyButton value="h100-01-us-west" aria-label="Copy machine ID" />
  </span>
</div>
```

### Value at click time

Pass a function when the value can change.

```tsx live
import { CopyButton, toast } from "@nils/ui";

export default function Example() {
  return (
    <CopyButton
      value={() => new Date().toISOString()}
      label="Copy timestamp"
      variant="outline"
      size="md"
      onCopied={(v) => toast("Copied", { description: v })}
    />
  );
}
```

## Rules

- **Do** put it right next to the value it copies.
- **Do** name the value in `aria-label` for icon-only buttons: "Copy API key", not "Copy".
- **Don't** also show a toast for a copy. The check is the confirmation (`onCopied` exists for logging).
- **Don't** use it for values longer than a line. Use `CodeBlock`, which has its own copy button.

## Props

Extends `Button` props except `icon`, `loading`, `shortcut`, `onClick` and `children`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| () => string` | — | What gets copied. Functions are called at click time. |
| `label` | `string` | — | Adds text; omit for icon-only. |
| `copiedLabel` | `string` | `"Copied"` | Text while confirming, and the screen-reader announcement. |
| `onCopied` | `(value: string) => void` | — | After a successful copy. |
| `variant` | Button variant | `"ghost"` | |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | |

## Motion

Copy → check: opacity and `scale(0.5 → 1)`, 150ms, `ease-snap`, crossfading in place. Holds 1.2s, then reverses. If the clipboard is blocked, nothing changes: no false confirmation.

## Accessibility

- A live region announces `copiedLabel` ("Copied") on success.
- Icon-only buttons default to `aria-label="Copy"`; always override it with what's copied.
