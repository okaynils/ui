# AGENTS.md — working on this repo

This repo is `@nils/ui`, a personal React + Tailwind v4 UI library, and its docs site. If you want to **use** the library in another project, read `packages/ui/AGENTS.md` instead.

## Layout

```
packages/ui/              the npm package
  AGENTS.md               entry point for agents USING the library (ships in npm)
  DESIGN.md               the visual contract: tokens, type, motion, copy (ships in npm)
  docs/                   markdown docs (ship in npm; the docs site renders them)
    getting-started.md
    components/<name>.md  one page per component
  src/
    styles.css            tokens (@theme), base styles, ui-press / ui-label utilities
    lib/cn.ts             class merging, aware of custom tokens
    lib/surfaces.ts       shared recipes: popupSurface, popupItem, fieldSurface
    components/<name>.tsx one file per component
    index.ts              public exports (+ controls.ts / overlays.ts / layout.ts / data.ts / feedback.ts / shell.ts / gimmicks.ts barrels)
apps/docs/                Vite site that renders packages/ui/**/*.md
```

## Commands

```bash
bun install
bun run dev          # docs site at http://localhost:5199 (uses library source, hot reloads)
bun run typecheck    # both packages
bun run build        # library (tsup → dist) + docs site
```

## Markdown is the source of truth

The docs site has no hand-written component pages. Each `docs/components/<name>.md` is rendered as-is, and every ` ```tsx live ` block in it is compiled and rendered as a live example. So:

- A live block is either bare JSX (every `@nils/ui` export is in scope), or a module with `export default function Example()`. Imports may only come from `react`, `@nils/ui`, `@phosphor-icons/react`.
- The same file is what an agent reads from `node_modules`. Write for that reader: say when to use the component, show copy-pasteable code, state rules as **Do**/**Don't**, document every prop in a table.
- Frontmatter: `title`, `description` (one sentence, shows in llms.txt and the index), `group` (`Controls` | `Data` | `Feedback` | `Overlays` | `Layout` | `Shell` | `Gimmicks` | `Examples`), `order` (number, sort within group).
- Page shape: `# Title` → one-paragraph purpose → import block → `## Examples` (`###` per example) → `## Rules` → `## Props` → `## Accessibility`. Add `## Motion` when the component animates.

## Adding a component

1. `packages/ui/src/components/<name>.tsx`. Build on `@base-ui/react/<part>` when Base UI has the primitive. Its docs are in `node_modules/@base-ui/react/docs/react/components/<part>.md`; trust them over memory.
2. Style only with tokens (see DESIGN.md) and the recipes in `lib/surfaces.ts`. Merge `className` last via `cn()`.
3. Export from the group barrel (`src/controls.ts`, `src/data.ts`, `src/feedback.ts`, `src/overlays.ts`, `src/layout.ts`, `src/shell.ts`, `src/gimmicks.ts`), types included.
4. Write `packages/ui/docs/components/<name>.md`.
5. Add a row to the component table in `packages/ui/AGENTS.md`, between the `components:start/end` markers.
6. `bun run typecheck`, then look at the page in the docs site, in light and dark.

## Code conventions

- React 19: `ref` is a regular prop, so no `forwardRef`. Function components only.
- Compound components are exposed as flat named exports (`Dialog`, `DialogTrigger`, `DialogContent`, …), not namespaces, so agents can import exactly what they use.
- Comments explain *why* a value is what it is (as in styles.css), not what the code does.
- No new runtime dependencies without a reason written in the PR/commit.
