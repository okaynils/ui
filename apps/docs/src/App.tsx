import { pageFor, pages } from "./lib/pages";
import { usePath, useLinkInterception } from "./lib/router";
import { DocView } from "./site/DocView";
import { Home } from "./site/Home";
import { Shell } from "./site/Shell";

export function App() {
  useLinkInterception();
  const path = usePath();
  const page = pageFor(path);
  return (
    <Shell>
      {path === "/" ? (
        <Home />
      ) : page ? (
        <DocView key={page.route} page={page} />
      ) : (
        <div className="py-20">
          <div className="ui-label">404</div>
          <p className="mt-2 text-sm text-ink-2">
            No page at <code className="font-mono text-ink">{path}</code>. Try one of the {pages.length} pages on the left.
          </p>
        </div>
      )}
    </Shell>
  );
}
