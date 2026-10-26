# nils/ui

A small UI kit for my own software. White, grey, one blue. Quick to answer, firm under the finger.

React 19 · Tailwind CSS v4 · Base UI · Inter + JetBrains Mono.

It's written to be read by agents: every rule, token and component is documented in markdown that ships inside the package (`AGENTS.md`, `DESIGN.md`, `docs/`), and the docs site serves the same files at `/llms.txt`.

```bash
bun install
bun run dev    # docs at http://localhost:5199
```

See [`AGENTS.md`](./AGENTS.md) for how the repo works, [`packages/ui/AGENTS.md`](./packages/ui/AGENTS.md) for how to use the library.

The [console showcase](./packages/ui/docs/examples/console.md) composes the library into a working screen with local demo data. Run the docs and open `/examples/console` to try it.

## Docs hosting

`.github/workflows/pages.yml` checks types, builds the package and site, and deploys `apps/docs/dist` to GitHub Pages on pushes to `main`. In the repository's Pages settings, choose **GitHub Actions** as the source and `ui.nils.me` as the custom domain. The build includes a `CNAME`, static entry points for deep links, raw markdown, and both agent indexes.

For Namecheap's Advanced DNS, use this record on `nils.me`:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `ui` | `okaynils.github.io` | Automatic |

Once GitHub's certificate is ready, enable **Enforce HTTPS** in Pages settings. GitHub Pages must be enabled on the repository before the deployment job can succeed.
