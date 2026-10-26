import { useEffect, useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};

export function usePath(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname.replace(/\/+$/, "") || "/");
}

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  if (!to.includes("#")) window.scrollTo(0, 0);
}

/** Make same-origin <a href="/..."> clicks client-side, except raw .md/.txt files. */
export function useLinkInterception() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href);
      if (url.origin !== window.location.origin) return;
      if (/\.(md|txt)$/.test(url.pathname)) return;
      e.preventDefault();
      navigate(url.pathname + url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
