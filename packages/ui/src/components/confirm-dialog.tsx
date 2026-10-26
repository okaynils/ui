import { AlertDialog } from "@base-ui/react/alert-dialog";
import * as React from "react";
import { Button } from "./button";
import { dialogBackdrop, dialogPopup, dialogViewport } from "./dialog";

export interface ConfirmDialogProps {
  /** The element that opens it, e.g. `<Button variant="danger">Delete</Button>`. Omit when controlling `open`. */
  trigger?: React.ReactElement;
  /** A question: "Delete this project?" */
  title: React.ReactNode;
  /** What happens, plainly: "Its 14 deployments go with it. This can't be undone." */
  description?: React.ReactNode;
  /** The confirm button's label. A verb that repeats the action: "Delete project". */
  confirmLabel?: string;
  /** Defaults to "Cancel". */
  cancelLabel?: string;
  /** `danger` for destructive actions (red confirm button), `primary` otherwise. */
  variant?: "danger" | "primary";
  /**
   * Runs on confirm. If it returns a promise, the confirm button shows a
   * spinner and the dialog closes when it resolves; if it rejects, the dialog
   * stays open so the user can retry or cancel.
   */
  onConfirm: () => void | Promise<unknown>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Asks before doing something consequential. Built on an alert dialog: it
 * can't be dismissed by clicking outside, and focus starts on Cancel so a
 * stray Enter never destroys anything.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  open: openProp,
  onOpenChange,
}: ConfirmDialogProps) {
  const [openState, setOpenState] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const open = openProp ?? openState;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  const confirm = async () => {
    const result = onConfirm();
    if (!(result instanceof Promise)) return setOpen(false);
    setPending(true);
    try {
      await result;
      setOpen(false);
    } catch {
      // Stay open: the caller reports the error (e.g. with a toast).
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      {trigger ? <AlertDialog.Trigger render={trigger} /> : null}
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={dialogBackdrop} />
        <AlertDialog.Viewport className={dialogViewport}>
          <AlertDialog.Popup className={dialogPopup("sm")} initialFocus={cancelRef}>
            <AlertDialog.Title className="text-[15px] leading-6 font-semibold tracking-[-0.01em] text-ink">{title}</AlertDialog.Title>
            {description ? <AlertDialog.Description className="mt-1 text-sm text-ink-2">{description}</AlertDialog.Description> : null}
            <div className="-mx-5 mt-5 -mb-5 flex items-center justify-end gap-2 rounded-b-box border-t border-line bg-panel px-5 py-3">
              <AlertDialog.Close render={<Button ref={cancelRef} disabled={pending} />}>{cancelLabel}</AlertDialog.Close>
              <Button variant={variant} loading={pending} onClick={confirm}>
                {confirmLabel}
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
