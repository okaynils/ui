---
title: Code
description: Inline Code for values in a sentence, and CodeBlock for snippets with a filename header, line numbers and a copy button.
group: Feedback
order: 80
---

# Code

`Code` is for a value inside a sentence: a command, an ID, a flag. `CodeBlock` is for a snippet, on a panel with an optional filename and language header, a copy button, and line numbers if you want them. Neither has a syntax highlighter built in: code is ink on panel grey, which is often all you need.

```tsx
import { Code, CodeBlock } from "@nils/ui";
```

## Examples

### Inline

```tsx live
<p className="max-w-md text-sm text-ink-2">
  Run <Code>bun add @nils/ui</Code>, then import <Code>@nils/ui/styles.css</Code> after Tailwind.
</p>
```

### Block

A copy button sits in the top-right corner.

```tsx live
<CodeBlock className="w-full max-w-md">{`@import "tailwindcss";
@import "@nils/ui/styles.css";`}</CodeBlock>
```

### Filename, language and line numbers

The header holds the filename, the language and the copy button. Line numbers stay put while long lines scroll sideways.

```tsx live
<CodeBlock className="w-full max-w-md" filename="server.ts" lang="ts" lineNumbers>{`import { serve } from "bun";

const port = Number(process.env.PORT ?? 3000);

serve({
  port,
  fetch: () => new Response("ok"), // a long line scrolls sideways instead of wrapping onto the next one
});`}</CodeBlock>
```

### Bringing your own highlighter

Pass highlighted HTML as `html` (from Shiki, sugar-high and so on) together with the raw `code` for the copy button. Only pass HTML you generated yourself.

```tsx
import { codeToHtml } from "shiki";

const raw = `const a = 1;`;
const html = await codeToHtml(raw, { lang: "ts", theme: "github-light", structure: "inline" });

<CodeBlock code={raw} html={html} lang="ts" />
```

Or pass highlighted React nodes as `children`, again with `code`:

```tsx
<CodeBlock code={raw}>{highlightedNodes}</CodeBlock>
```

## Rules

- **Do** use `Code` for anything someone might type or paste: commands, paths, IDs, env names.
- **Do** give a block a `filename` when the reader should put it in a file.
- **Don't** wrap long lines. Blocks scroll sideways so the code stays exact.
- **Don't** use `Code` for emphasis, or for keyboard keys (that's `Kbd`).

## Props

### Code

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ComponentProps<"code">` | — | Passed to `<code>`. |

### CodeBlock

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string \| ReactNode` | — | The code. Trailing newlines are trimmed. |
| `code` | `string` | — | Raw text to copy, when `children` aren't a plain string or you use `html`. |
| `html` | `string` | — | Pre-highlighted HTML. Trusted input only. |
| `filename` | `string` | — | Shown in a header row. |
| `lang` | `string` | — | Language label in the header row. Display only. |
| `lineNumbers` | `boolean` | `false` | Numbered gutter. String `children` only. |
| `copy` | `boolean` | `true` | Show the copy button. |
| `...props` | `ComponentProps<"div">` | — | Passed to the wrapper. |

## Accessibility

- The block is a `<pre><code>`, so screen readers read it verbatim. Line numbers are `aria-hidden` and can't be selected, so copying by hand never picks them up.
- The copy button is labelled "Copy code" and announces "Copied".
