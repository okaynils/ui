import type { DocPage } from "../lib/content";
import { CopyButton } from "./CopyButton";
import { Markdown } from "./Markdown";

export function DocView({ page }: { page: DocPage }) {
  return (
    <article>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="ui-label">
          {page.group} <span className="px-1 text-line-strong">/</span> {page.file}
        </div>
        <div className="flex items-center gap-1">
          <a
            href={`${page.route}.md`}
            target="_blank"
            className="rounded-ui px-2 py-1 font-mono text-xs text-ink-2 transition-colors hover:bg-hover hover:text-ink"
          >
            View .md
          </a>
          <CopyButton text={page.source} label="Copy page as markdown" />
        </div>
      </div>
      <Markdown>{page.body}</Markdown>
    </article>
  );
}
