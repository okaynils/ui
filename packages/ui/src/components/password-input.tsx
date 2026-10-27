import * as React from "react";
import { cn } from "../lib/cn";
import { Input, type InputProps, type InputSize } from "./input";
import { StatusDot } from "./status";

export type PasswordInputPurpose = "current" | "new";

export interface PasswordInputProps extends Omit<InputProps, "type" | "trailing"> {
  /**
   * Signing in (`current`) or choosing one (`new`). Sets `autoComplete` so
   * password managers fill the saved password or offer to generate one.
   */
  purpose?: PasswordInputPurpose;
  /** Controlled visibility. */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

const TOGGLE_SIZE: Record<InputSize, string> = { sm: "size-5 -mr-1", md: "size-6 -mr-1.5", lg: "size-7 -mr-2" };

/**
 * A password field with a show/hide toggle and a Caps Lock warning. Toggling
 * keeps focus and the cursor where they were.
 */
export function PasswordInput({
  purpose = "current",
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  size = "md",
  autoComplete,
  ref,
  onKeyDown,
  onKeyUp,
  onPointerDown,
  onBlur,
  disabled,
  ...props
}: PasswordInputProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultVisible);
  const visible = visibleProp ?? uncontrolled;
  const [capsLock, setCapsLock] = React.useState(false);
  const input = React.useRef<HTMLInputElement | null>(null);
  const selection = React.useRef<[number | null, number | null] | null>(null);

  const setRef = (node: HTMLInputElement | null) => {
    input.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const setVisible = (next: boolean) => {
    if (visibleProp === undefined) setUncontrolled(next);
    onVisibleChange?.(next);
  };

  const toggle = () => {
    const field = input.current;
    // Changing `type` resets the selection in some browsers; remember it so
    // the cursor stays where you were typing.
    selection.current = field && document.activeElement === field ? [field.selectionStart, field.selectionEnd] : null;
    setVisible(!visible);
  };

  React.useLayoutEffect(() => {
    const field = input.current;
    const saved = selection.current;
    selection.current = null;
    if (!field || !saved) return;
    const restore = () => {
      field.focus();
      field.setSelectionRange(saved[0], saved[1]);
    };
    restore();
    // The caret still jumps to the start after this commit (seen in Chrome,
    // not with a bare input), so put it back on the next frame as well.
    const frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  // Hide the password again when its form submits, so it's never left on
  // screen behind a navigation or saved by the browser as plain text.
  React.useEffect(() => {
    const form = input.current?.form;
    if (!form || !visible) return;
    const hide = () => setVisible(false);
    form.addEventListener("submit", hide);
    return () => form.removeEventListener("submit", hide);
  });

  const readCapsLock = (event: React.KeyboardEvent | React.PointerEvent) => {
    if (typeof event.getModifierState === "function") setCapsLock(event.getModifierState("CapsLock"));
  };

  return (
    <Input
      {...props}
      ref={setRef}
      size={size}
      disabled={disabled}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete ?? (purpose === "new" ? "new-password" : "current-password")}
      // Revealed passwords are ordinary text; don't let the keyboard "fix" them.
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      onKeyDown={(event) => { readCapsLock(event); onKeyDown?.(event); }}
      onKeyUp={(event) => { readCapsLock(event); onKeyUp?.(event); }}
      onPointerDown={(event) => { readCapsLock(event); onPointerDown?.(event); }}
      onBlur={(event) => { setCapsLock(false); onBlur?.(event); }}
      trailing={
        <>
          {capsLock ? (
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-ink-2">
              <StatusDot tone="warn" />
              Caps Lock
            </span>
          ) : null}
          <span role="status" className="sr-only">{capsLock ? "Caps Lock is on" : ""}</span>
          <button
            type="button"
            aria-label="Show password"
            aria-pressed={visible}
            disabled={disabled}
            // A pointer press shouldn't take focus from the field.
            onPointerDown={(event) => event.preventDefault()}
            onClick={toggle}
            className={cn(
              "grid shrink-0 place-items-center rounded-[2px] text-ink-3 outline-none transition-colors duration-120 hover:bg-hover hover:text-ink",
              "focus-visible:outline-2 focus-visible:outline-accent aria-pressed:text-ink-2",
              TOGGLE_SIZE[size],
            )}
          >
            {visible ? <EyeClosedIcon /> : <EyeIcon />}
          </button>
        </>
      }
    />
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
      <path d="M2 2l12 12M6.6 3.7A6 6 0 0 1 8 3.5C12 3.5 14.5 8 14.5 8a12 12 0 0 1-1.8 2.4M10.7 11.8A6 6 0 0 1 8 12.5C4 12.5 1.5 8 1.5 8a12 12 0 0 1 2.4-3" />
      <path d="M6.6 6.6a2 2 0 0 0 2.8 2.8" />
    </svg>
  );
}
