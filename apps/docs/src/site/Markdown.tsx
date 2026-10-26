import { cn } from "@nils/ui";
import type { ComponentProps, ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock, Example } from "./Example";

function slug(children: ReactNode): string {
  return String(Array.isArray(children) ? children.join("") : children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Heading({ as: Tag, className, children }: { as: "h2" | "h3"; className: string; children?: ReactNode }) {
  const id = slug(children);
  return (
    <Tag id={id} className={cn("group scroll-mt-20", className)}>
      {children}
      <a href={`#${id}`} className="ml-2 text-ink-3 no-underline opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
        #
      </a>
    </Tag>
  );
}

const components: Components = {
  h1: ({ children }) => <h1 className="mb-3 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-ink">{children}</h1>,
  h2: ({ children }) => (
    <Heading as="h2" className="mt-12 mb-3 border-t border-line pt-6 text-[17px] leading-6 font-semibold tracking-[-0.01em] text-ink">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" className="mt-8 mb-2 text-sm font-semibold text-ink">
      {children}
    </Heading>
  ),
  p: ({ children }) => <p className="my-3 text-sm leading-[1.65] text-ink-2 [&_strong]:text-ink">{children}</p>,
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="text-accent underline decoration-accent/30 underline-offset-[3px] transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="my-3 list-none space-y-1.5 pl-0 text-sm leading-[1.6] text-ink-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5 text-sm leading-[1.6] text-ink-2 marker:font-mono marker:text-xs marker:text-ink-3">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-4 [ol>&]:pl-1 [&_strong]:text-ink">
      <span className="absolute top-[0.62em] left-0 size-1 bg-ink-3 [ol>li>&]:hidden" aria-hidden />
      {children}
    </li>
  ),
  blockquote: ({ children }) => <blockquote className="my-4 border-l-2 border-accent bg-accent-tint/60 py-0.5 pl-4 [&_p]:text-ink">{children}</blockquote>,
  hr: () => <hr className="my-8 border-line" />,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-box shadow-[0_0_0_1px_var(--ui-line)]">
      <table className="w-full border-collapse text-left text-[13px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-panel">{children}</thead>,
  th: ({ children }) => <th className="ui-label border-b border-line px-3 py-2 font-normal">{children}</th>,
  td: ({ children }) => <td className="border-b border-line px-3 py-2 align-top text-ink-2 [tr:last-child>&]:border-b-0 [&_code]:text-ink">{children}</td>,
  pre: ({ node }) => {
    const code = node?.children[0];
    if (!code || code.type !== "element") return null;
    const classes = (code.properties.className as string[] | undefined) ?? [];
    const lang = classes.find((c) => c.startsWith("language-"))?.slice("language-".length);
    const meta = (code.data as { meta?: string } | undefined)?.meta ?? "";
    const text = code.children.map((c) => ("value" in c ? c.value : "")).join("").replace(/\n$/, "");
    if (/\blive\b/.test(meta)) return <Example code={text} />;
    return <CodeBlock code={text} lang={lang} standalone />;
  },
  code: ({ children }) => (
    <code className="rounded-[3px] bg-panel px-1 py-px font-mono text-[0.86em] text-ink shadow-[inset_0_0_0_1px_var(--ui-line)]">{children}</code>
  ),
};

export function Markdown({ children, className }: { children: string } & Pick<ComponentProps<"div">, "className">) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
