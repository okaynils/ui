import { Button } from "@nils/ui";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { pages } from "../lib/pages";
import { CopyButton } from "./CopyButton";

const AGENT_PROMPT = `Use the @nils/ui library for this project's interface. Install it, then read node_modules/@nils/ui/AGENTS.md before writing any UI, and follow its rules.`;

export function Home() {
  const components = pages.filter((p) => p.group !== "Start");
  return (
    <div>
      <div className="ui-label">nils/ui · v0.1.0</div>
      <h1 className="mt-3 max-w-[560px] text-[30px] leading-[36px] font-semibold tracking-[-0.025em] text-ink">
        A small UI kit for my own software. White, grey, one blue.
      </h1>
      <p className="mt-4 max-w-[540px] text-sm leading-[1.65] text-ink-2">
        Quick to answer, firm under the finger, and plain about what things are. Motion only ever explains what just
        happened. Built on React, Tailwind v4 and Base UI, and written to be read by agents first: every page here is a
        markdown file that ships inside the package.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button variant="primary" render={<a href="/getting-started" />} nativeButton={false}>
          Get started <ArrowRightIcon />
        </Button>
        <Button render={<a href="/agents" />} nativeButton={false}>
          AGENTS.md
        </Button>
        <span className="ml-2 hidden items-center gap-1.5 text-xs text-ink-3 sm:inline-flex">
          or <code className="rounded-[3px] bg-panel px-1.5 py-0.5 font-mono text-ink-2 shadow-[inset_0_0_0_1px_var(--ui-line)]">bun add @nils/ui</code>
        </span>
      </div>

      <section className="mt-14">
        <div className="ui-label">For agents</div>
        <div className="mt-2 rounded-box bg-panel p-4 shadow-[0_0_0_1px_var(--ui-line)]">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-[12.5px] leading-[20px] text-ink">{AGENT_PROMPT}</p>
            <CopyButton text={AGENT_PROMPT} label="Copy prompt" className="-mt-1 -mr-1" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 font-mono text-xs">
            <a className="text-accent hover:underline" href="/llms.txt" target="_blank">/llms.txt</a>
            <a className="text-accent hover:underline" href="/llms-full.txt" target="_blank">/llms-full.txt</a>
            <a className="text-accent hover:underline" href="/agents.md" target="_blank">/agents.md</a>
            <a className="text-accent hover:underline" href="/design.md" target="_blank">/design.md</a>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <div className="ui-label">Components</div>
          <div className="font-mono text-[11px] text-ink-3 tabular-nums">{components.length} total</div>
        </div>
        <div className="mt-2 overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line)]">
          <table className="w-full border-collapse text-left text-[13px]">
            <tbody>
              {components.map((p) => (
                <tr key={p.route} className="group border-b border-line last:border-b-0">
                  <td className="w-40 py-0 pl-3 align-top">
                    <a href={p.route} className="block py-2 font-medium text-ink group-hover:text-accent">
                      {p.title}
                    </a>
                  </td>
                  <td className="py-2 pr-3 text-ink-2">{p.description}</td>
                  <td className="ui-label hidden w-24 py-2 pr-3 text-right align-top sm:table-cell">{p.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
