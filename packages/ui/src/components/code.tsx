import * as React from "react";
import { cn } from "../lib/cn";
import { CopyButton } from "./copy-button";

export interface CodeProps extends React.ComponentProps<"code"> {}

/** Inline code, IDs and values inside a sentence: `npm i`, `h100-01`. */
export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      {...props}
      className={cn(
        "rounded-[3px] bg-panel px-1 py-px font-mono text-[0.86em] text-ink [font-variant-ligatures:none]",
        "shadow-[inset_0_0_0_1px_var(--ui-line)]",
        className,
      )}
    />
  );
}

export interface CodeBlockProps extends Omit<React.ComponentProps<"div">, "children"> {
  /**
   * The code, as a string. Trailing newlines are trimmed. To show code you
   * highlighted yourself, pass React nodes here *and* the raw text as `code`
   * (it's what gets copied), or use `html`.
   */
  children?: React.ReactNode;
  /** Raw text for the copy button when `children` aren't a plain string. */
  code?: string;
  /** Pre-highlighted HTML (e.g. from Shiki or sugar-high). Trusted input only. Requires `code`. */
  html?: string;
  /** Shown in a header row, e.g. `"vite.config.ts"`. */
  filename?: string;
  /** Language tag shown in the header row, e.g. `"tsx"`. Display only. */
  lang?: string;
  /** Number each line in a gutter that stays put while the code scrolls. String `children` only. */
  lineNumbers?: boolean;
  /** Show the copy button. */
  copy?: boolean;
}

/**
 * A block of code on a panel, with an optional filename/language header and
 * a copy button. Scrolls horizontally rather than wrapping. No highlighter
 * built in: text is ink; bring your own colours via `html` or `children`.
 */
export function CodeBlock({
  children,
  code,
  html,
  filename,
  lang,
  lineNumbers = false,
  copy = true,
  className,
  ...props
}: CodeBlockProps) {
  const text = (typeof children === "string" ? children : (code ?? "")).replace(/\n+$/, "");
  const header = filename !== undefined || lang !== undefined;
  const numbered = lineNumbers && typeof children === "string";
  const lines = numbered ? text.split("\n") : [];

  const copyButton = copy ? <CopyButton value={text} aria-label="Copy code" className="text-ink-3 hover:text-ink" /> : null;

  return (
    <div
      {...props}
      className={cn("group/code relative rounded-box bg-panel text-ink shadow-[inset_0_0_0_1px_var(--ui-line)]", className)}
    >
      {header ? (
        <div className="flex h-9 items-center gap-3 border-b border-line pr-1.5 pl-4">
          {filename !== undefined ? <span className="truncate font-mono text-xs text-ink-2">{filename}</span> : null}
          {lang !== undefined ? <span className="ui-label ml-auto">{lang}</span> : <span className="ml-auto" />}
          {copyButton}
        </div>
      ) : copyButton ? (
        <div className="absolute top-1.5 right-1.5 z-10">{copyButton}</div>
      ) : null}
      <div className="overflow-x-auto">
        <pre className={cn("py-3.5 text-[12.5px] leading-[20px] [font-variant-ligatures:none]", numbered ? "grid w-max min-w-full grid-cols-[auto_1fr]" : "w-max min-w-full px-4", !header && copy && "pr-12")}>
          {numbered ? (
            <>
              <span aria-hidden className="sticky left-0 bg-panel pr-4 pl-4 text-right text-ink-3 select-none tabular-nums">
                {lines.map((_, i) => i + 1).join("\n")}
              </span>
              <code className="pr-4">{text}</code>
            </>
          ) : html !== undefined ? (
            <code dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <code>{typeof children === "string" ? text : children}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
