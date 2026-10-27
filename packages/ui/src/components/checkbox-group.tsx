import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field as BaseField } from "@base-ui/react/field";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import * as React from "react";
import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";
import { FieldError } from "./field";

/* ---- Fieldset ---- */

export interface FieldsetProps extends Omit<BaseFieldset.Root.Props, "className"> {
  /** The group's name, e.g. "Shipping address". Read out when focus enters the group. */
  legend?: React.ReactNode;
  /** A line under the legend that applies to every control inside. */
  description?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

// The legend matches FieldLabel (13px, medium): a fieldset is a field made of
// several controls, so its name should read at the same level as a label.
const legendClass = "text-ui font-medium text-ink select-none data-disabled:opacity-45";
const descriptionClass = "text-xs text-ink-2";

/**
 * Groups related controls under one name: an address, a set of switches,
 * a RadioGroup with its explanation. `disabled` disables everything inside.
 */
export function Fieldset({ legend, description, className, children, ...props }: FieldsetProps) {
  const descriptionId = React.useId();
  return (
    <BaseFieldset.Root
      aria-describedby={description !== undefined ? descriptionId : undefined}
      {...props}
      // Native fieldsets bring a border, padding and a min-width that lets
      // wide children overflow; reset all three so it lays out like a div.
      className={cn("m-0 flex min-w-0 flex-col gap-3 border-0 p-0", className)}
    >
      {legend !== undefined || description !== undefined ? (
        <div className="flex flex-col gap-0.5">
          {legend !== undefined ? <BaseFieldset.Legend className={legendClass}>{legend}</BaseFieldset.Legend> : null}
          {description !== undefined ? <div id={descriptionId} className={descriptionClass}>{description}</div> : null}
        </div>
      ) : null}
      {children}
    </BaseFieldset.Root>
  );
}

/* ---- CheckboxGroup ---- */

export interface CheckboxGroupItem {
  value: string;
  label: React.ReactNode;
  /** A quieter line under the label, linked to the checkbox as its description. */
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, "className" | "children" | "render"> {
  /** The group's visible name, rendered as a fieldset legend. */
  label?: React.ReactNode;
  /** A line under the label. */
  description?: React.ReactNode;
  /** The options. Or pass `Checkbox` children with a `value` each. */
  items?: readonly CheckboxGroupItem[];
  children?: React.ReactNode;
  /**
   * Add a parent checkbox that ticks or clears every option and shows a dash
   * when some are ticked. `true` labels it "Select all". With `children`
   * instead of `items`, also pass `allValues`.
   */
  selectAll?: boolean | React.ReactNode;
  /** Lay options out in a row instead of a column. */
  orientation?: "vertical" | "horizontal";
  /** Form field name; the value is submitted as the array of ticked values. */
  name?: string;
  /** An error to show now, e.g. "Pick at least one channel". Marks the group invalid. */
  error?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

/**
 * Several independent yes/no choices about one thing, with a shared value:
 * the array of ticked options. Optionally with a "select all" checkbox.
 */
export function CheckboxGroup({
  label,
  description,
  items,
  children,
  selectAll,
  orientation = "vertical",
  name,
  error,
  value: valueProp,
  defaultValue,
  onValueChange,
  allValues: allValuesProp,
  disabled,
  className,
  ...rest
}: CheckboxGroupProps) {
  // Base UI's parent checkbox needs a controlled group, so the group is
  // always controlled here and keeps its own state when you don't.
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? uncontrolled;
  const allValues = allValuesProp ?? items?.filter((item) => !item.disabled).map((item) => item.value);
  const hasError = error !== undefined && error !== null && error !== false && error !== "";
  const descriptionId = React.useId();

  return (
    <BaseField.Root name={name} invalid={hasError || undefined} disabled={disabled} className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <BaseFieldset.Root
        aria-describedby={description !== undefined ? descriptionId : undefined}
        render={
          <BaseCheckboxGroup
            {...rest}
            value={value}
            allValues={allValues}
            disabled={disabled}
            onValueChange={(next, details) => {
              if (valueProp === undefined) setUncontrolled(next);
              onValueChange?.(next, details);
            }}
          />
        }
        className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0"
      >
        {label !== undefined || description !== undefined ? (
          <div className="flex flex-col gap-0.5">
            {label !== undefined ? <BaseFieldset.Legend className={legendClass}>{label}</BaseFieldset.Legend> : null}
            {description !== undefined ? <div id={descriptionId} className={descriptionClass}>{description}</div> : null}
          </div>
        ) : null}
        {selectAll ? (
          <BaseField.Item>
            <Checkbox parent label={selectAll === true ? "Select all" : selectAll} />
          </BaseField.Item>
        ) : null}
        <div
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-x-5 gap-y-2",
            // Children of "select all" are indented under it, so the hierarchy reads at a glance.
            selectAll && orientation === "vertical" && "pl-6",
          )}
        >
          {items
            ? items.map((item) => (
                <BaseField.Item key={item.value} disabled={item.disabled} className="flex flex-col gap-0.5">
                  <Checkbox value={item.value} label={item.label} />
                  {item.description !== undefined ? (
                    // Indented by the box and its gap, so it lines up with the label text.
                    <BaseField.Description className="pl-6 text-xs text-ink-2">{item.description}</BaseField.Description>
                  ) : null}
                </BaseField.Item>
              ))
            : children}
        </div>
      </BaseFieldset.Root>
      {hasError ? <FieldError match>{error}</FieldError> : <FieldError />}
    </BaseField.Root>
  );
}
