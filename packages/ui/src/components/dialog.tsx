import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { withClass, XGlyph } from "./overlay-utils";

/*
 * Shared by Dialog and ConfirmDialog: a scrim that fades, and a centred
 * panel that settles from 97% (180ms in, 120ms out — exits are quicker).
 */
export const dialogBackdrop = [
  "fixed inset-0 z-50 bg-scrim",
  "transition-opacity duration-180 ease-snap data-ending-style:duration-120",
  "data-starting-style:opacity-0 data-ending-style:opacity-0",
].join(" ");

export const dialogViewport = "fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-8";

const SIZE = { sm: "max-w-[380px]", md: "max-w-[480px]", lg: "max-w-[640px]" } as const;
export type DialogSize = keyof typeof SIZE;

export function dialogPopup(size: DialogSize) {
  return cn(
    "relative w-full rounded-box bg-raised p-5 text-ink shadow-modal outline-none",
    "transition-[opacity,scale] duration-180 ease-snap data-ending-style:duration-120",
    "data-starting-style:scale-97 data-starting-style:opacity-0 data-ending-style:scale-97 data-ending-style:opacity-0",
    SIZE[size],
  );
}

export type DialogProps = BaseDialog.Root.Props;

/** Root of a modal dialog. Controlled via `open` / `onOpenChange`, or uncontrolled with a `DialogTrigger`. */
export function Dialog(props: DialogProps) {
  return <BaseDialog.Root {...props} />;
}

export type DialogTriggerProps = BaseDialog.Trigger.Props;

/** Opens the dialog. Compose with Button: `<DialogTrigger render={<Button />}>`. */
export function DialogTrigger(props: DialogTriggerProps) {
  return <BaseDialog.Trigger {...props} />;
}

export interface DialogContentProps extends BaseDialog.Popup.Props {
  /** Max width: sm 380px, md 480px (default), lg 640px. */
  size?: DialogSize;
  /** Show the × button in the top-right corner. Keep it unless the footer has an obvious way out. */
  showClose?: boolean;
}

/** The panel: portal, scrim and centring built in. Esc and clicking the scrim close it. */
export function DialogContent({ size = "md", showClose = true, className, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={dialogBackdrop} />
      <BaseDialog.Viewport className={dialogViewport}>
        <BaseDialog.Popup {...props} className={withClass(dialogPopup(size), className)}>
          {children}
          {showClose ? (
            <BaseDialog.Close
              render={<Button variant="ghost" size="sm" icon aria-label="Close" />}
              className="absolute top-3 right-3"
            >
              <XGlyph />
            </BaseDialog.Close>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export type DialogTitleProps = BaseDialog.Title.Props;

/** The dialog's heading. Required: it names the dialog for screen readers. */
export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <BaseDialog.Title {...props} className={withClass("pr-8 text-[15px] leading-6 font-semibold tracking-[-0.01em] text-ink", className)} />;
}

export type DialogDescriptionProps = BaseDialog.Description.Props;

/** One or two sentences under the title. */
export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <BaseDialog.Description {...props} className={withClass("mt-1 text-sm text-ink-2", className)} />;
}

export interface DialogFooterProps extends React.ComponentProps<"div"> {}

/** The action row: a hairline, a panel tone, buttons right-aligned. Put the primary action last. */
export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      {...props}
      className={cn(
        "-mx-5 mt-5 -mb-5 flex items-center justify-end gap-2 rounded-b-box border-t border-line bg-panel px-5 py-3",
        className,
      )}
    />
  );
}

export type DialogCloseProps = BaseDialog.Close.Props;

/** Closes the dialog. Compose with Button: `<DialogClose render={<Button />}>Cancel</DialogClose>`. */
export function DialogClose(props: DialogCloseProps) {
  return <BaseDialog.Close {...props} />;
}
