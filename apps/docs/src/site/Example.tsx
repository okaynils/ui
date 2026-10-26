import { Component, useMemo, useState, type ReactNode } from "react";
import { highlight } from "sugar-high";
import { compile } from "../lib/live";
import { CopyButton } from "./CopyButton";

class Boundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    return this.state.error ? <ErrorText error={this.state.error} /> : this.props.children;
  }
}

function ErrorText({ error }: { error: Error }) {
  return <pre className="max-w-full whitespace-pre-wrap font-mono text-xs text-err">{error.message}</pre>;
}

/** A ```tsx live block: the rendered result on a stage, the code under it. */
export function Example({ code, bleed = false }: { code: string; bleed?: boolean }) {
  const result = useMemo(() => {
    try {
      return { Component: compile(code) };
    } catch (error) {
      return { error: error as Error };
    }
  }, [code]);

  return (
    <figure className="not-prose my-5 overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]">
      <div className={bleed ? "bg-surface" : "stage flex min-h-36 flex-wrap items-center justify-center gap-3 px-6 py-10"}>
        {"error" in result && result.error ? (
          <ErrorText error={result.error} />
        ) : (
          <Boundary resetKey={code}>{result.Component ? <result.Component /> : null}</Boundary>
        )}
      </div>
      <CodeBlock code={code} lang="tsx" />
    </figure>
  );
}

const COLLAPSE_AFTER = 40;

export function CodeBlock({ code, lang, standalone = false }: { code: string; lang?: string; standalone?: boolean }) {
  const lines = code.split("\n").length;
  const [expanded, setExpanded] = useState(lines <= COLLAPSE_AFTER);
  const html = useMemo(() => (lang && /^(tsx?|jsx?|js|ts|css)$/.test(lang) ? highlight(code) : escape(code)), [code, lang]);
  return (
    <div
      className={
        standalone
          ? "group relative my-5 rounded-box bg-panel shadow-[0_0_0_1px_var(--ui-line)]"
          : "group relative border-t border-line-strong bg-panel"
      }
    >
      {lang ? <span className="ui-label absolute top-2 right-11 select-none opacity-0 transition-opacity group-hover:opacity-100">{lang}</span> : null}
      <CopyButton text={code} label="Copy code" className="absolute top-1.5 right-1.5" />
      <pre className={"overflow-x-auto px-4 py-3.5 text-[12.5px] leading-[20px]" + (expanded ? "" : " max-h-72 overflow-y-hidden")}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {expanded ? null : (
        <div className="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-linear-to-t from-panel to-transparent pb-3">
          <button
            onClick={() => setExpanded(true)}
            className="ui-press rounded-ui bg-raised px-2.5 py-1 font-mono text-xs text-ink-2 shadow-pop hover:text-ink"
          >
            Show all {lines} lines
          </button>
        </div>
      )}
    </div>
  );
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
