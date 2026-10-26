import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "../lib/cn";

export interface FormProps extends Omit<BaseForm.Props, "className"> {
  /** Layout classes. Defaults to a column with `gap-4` between fields. */
  className?: string;
}

/**
 * A `<form>` that routes validation into each `Field`'s `FieldError` instead
 * of the browser's bubble, and accepts server errors keyed by field `name`
 * through `errors`.
 */
export function Form({ className, ...props }: FormProps) {
  return <BaseForm {...props} className={cn("flex flex-col gap-4", className)} />;
}
