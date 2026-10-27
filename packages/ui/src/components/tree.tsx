import * as React from "react";
import { cn } from "../lib/cn";
import { DisclosureCaret } from "./accordion";

export interface TreeNode {
  /** Stable, unique across the whole tree. */
  id: string;
  label: React.ReactNode;
  /** Text for type-ahead when `label` isn't a string. */
  textValue?: string;
  /** A node with `children` (even an empty array) is a branch that can expand. */
  children?: readonly TreeNode[];
  /** 14px icon before the label, e.g. a folder or file glyph. */
  icon?: React.ReactNode;
  /** Right-aligned quiet detail: a size, a count. */
  meta?: React.ReactNode;
  /** Still reachable by keyboard (so it's discoverable), but can't be selected or expanded. */
  disabled?: boolean;
}

export interface TreeProps extends Omit<React.ComponentProps<"ul">, "children" | "onSelect"> {
  nodes: readonly TreeNode[];
  /** Expanded branch ids (controlled). */
  expanded?: readonly string[];
  /** Initially expanded branch ids (uncontrolled). */
  defaultExpanded?: readonly string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Selected node id (controlled). `null` for none. */
  selected?: string | null;
  /** Initially selected node id (uncontrolled). */
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Mono labels, for file names and paths. */
  mono?: boolean;
  /** Name the tree: "Files", "Resources". Required unless `aria-labelledby` is set. */
  "aria-label"?: string;
}

interface Row {
  node: TreeNode;
  depth: number;
  parent: string | null;
  branch: boolean;
}

// Each level indents by 16px, so a child's caret sits under its parent's label.
const INDENT = 16;
// Type-ahead keeps collecting letters for this long, so "re" finds "readme" past "routes".
const TYPEAHEAD_MS = 500;

function textOf(node: TreeNode): string {
  return node.textValue ?? (typeof node.label === "string" ? node.label : "");
}

/** The rows a keyboard can currently reach, in screen order. */
function visibleRows(nodes: readonly TreeNode[], open: ReadonlySet<string>, depth = 0, parent: string | null = null, out: Row[] = []): Row[] {
  for (const node of nodes) {
    const branch = node.children !== undefined;
    out.push({ node, depth, parent, branch });
    if (branch && open.has(node.id)) visibleRows(node.children!, open, depth + 1, node.id, out);
  }
  return out;
}

function useControllable<T>(value: T | undefined, initial: T, onChange?: (next: T) => void): [T, (next: T) => void] {
  const [own, setOwn] = React.useState(initial);
  const current = value === undefined ? own : value;
  return [current, (next) => {
    if (value === undefined) setOwn(next);
    onChange?.(next);
  }];
}

/**
 * A file/explorer tree for consoles. Branches expand in place; one node can
 * be selected. Fully keyboard-driven with a single tab stop (WAI-ARIA tree).
 */
