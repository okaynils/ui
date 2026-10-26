import { sortPages, toPage, type DocPage } from "./content";

const docs = import.meta.glob("../../../../packages/ui/docs/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const roots = import.meta.glob("../../../../packages/ui/{AGENTS,DESIGN}.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export const pages: DocPage[] = sortPages(
  Object.entries({ ...roots, ...docs }).map(([path, source]) => toPage(path.replace(/^.*packages\/ui\//, ""), source)),
);

export function pageFor(route: string): DocPage | undefined {
  return pages.find((p) => p.route === route);
}
