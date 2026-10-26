import * as React from "react";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./button";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children" | "icon" | "loading" | "shortcut" | "value"> {
  /** What gets copied. A function is called at click time (for values that change). */
  value: string | (() => string);
  /**
   * Show a text label next to the icon, e.g. `"Copy"`. It turns into
   * `copiedLabel` while confirming. Omit for an icon-only button.
   */
  label?: string;
  /** Text shown while confirming, when `label` is set. */
  copiedLabel?: string;
  /** Called after a successful copy. */
  onCopied?: (value: string) => void;
}

/** How long the check holds before turning back into the copy icon. */
const HOLD_MS = 1200;

/**
 * Copies `value` to the clipboard. The copy icon crossfades and scales into
 * a green check (150ms), holds for 1.2s, and returns — the library's
 * signature confirm. Icon-only by default; give it an `aria-label` that
 * names what it copies, e.g. "Copy API key".
 */
export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  onCopied,
  variant = "ghost",
  size = "sm",
  className,
  "aria-label": ariaLabel,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const text = typeof value === "function" ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // Clipboard blocked: no false confirmation.
    }
    onCopied?.(text);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), HOLD_MS);
  };

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      icon={!label}
      aria-label={label ? ariaLabel : (ariaLabel ?? "Copy")}
      data-copied={copied || undefined}
      className={className}
      onClick={copy}
    >
      <CopyGlyphs copied={copied} />
      {label ? (
        // Both labels share one grid cell, so the button keeps the wider width
        // and nothing shifts when the text changes.
        <span className="grid">
          <span className={cn("col-start-1 row-start-1 transition-opacity duration-150 ease-snap", copied && "opacity-0")}>
            {label}
          </span>
          <span
            aria-hidden
            className={cn("col-start-1 row-start-1 transition-opacity duration-150 ease-snap", !copied && "opacity-0")}
          >
            {copiedLabel}
          </span>
        </span>
      ) : null}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </Button>
  );
}

/** The copy → check crossfade. Also used by CodeBlock. */
export function CopyGlyphs({ copied }: { copied: boolean }) {
  return (
    <span className="relative inline-grid size-4 shrink-0" aria-hidden>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        className={cn(
          "absolute inset-0 size-4 transition-[opacity,scale] duration-150 ease-snap",
          copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
        <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
      </svg>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "absolute inset-0 size-4 text-ok transition-[opacity,scale] duration-150 ease-snap",
          copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
  );
}
