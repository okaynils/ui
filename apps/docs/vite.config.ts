import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { llmsFullTxt, llmsTxt, toPage, type DocPage } from "./src/lib/content.ts";

const UI = resolve(import.meta.dirname, "../../packages/ui");

function collect(): DocPage[] {
  const files = ["AGENTS.md", "DESIGN.md"];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".md")) files.push(relative(UI, full));
    }
  };
  walk(join(UI, "docs"));
  return files.map((f) => toPage(f, readFileSync(join(UI, f), "utf8")));
}

/**
 * Serves the markdown to agents: /llms.txt, /llms-full.txt, and every page
 * as raw markdown at its route + ".md" (e.g. /components/button.md).
 */
function agentDocs(): Plugin {
  const raw = (): Map<string, string> => {
    const pages = collect();
    const out = new Map<string, string>();
    out.set("/llms.txt", llmsTxt(pages));
    out.set("/llms-full.txt", llmsFullTxt(pages));
    for (const p of pages) out.set(`${p.route}.md`, p.source);
    return out;
  };
  return {
    name: "agent-docs",
    configureServer(server) {
      server.watcher.add([join(UI, "AGENTS.md"), join(UI, "DESIGN.md"), join(UI, "docs")]);
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0]!;
        const body = raw().get(path);
        if (body === undefined) return next();
        res.setHeader("Content-Type", "text/markdown; charset=utf-8");
        res.end(body);
      });
    },
    generateBundle() {
      for (const [path, source] of raw()) {
        this.emitFile({ type: "asset", fileName: path.slice(1), source });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), agentDocs()],
  resolve: {
    // Develop against the library's source, so edits hot-reload.
    alias: [{ find: /^@nils\/ui$/, replacement: join(UI, "src/index.ts") }],
  },
  server: { port: 5199 },
  // Live examples import all of Phosphor; the docs bundle is big on purpose.
  build: { chunkSizeWarningLimit: 4000 },
});
