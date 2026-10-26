import { Button, cn } from "@nils/ui";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
import { pages } from "../lib/pages";
import { usePath } from "../lib/router";

export const ACCENTS = [
  { name: "Cobalt", value: "#2457f5", hover: "#1b47d6", dark: "#4d7bff", darkHover: "#6a91ff" },
  { name: "Azure", value: "#0a63e0", hover: "#0852bd", dark: "#3b8cff", darkHover: "#62a3ff" },
  { name: "Ultramarine", value: "#3443e0", hover: "#2735c4", dark: "#6370ff", darkHover: "#8089ff" },
  { name: "Hyperlink", value: "#0000ee", hover: "#0000c4", dark: "#5c6cff", darkHover: "#7d8aff" },
] as const;

function applyAccent(name: string) {
  const a = ACCENTS.find((x) => x.name === name) ?? ACCENTS[0];
  const root = document.documentElement.style;
  root.setProperty("--ui-accent", `light-dark(${a.value}, ${a.dark})`);
  root.setProperty("--ui-accent-hover", `light-dark(${a.hover}, ${a.darkHover})`);
}

function useStored(key: string, initial: string) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const path = usePath();
  const [theme, setTheme] = useStored("theme", document.documentElement.dataset.theme ?? "light");
  const [accent, setAccent] = useStored("accent", "Cobalt");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => applyAccent(accent), [accent]);

  const groups = new Map<string, typeof pages>();
  for (const p of pages) groups.set(p.group, [...(groups.get(p.group) ?? []), p]);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr]">
      <aside className="border-b border-line bg-panel md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0">
        <div className="flex h-12 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 font-mono text-[13px] font-medium text-ink">
            <span className="size-2.5 bg-accent" aria-hidden />
            nils/ui
          </a>
          <span className="font-mono text-[11px] text-ink-3">v0.1.0</span>
        </div>
        <nav className="flex gap-6 overflow-x-auto px-2 pb-3 md:block md:space-y-5 md:pt-2">
          {[...groups].map(([group, items]) => (
            <div key={group} className="shrink-0">
              <div className="ui-label px-2 pb-1">{group}</div>
              <ul>
                {items.map((p) => {
                  const active = p.route === path;
                  return (
                    <li key={p.route}>
                      <a
                        href={p.route}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-7 items-center gap-2 rounded-ui px-2 text-ui transition-colors",
                          active ? "bg-active text-ink" : "text-ink-2 hover:bg-hover hover:text-ink",
                        )}
                      >
                        <span className={cn("size-1 shrink-0 transition-colors", active ? "bg-accent" : "bg-transparent")} aria-hidden />
                        {p.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="hidden px-4 pt-4 pb-5 md:block">
          <div className="ui-label pb-2">Accent</div>
          <div className="flex gap-1.5" role="radiogroup" aria-label="Accent color">
            {ACCENTS.map((a) => (
              <button
                key={a.name}
                role="radio"
                aria-checked={accent === a.name}
                aria-label={a.name}
                title={a.name}
                onClick={() => setAccent(a.name)}
                className={cn(
                  "ui-press size-5 rounded-[3px] outline-offset-2",
                  accent === a.name && "outline-2 outline-ink",
                )}
                style={{ background: theme === "dark" ? a.dark : a.value }}
              />
            ))}
          </div>
          <div className="mt-1.5 font-mono text-[11px] text-ink-3">{accent}</div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex h-12 items-center justify-end gap-1 border-b border-line bg-surface/85 px-4 backdrop-blur">
          <a href="/llms.txt" target="_blank" className="rounded-ui px-2 py-1 font-mono text-xs text-ink-2 transition-colors hover:bg-hover hover:text-ink">
            llms.txt
          </a>
          <Button
            variant="ghost"
            size="sm"
            icon
            aria-label={theme === "dark" ? "Light theme" : "Dark theme"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </header>
        <main className={cn("mx-auto px-5 pt-10 pb-32 md:px-10", wide ? "max-w-[1240px]" : "max-w-[760px]")}>{children}</main>
      </div>
    </div>
  );
}
