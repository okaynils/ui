import { Toast as BaseToast } from "@base-ui/react/toast";
import * as React from "react";
import { cn } from "../lib/cn";
import { buttonClassName } from "./button";
import { XGlyph } from "./overlay-utils";

/*
 * One module-level manager, so `toast()` works from anywhere — event
 * handlers, data hooks, plain functions — as long as a <Toaster /> is mounted.
 */
const manager = BaseToast.createToastManager();

export type ToastType = "default" | "success" | "error" | "warning" | "loading";

export interface ToastOptions {
  /** A second line with detail. Keep the title itself short. */
  description?: React.ReactNode;
  /** One follow-up action, e.g. `{ label: "Undo", onClick: restore }`. */
  action?: { label: string; onClick: () => void };
  /** Auto-dismiss after this many ms. `0` keeps it until dismissed. Default 5000. */
  timeout?: number;
  /** Reuse an id to update a toast in place instead of stacking a new one. */
  id?: string;
  /** `high` interrupts screen readers. Default `low`; errors default to `high`. */
  priority?: "low" | "high";
}

function add(type: ToastType, title: React.ReactNode, options: ToastOptions = {}) {
  const { action, ...rest } = options;
  return manager.add({
    title,
    type,
    priority: type === "error" ? "high" : "low",
    ...rest,
    actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
  });
}

type PromiseMessage<T> = React.ReactNode | ((value: T) => React.ReactNode);

/**
 * Show a short notice. Returns the toast's id.
 *
 *   toast("Copied")
 *   toast.success("Deployed", { description: "v0.4.2 is live." })
 *   toast.error("Couldn't save", { description: "The file is read-only." })
 *   toast("Archived", { action: { label: "Undo", onClick: unarchive } })
 *   toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" })
 */
export const toast = Object.assign((title: React.ReactNode, options?: ToastOptions) => add("default", title, options), {
  success: (title: React.ReactNode, options?: ToastOptions) => add("success", title, options),
  error: (title: React.ReactNode, options?: ToastOptions) => add("error", title, options),
  warning: (title: React.ReactNode, options?: ToastOptions) => add("warning", title, options),
  /** Close one toast by id. */
  dismiss: (id: string) => manager.close(id),
  /** One toast that follows a promise: loading → success or error. Returns the promise. */
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: React.ReactNode; success: PromiseMessage<T>; error: PromiseMessage<unknown> },
  ) =>
    manager.promise(promise, {
      loading: { title: messages.loading, type: "loading" },
      success: (value: T) => ({
        title: typeof messages.success === "function" ? messages.success(value) : messages.success,
        type: "success",
      }),
      error: (err: unknown) => ({
        title: typeof messages.error === "function" ? messages.error(err) : messages.error,
        type: "error",
        priority: "high",
      }),
    }),
});

/*
 * Only one Toaster may render the shared manager's toasts. If an app (or a
 * docs page) mounts two, the first one mounted wins and the rest render
 * nothing — so a stray duplicate never shows every toast twice.
 */
const mounted: symbol[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
function useIsActiveToaster() {
  const [id] = React.useState(() => Symbol("toaster"));
  React.useEffect(() => {
    mounted.push(id);
    notify();
    return () => {
      mounted.splice(mounted.indexOf(id), 1);
      notify();
    };
  }, [id]);
  return React.useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => mounted[0] === id,
    () => false,
  );
}

export interface ToasterProps {
  /** Most toasts visible at once; older ones fade out. Default 3. */
  limit?: number;
  /** Default auto-dismiss in ms. Default 5000. */
  timeout?: number;
}

/** Renders toasts, bottom-right. Mount exactly once, near the root of the app. */
export function Toaster({ limit = 3, timeout = 5000 }: ToasterProps) {
  const active = useIsActiveToaster();
  if (!active) return null;
  return (
    <BaseToast.Provider toastManager={manager} limit={limit} timeout={timeout}>
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed right-4 bottom-4 z-100 w-[calc(100vw-2rem)] outline-none sm:right-6 sm:bottom-6 sm:w-[360px]">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

const DOT: Partial<Record<string, string>> = {
  success: "bg-ok",
  error: "bg-err",
  warning: "bg-warn",
};

// Stacking geometry follows Base UI's CSS variables: collapsed toasts peek
// 8px behind the front one; hovering expands the stack.
const rootClass = cn(
  "[--gap:8px] [--peek:8px] [--scale:calc(max(0,1-(var(--toast-index)*0.05)))] [--shrink:calc(1-var(--scale))]",
  "[--height:var(--toast-frontmost-height,var(--toast-height))]",
  "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
  "absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none",
  "h-(--height) data-expanded:h-(--toast-height)",
  "rounded-box bg-raised text-ink shadow-pop",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
  "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
  "[transition:transform_200ms_var(--ease-snap),opacity_200ms_var(--ease-snap),height_150ms_var(--ease-snap)]",
  "data-ending-style:[transition-duration:150ms]",
  // In: rise 8px and fade. Out: the same, quicker; or fly off in the swipe direction.
  "data-starting-style:opacity-0 data-starting-style:[transform:translateY(8px)]",
  "data-ending-style:opacity-0 [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(8px)]",
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-limited:opacity-0",
  // Keeps hover alive across the gaps between expanded toasts.
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
);

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((t) => {
    const dot = t.type ? DOT[t.type] : undefined;
    return (
      <BaseToast.Root key={t.id} toast={t} className={rootClass}>
        <BaseToast.Content className="flex items-start gap-3 overflow-hidden py-3 pr-2 pl-3.5 transition-opacity duration-150 data-behind:opacity-0 data-expanded:opacity-100">
          <div className="min-w-0 flex-1">
            <BaseToast.Title className="flex items-center gap-2 text-ui font-medium text-ink">
              {t.type === "loading" ? <Spinner /> : dot ? <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden /> : null}
              <span className="min-w-0 truncate">{t.title}</span>
            </BaseToast.Title>
            {t.description ? (
              <BaseToast.Description className={cn("mt-0.5 text-xs text-ink-2", (dot || t.type === "loading") && "pl-3.5")} />
            ) : null}
          </div>
          {t.actionProps ? <BaseToast.Action className={cn(buttonClassName({ size: "sm" }), "-my-0.5")} /> : null}
          <BaseToast.Close className={cn(buttonClassName({ variant: "ghost", size: "sm", icon: true }), "-my-0.5 size-6")} aria-label="Dismiss">
            <XGlyph className="size-3.5" />
          </BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0 animate-spin text-ink-2 [animation-duration:600ms]" aria-hidden>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
