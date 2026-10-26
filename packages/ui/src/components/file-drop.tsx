import { Input as BaseInput } from "@base-ui/react/input";
import * as React from "react";
import { cn } from "../lib/cn";

export interface FileRejection {
  file: File;
  /** Plain-language reason, ready to show: "not an accepted type", "larger than 5 MB", … */
  reason: string;
}

export interface FileDropProps {
  /** Same syntax as `<input accept>`: `"image/*,.pdf"`. Dropped files are checked too. */
  accept?: string;
  /** Allow more than one file. Without it, a new file replaces the old one. */
  multiple?: boolean;
  /** Largest allowed file, in bytes. */
  maxSize?: number;
  /** Most files kept when `multiple`. */
  maxFiles?: number;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  /** Called with files that were turned away, and why. They're also listed under the zone. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Submitted with the form, like a normal file input. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Main line in the zone. */
  title?: React.ReactNode;
  /** Small line under it, e.g. "PNG or JPG, up to 5 MB". */
  description?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

/**
 * A drop zone with a file list. Drag files onto it, or click (Enter/Space
 * when focused) to browse. Rejected files are named with the reason. Works
 * inside `Field`.
 */
export function FileDrop({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  value,
  defaultValue = [],
  onValueChange,
  onReject,
  name,
  required,
  disabled,
  title,
  description,
  className,
}: FileDropProps) {
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState<File[]>(defaultValue);
  const files = controlled ? value : inner;
  const [rejected, setRejected] = React.useState<FileRejection[]>([]);
  const [over, setOver] = React.useState(false);
  const depth = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Resync after rejected selections too: the browser changes input.files even
  // when the accepted list (or a controlled value) keeps the same reference.
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(f);
    input.files = dt.files;
  });

  const set = (next: File[]) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const add = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;
    const ok: File[] = [];
    const bad: FileRejection[] = [];
    for (const file of incoming) {
      if (accept && !matchesAccept(file, accept)) bad.push({ file, reason: "not an accepted type" });
      else if (maxSize !== undefined && file.size > maxSize) bad.push({ file, reason: `larger than ${formatBytes(maxSize)}` });
      else ok.push(file);
    }
    let next = multiple ? [...files, ...ok.filter((f) => !files.some((g) => sameFile(f, g)))] : ok.slice(-1);
    if (!multiple && ok.length === 0) next = files;
    if (multiple && maxFiles !== undefined && next.length > maxFiles) {
      for (const file of next.slice(maxFiles)) bad.push({ file, reason: `only ${maxFiles} file${maxFiles === 1 ? "" : "s"} allowed` });
      next = next.slice(0, maxFiles);
    }
    setRejected(bad);
    if (bad.length > 0) onReject?.(bad);
    if (next !== files) set(next);
  };

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          if (disabled) return;
          depth.current += 1;
          setOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) e.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={() => {
          depth.current = Math.max(0, depth.current - 1);
          if (depth.current === 0) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          add(Array.from(e.dataTransfer.files));
        }}
        data-dragging={over || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          "relative flex cursor-default flex-col items-center justify-center gap-1 rounded-box px-4 py-6 text-center select-none",
          // The one dashed edge in the library: the old web's "put it here".
          "border border-dashed border-line-strong bg-surface transition-colors duration-120",
          "hover:border-ink-3 hover:bg-panel",
          "has-[input:focus-visible]:border-accent has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent",
          "has-[input[data-invalid]]:border-err",
          "data-dragging:border-accent data-dragging:bg-accent-tint",
          "data-disabled:cursor-not-allowed data-disabled:opacity-45 data-disabled:hover:border-line-strong data-disabled:hover:bg-surface",
        )}
      >
        <BaseInput
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          // Visually hidden but focusable: Enter/Space opens the picker natively.
          className="peer absolute size-px overflow-hidden opacity-0 [clip-path:inset(50%)]"
          onClick={(e) => e.stopPropagation()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            add(Array.from(e.currentTarget.files ?? []));
          }}
        />
        <UploadIcon className={cn("mb-1 size-5 transition-colors duration-120", over ? "text-accent" : "text-ink-3")} />
        <div className="text-ui text-ink">
          {over ? "Drop to add" : (title ?? (
            <>
              Drop {multiple ? "files" : "a file"} here or <span className="text-accent underline decoration-accent/30 underline-offset-[3px]">browse</span>
            </>
          ))}
        </div>
        {description !== undefined ? <div className="text-xs text-ink-3">{description}</div> : null}
      </div>

      {files.length > 0 ? (
        <ul className="divide-y divide-line rounded-box shadow-[0_0_0_1px_var(--ui-line)]" aria-label="Chosen files">
          {files.map((file, i) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex h-9 items-center gap-2 pr-1 pl-3">
              <FileIcon className="size-4 shrink-0 text-ink-3" />
              <MiddleTruncate text={file.name} className="flex-1 text-ui text-ink" />
              <span className="shrink-0 font-mono text-[11px] text-ink-3 tabular-nums">{formatBytes(file.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => set(files.filter((_, j) => j !== i))}
                className="ui-press flex size-7 shrink-0 cursor-default items-center justify-center rounded-ui text-ink-3 outline-none hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                  <path d="m4.5 4.5 7 7m0-7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {rejected.length > 0 ? (
        <ul className="flex flex-col gap-0.5" aria-live="polite">
          {rejected.map(({ file, reason }) => (
            <li key={`${file.name}-${reason}`} className="flex min-w-0 gap-1 text-xs text-err">
              <MiddleTruncate text={file.name} className="max-w-[60%]" />
              <span className="shrink-0">— {reason}.</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Truncates in the middle so the extension survives: "quarterly-rep….pdf". */
function MiddleTruncate({ text, className }: { text: string; className?: string }) {
  const dot = text.lastIndexOf(".");
  const tailLength = dot > 0 && text.length - dot <= 8 ? text.length - dot + 4 : 8;
  if (text.length <= tailLength + 4) return <span className={cn("min-w-0 truncate", className)}>{text}</span>;
  const head = text.slice(0, text.length - tailLength);
  const tail = text.slice(text.length - tailLength);
  return (
    <span className={cn("flex min-w-0", className)} title={text}>
      <span className="min-w-0 truncate">{head}</span>
      <span className="shrink-0 whitespace-pre">{tail}</span>
    </span>
  );
}

function matchesAccept(file: File, accept: string): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

function sameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

/** 1536 → "1.5 KB". Base 1024, one decimal under 10. */
export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u += 1;
  }
  return `${u === 0 ? n : n < 10 ? n.toFixed(1) : Math.round(n)} ${units[u]}`;
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13V3.5M6 7.5l4-4 4 4M3.5 12.5v3a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M4 1.5h5.5L13 5v9.5H4z" />
      <path d="M9.5 1.5V5H13" />
    </svg>
  );
}
