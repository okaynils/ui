import { Field as BaseField } from "@base-ui/react/field";
import * as React from "react";
import { cn } from "../lib/cn";

export interface FieldProps extends Omit<BaseField.Root.Props, "className" | "children"> {
  /** Visible label. Clicking it focuses the control. */
  label?: React.ReactNode;
  /** Helper text under the control. Hidden while an error shows. */
  description?: React.ReactNode;
  /**
   * An error message to show now (e.g. from your own validation or a server
   * response). Marks the field invalid. Native validation messages and `Form`
   * server errors show automatically; to word them yourself, add
   * `<FieldError match="valueMissing">…</FieldError>` children.
   */
  error?: React.ReactNode;
  /** The control: Input, Textarea, Select, Checkbox, Switch… */
  children: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

/**
 * Label + control + description/error, wired together for accessibility.
 * Prefer the props API; use the parts for custom layouts.
 */
export function Field({ label, description, error, invalid, children, className, ...props }: FieldProps) {
  const hasError = error !== undefined && error !== null && error !== false && error !== "";
  // Without custom <FieldError> children, a bare one shows whatever the field
  // has — the browser's validation message or a `Form` server error — so an
  // error can never go unshown.
  const hasCustomErrors = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === FieldError,
  );
  return (
    <BaseField.Root
      {...props}
      invalid={hasError || invalid}
      className={cn("group/field flex w-full flex-col gap-1.5", className)}
    >
      {label !== undefined ? <FieldLabel>{label}</FieldLabel> : null}
      {children}
      {hasError ? (
        <FieldError match>{error}</FieldError>
      ) : (
        <>
          {description !== undefined ? (
            <FieldDescription className="group-data-invalid/field:hidden">{description}</FieldDescription>
          ) : null}
          {hasCustomErrors ? null : <FieldError />}
        </>
      )}
    </BaseField.Root>
  );
}

export interface FieldRootProps extends Omit<BaseField.Root.Props, "className"> {
  className?: string;
}

/** The bare root, for custom layouts. Same as `Field` without the props API. */
export function FieldRoot({ className, ...props }: FieldRootProps) {
  return <BaseField.Root {...props} className={cn("flex w-full flex-col gap-1.5", className)} />;
}

export interface FieldLabelProps extends Omit<BaseField.Label.Props, "className"> {
  className?: string;
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <BaseField.Label
      {...props}
      className={cn("text-ui font-medium text-ink select-none data-disabled:opacity-45", className)}
    />
  );
}

export interface FieldDescriptionProps extends Omit<BaseField.Description.Props, "className"> {
  className?: string;
}

export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return <BaseField.Description {...props} className={cn("text-xs text-ink-2", className)} />;
}

export interface FieldErrorProps extends Omit<BaseField.Error.Props, "className"> {
  className?: string;
}

/** Error text. Appears with a quick fade so it registers without jumping. */
export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <BaseField.Error
      {...props}
      className={cn(
        "text-xs text-err transition-opacity duration-150 ease-snap data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-100",
        className,
      )}
    />
  );
}
