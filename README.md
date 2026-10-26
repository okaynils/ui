# nils/ui

A small UI kit for my own software. White, grey, one blue. Quick to answer, firm under the finger.

React 19 · Tailwind CSS v4 · Base UI · Inter + JetBrains Mono.

It's written to be read by agents: every rule, token and component is documented in markdown that ships inside the package (`AGENTS.md`, `DESIGN.md`, `docs/`), and the docs site serves the same files at `/llms.txt`.

```bash
bun install
bun run dev    # docs at http://localhost:5199
```

See [`AGENTS.md`](./AGENTS.md) for how the repo works, [`packages/ui/AGENTS.md`](./packages/ui/AGENTS.md) for how to use the library.