export function Tree({
  nodes,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelect,
  mono = false,
  className,
  ...props
}: TreeProps) {
  const [expanded, setExpanded] = useControllable<readonly string[]>(expandedProp, defaultExpanded, (next) => onExpandedChange?.([...next]));
  const [selected, setSelected] = useControllable<string | null>(selectedProp, defaultSelected);
  const open = React.useMemo(() => new Set(expanded), [expanded]);
  const rows = React.useMemo(() => visibleRows(nodes, open), [nodes, open]);
  const [active, setActive] = React.useState<string | null>(null);
  const items = React.useRef(new Map<string, HTMLLIElement>());
  const typeahead = React.useRef({ text: "", at: 0 });

  // The tab stop: the focused row if it's still visible, else the selection, else the first row.
  const tabStop = rows.find((row) => row.node.id === active)?.node.id
    ?? rows.find((row) => row.node.id === selected)?.node.id
    ?? rows[0]?.node.id;

  const focus = (id: string | undefined) => {
    if (!id) return;
    setActive(id);
    items.current.get(id)?.focus();
  };

  const toggle = (row: Row, force?: boolean) => {
    if (!row.branch || row.node.disabled) return;
    const isOpen = open.has(row.node.id);
    const next = force ?? !isOpen;
    if (next === isOpen) return;
    setExpanded(next ? [...expanded, row.node.id] : expanded.filter((id) => id !== row.node.id));
  };

  const select = (row: Row) => {
    if (row.node.disabled) return;
    setSelected(row.node.id);
    onSelect?.(row.node.id, row.node);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, row: Row) => {
    // Nested <li>s bubble: only the row that owns focus answers.
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = rows.findIndex((candidate) => candidate.node.id === row.node.id);
    const handled = () => { event.preventDefault(); event.stopPropagation(); };
    switch (event.key) {
      case "ArrowDown": handled(); return focus(rows[index + 1]?.node.id);
      case "ArrowUp": handled(); return focus(rows[index - 1]?.node.id);
      case "Home": handled(); return focus(rows[0]?.node.id);
      case "End": handled(); return focus(rows.at(-1)?.node.id);
      case "ArrowRight":
        handled();
        if (!row.branch || row.node.disabled) return;
        if (!open.has(row.node.id)) return toggle(row, true);
        return focus(rows[index + 1]?.depth === row.depth + 1 ? rows[index + 1]!.node.id : undefined);
      case "ArrowLeft":
        handled();
        if (row.branch && open.has(row.node.id)) return toggle(row, false);
        return focus(row.parent ?? undefined);
      case "Enter":
      case " ":
        handled();
        return select(row);
      case "*": {
        handled();
        const siblings = rows.filter((candidate) => candidate.parent === row.parent && candidate.branch && !candidate.node.disabled);
        setExpanded([...new Set([...expanded, ...siblings.map((sibling) => sibling.node.id)])]);
        return;
      }
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      handled();
      const now = Date.now();
      const buffer = now - typeahead.current.at < TYPEAHEAD_MS ? typeahead.current.text + event.key.toLowerCase() : event.key.toLowerCase();
      typeahead.current = { text: buffer, at: now };
      // Search from the next row, wrapping, so repeating a letter cycles through matches.
      const order = [...rows.slice(index + (buffer.length === 1 ? 1 : 0)), ...rows.slice(0, index + (buffer.length === 1 ? 1 : 0))];
      focus(order.find((candidate) => textOf(candidate.node).toLowerCase().startsWith(buffer))?.node.id);
    }
  };

  const renderLevel = (level: readonly TreeNode[], depth: number, parent: string | null): React.ReactNode =>
    level.map((node, position) => {
      const branch = node.children !== undefined;
      const isOpen = branch && open.has(node.id);
      const row: Row = { node, depth, parent, branch };
      const isSelected = selected === node.id;
      return (
        <li
          key={node.id}
          ref={(element) => { if (element) items.current.set(node.id, element); else items.current.delete(node.id); }}
          role="treeitem"
          aria-level={depth + 1}
          aria-setsize={level.length}
          aria-posinset={position + 1}
          aria-expanded={branch ? isOpen : undefined}
          aria-selected={isSelected}
          aria-disabled={node.disabled || undefined}
          tabIndex={node.id === tabStop ? 0 : -1}
          onFocus={(event) => { if (event.target === event.currentTarget) setActive(node.id); }}
          onKeyDown={(event) => onKeyDown(event, row)}
          onClick={(event) => {
            event.stopPropagation();
            setActive(node.id);
            select(row);
            toggle(row);
          }}
          className="group/item outline-none"
        >
          <div
            className={cn(
              "flex h-7 cursor-default items-center gap-1.5 rounded-[2px] pr-2 text-ui text-ink select-none",
              isSelected ? "bg-active font-medium" : "hover:bg-hover",
              // Focus follows the arrow keys, so it lands instantly: tone plus an accent edge, like a table row.
              "group-focus-visible/item:bg-hover group-focus-visible/item:shadow-[inset_2px_0_0_var(--ui-accent)]",
              isSelected && "group-focus-visible/item:bg-active",
              node.disabled && "opacity-45",
            )}
            style={{ paddingLeft: 4 + depth * INDENT }}
          >
            {branch ? <DisclosureCaret className={cn("size-3 mx-0.5", isOpen && "rotate-90")} /> : <span aria-hidden className="w-4 shrink-0" />}
            {node.icon ? <span aria-hidden className="flex shrink-0 text-ink-2 [&_svg]:size-3.5">{node.icon}</span> : null}
            <span className={cn("min-w-0 flex-1 truncate", mono && "font-mono text-xs")}>{node.label}</span>
            {node.meta !== undefined ? <span className="shrink-0 font-mono text-[11px] text-ink-3 tabular-nums">{node.meta}</span> : null}
          </div>
          {isOpen && node.children!.length > 0 ? (
            <ul role="group" className="relative m-0 list-none p-0">
              {/* Indent guide: a hairline under the parent's caret, the length of its children. */}
              <span aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-line" style={{ left: 4 + depth * INDENT + 8 }} />
              {renderLevel(node.children!, depth + 1, node.id)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <ul {...props} role="tree" className={cn("m-0 flex list-none flex-col p-0", className)}>
      {renderLevel(nodes, 0, null)}
    </ul>
  );
}
