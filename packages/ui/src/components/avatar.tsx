import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import * as React from "react";
import { cn } from "../lib/cn";

export type AvatarSize = 20 | 24 | 32 | 40;

const SIZE: Record<AvatarSize, string> = {
  20: "size-5 text-[9px]",
  24: "size-6 text-[10px]",
  32: "size-8 text-xs",
  40: "size-10 text-sm",
};

export interface AvatarProps extends Omit<BaseAvatar.Root.Props, "className" | "children"> {
  /** Image URL. While it loads, or if it fails, the initials show. */
  src?: string;
  /** The person or thing. Used for the initials and as the image's alt text. */
  name: string;
  /** Diameter in px. */
  size?: AvatarSize;
  /** Layout classes only. */
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2);
  return parts[0]![0]! + parts[parts.length - 1]![0]!;
}

/** A round picture of a person or org, with mono initials as the fallback. */
export function Avatar({ src, name, size = 24, className, ...props }: AvatarProps) {
  return (
    <BaseAvatar.Root
      {...props}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-active align-middle",
        SIZE[size],
        className,
      )}
    >
      {src ? (
        <BaseAvatar.Image
          src={src}
          alt={name}
          className="size-full object-cover transition-opacity duration-150 ease-snap data-starting-style:opacity-0"
        />
      ) : null}
      {/* A short delay keeps fast-loading images from flashing initials first. */}
      <BaseAvatar.Fallback
        delay={src ? 300 : 0}
        aria-label={src ? undefined : name}
        role={src ? undefined : "img"}
        className="font-mono font-medium tracking-tight text-ink-2 uppercase"
      >
        {initials(name)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /** Show at most this many, then a `+N` chip. */
  max?: number;
  /** Size for every avatar in the group (overrides theirs) and the `+N` chip. */
  size?: AvatarSize;
}

/** Overlapping avatars, each cut out of the one before by a ring in the page colour. */
export function AvatarGroup({ max, size = 24, className, children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const shown = max !== undefined && items.length > max ? items.slice(0, max) : items;
  const rest = items.length - shown.length;
  return (
    <div
      {...props}
      className={cn(
        "isolate flex items-center",
        size >= 32 ? "[&>*:not(:first-child)]:-ml-1.5" : "[&>*:not(:first-child)]:-ml-1",
        "[&>*]:ring-2 [&>*]:ring-surface",
        className,
      )}
    >
      {shown.map((child) => React.cloneElement(child as React.ReactElement<{ size?: AvatarSize }>, { size }))}
      {rest > 0 ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full bg-panel font-mono font-medium text-ink-2 tabular-nums",
            "shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
            SIZE[size],
          )}
          aria-label={`${rest} more`}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  );
}
