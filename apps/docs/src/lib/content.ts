/*
 * The docs site's content model. Every page is a markdown file inside
 * packages/ui (the same files that ship in the npm package). This module is
 * shared by the Vite plugin (Node) and the app (browser), so it stays pure.
 */

export interface DocMeta {
  title: string;
  description: string;
  group: string;
  order: number;
}

export interface DocPage extends DocMeta {
  /** Path relative to packages/ui, e.g. "docs/components/button.md". */
  file: string;
  /** Site route, e.g. "/components/button". The raw markdown lives at route + ".md". */
  route: string;
  body: string;
  source: string;
}

export const GROUP_ORDER = ["Start", "Controls", "Overlays", "Layout"];

export function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(source);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: source.slice(match[0].length) };
}

export function routeFor(file: string): string {
  if (file === "AGENTS.md") return "/agents";
  if (file === "DESIGN.md") return "/design";
  return "/" + file.replace(/^docs\//, "").replace(/\.md$/, "");
}

export function toPage(file: string, source: string): DocPage {
  const { data, body } = parseFrontmatter(source);
  const fallbackTitle = file.split("/").pop()!.replace(/\.md$/, "");
  return {
    file,
    route: routeFor(file),
    title: data.title ?? fallbackTitle,
    description: data.description ?? "",
    group: data.group ?? "Start",
    order: Number(data.order ?? 100),
    body,
    source,
  };
}

export function sortPages(pages: DocPage[]): DocPage[] {
  return [...pages].sort((a, b) => {
    const g = rank(a.group) - rank(b.group);
    if (g !== 0) return g;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

function rank(group: string): number {
  const i = GROUP_ORDER.indexOf(group);
  return i === -1 ? GROUP_ORDER.length : i;
}

/** llms.txt — the index an agent reads first. https://llmstxt.org */
export function llmsTxt(pages: DocPage[], origin = ""): string {
  const lines = [
    "# @nils/ui",
    "",
    "> A small, opinionated React + Tailwind v4 UI library: console-flavoured, white and grey with one blue accent, quick and firm motion. Every page below is plain markdown; the same files ship inside the npm package under node_modules/@nils/ui/.",
    "",
    "Start with AGENTS.md (how to install and use the library, and the rules you must follow), then DESIGN.md (tokens, type, motion). Each component page has props, examples you can copy, and do/don't rules.",
    "",
  ];
  let group = "";
  for (const page of sortPages(pages)) {
    if (page.group !== group) {
      if (group) lines.push("");
      group = page.group;
      lines.push(`## ${group}`, "");
    }
    lines.push(`- [${page.title}](${origin}${page.route}.md)${page.description ? `: ${page.description}` : ""}`);
  }
  lines.push("", "## Optional", "", `- [Everything in one file](${origin}/llms-full.txt): every page above, concatenated.`);
  return lines.join("\n") + "\n";
}

export function llmsFullTxt(pages: DocPage[]): string {
  return sortPages(pages)
    .map((p) => `<!-- ${p.file} -->\n${p.source.trim()}\n`)
    .join("\n---\n\n");
}
