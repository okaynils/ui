import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { ShellContext, SidebarNavigateContext } from "./shell-context";
import { Sheet, SheetContent, SheetTitle } from "./sheet";

export interface AppShellProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The navigation column, usually a `<Sidebar>`. Becomes a left sheet when the shell is narrow. */
  sidebar?: React.ReactNode;
  /** A `<TopBar>` over the main column. It scrolls with nothing; content passes under it. */
  topBar?: React.ReactNode;
  /** The page. */
  children?: React.ReactNode;
  /** Sidebar width on wide shells, in px. */
  sidebarWidth?: number;
}

/*
 * The shell answers to its own width, not the viewport's (a container query
 * on the named `shell` container), so it behaves the same full-screen, in a
 * split view, or in a docs frame. Below 36rem (576px) the sidebar folds into
 * a sheet. Class names are spelled out in full so Tailwind can see them.
 */

/**
 * The frame of an app: a sidebar beside a main column with an optional top
 * bar. It fills its parent's height (`h-full`), so give the parent a height,
 * or pass `className="h-dvh"` for a full-window app.
 */
export function AppShell({ sidebar, topBar, sidebarWidth = 220, className, style, children, ...props }: AppShellProps) {
  const [navOpen, setNavOpen] = React.useState(false);
  const context = React.useMemo(() => ({ openNav: () => setNavOpen(true) }), []);
  const closeNav = React.useCallback(() => setNavOpen(false), []);

  return (
    <ShellContext.Provider value={sidebar ? context : null}>
      <div
        {...props}
        style={{ ...style, ["--shell-sidebar" as string]: `${sidebarWidth}px` }}
        className={cn("@container/shell flex h-full min-h-0 w-full overflow-hidden bg-surface text-ink", className)}
      >
        {sidebar ? (
          <aside className={cn("hidden h-full w-(--shell-sidebar) shrink-0 border-r border-line", "@min-[36rem]/shell:block")}>
            {sidebar}
          </aside>
        ) : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {topBar ?? (sidebar ? <MobileBar /> : null)}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      {sidebar ? (
        <Sheet side="left" open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent size="sm" showClose={false} className="w-[min(280px,calc(100vw-3rem))]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNavigateContext.Provider value={closeNav}>{sidebar}</SidebarNavigateContext.Provider>
          </SheetContent>
        </Sheet>
      ) : null}
    </ShellContext.Provider>
  );
}

/** Shown when the shell has a sidebar but no TopBar: just the menu button, only while narrow. */
function MobileBar() {
  return (
    <div className={cn("flex h-12 shrink-0 items-center border-b border-line px-3", "@min-[36rem]/shell:hidden")}>
      <SidebarTrigger />
    </div>
  );
}

export interface SidebarTriggerProps extends Omit<React.ComponentProps<"button">, "children"> {}

/**
 * The ☰ button that opens the sidebar sheet. Only visible while the shell is
 * narrow; renders nothing outside an AppShell with a sidebar. TopBar includes
 * one automatically — use this only in a custom bar.
 */
export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const shell = React.useContext(ShellContext);
  if (!shell) return null;
  return (
    <Button
      {...props}
      variant="ghost"
      size="sm"
      icon
      aria-label="Open navigation"
      onClick={shell.openNav}
      className={cn("-ml-1", "@min-[36rem]/shell:hidden", className)}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
        <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
      </svg>
    </Button>
  );
}

export interface TopBarProps extends Omit<React.ComponentProps<"header">, "children"> {
  /** Left side, after the menu button: usually Breadcrumbs or a page name. */
  start?: React.ReactNode;
  /** Centred, e.g. a search trigger or a SegmentedControl. */
  center?: React.ReactNode;
  /** Right side: a few actions. */
  end?: React.ReactNode;
  /** Appended to `start`. */
  children?: React.ReactNode;
  /** Stick to the top of the scrolling column, on a translucent surface. Default true. */
  sticky?: boolean;
}

/**
 * The 48px bar over the main column, on a hairline. Sticky by default, with
 * the content blurring underneath it. Inside an AppShell it carries the
 * sidebar's menu button while the shell is narrow.
 */
export function TopBar({ start, center, end, sticky = true, className, children, ...props }: TopBarProps) {
  return (
    <header
      {...props}
      className={cn(
        "z-20 flex h-12 shrink-0 items-center gap-3 border-b border-line px-3",
        // A centre slot needs equal side columns to stay truly centred.
        center !== undefined && "grid grid-cols-[1fr_auto_1fr]",
        sticky ? "sticky top-0 bg-surface/85 backdrop-blur-md backdrop-saturate-150" : "bg-surface",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger />
        {start}
        {children}
      </div>
      {center !== undefined ? <div className="flex min-w-0 items-center justify-center">{center}</div> : null}
      <div className="flex shrink-0 items-center justify-end gap-1">{end}</div>
    </header>
  );
}
