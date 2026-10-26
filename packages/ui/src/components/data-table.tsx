import * as React from "react";
import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableAlign,
  type TableDensity,
} from "./table";

export type SortDirection = "asc" | "desc";
export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface DataTableColumn<Row> {
  /** Identifies the column. Also the field read from each row unless `render`/`value` say otherwise. */
  key: string;
  header: React.ReactNode;
  /** Numbers and money go `right`. Right-aligned cells get tabular figures. */
  align?: TableAlign;
  /** Mono text: IDs, hashes, regions, timestamps. */
  mono?: boolean;
  /** Column width, e.g. `120` (px) or `"20%"`. */
  width?: number | string;
  /** Let the header sort by this column. */
  sortable?: boolean;
  /** The raw value, for sorting and default rendering. Defaults to `row[key]`. */
  value?: (row: Row) => unknown;
  /** Custom cell content. Sorting still uses `value`/`row[key]`. */
  render?: (row: Row) => React.ReactNode;
}

export interface DataTableProps<Row> {
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  /** A stable id per row. Used for selection, change flashes and React keys. */
  getRowId: (row: Row) => string;

  /** Controlled sort. `null` means unsorted. */
  sort?: SortState | null;
  /** Initial sort when uncontrolled. */
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;

  /** Show a checkbox column. */
  selectable?: boolean;
  /** Controlled selection (row ids). */
  selected?: readonly string[];
  defaultSelected?: readonly string[];
  onSelectedChange?: (ids: string[]) => void;

  /** Makes each whole row pressable (pointer and Enter/Space). */
  onRowClick?: (row: Row) => void;

  /** Rows whose data changed (or that appeared) since the last render get a brief tint. Default true. */
  flash?: boolean;
  /** Show placeholder rows instead of `rows`. */
  loading?: boolean;
  /** What to show when `rows` is empty. Default: "No rows." */
  empty?: React.ReactNode;
  density?: TableDensity;
  /** Accessible name for the table. */
  "aria-label"?: string;
  /** Classes for the scrolling wrapper, e.g. `max-h-96` for a sticky header. */
  className?: string;
}

function read<Row>(row: Row, column: DataTableColumn<Row>): unknown {
  return column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
}

function compare(a: unknown, b: unknown): number {
  // Empty values sort last in both directions; the caller only flips the rest.
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

const isEmpty = (v: unknown) => v === null || v === undefined || v === "";

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

function useControllable<T>(value: T | undefined, initial: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(initial);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

/**
 * A table from data: give it `columns`, `rows` and `getRowId`. Sorting,
 * selection, whole-row clicks, a sticky header, an empty state and loading
 * rows are built in. Rows that change in place flash briefly so a live
 * table shows *what* updated.
 */
export function DataTable<Row>({
  columns,
  rows,
  getRowId,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  selectable = false,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  onRowClick,
  flash = true,
  loading = false,
  empty = "No rows.",
  density = "default",
  className,
  ...aria
}: DataTableProps<Row>) {
  const [sort, setSort] = useControllable<SortState | null>(sortProp, defaultSort, onSortChange);
  const [selectedList, setSelectedList] = useControllable<readonly string[]>(
    selectedProp,
    defaultSelected,
    onSelectedChange as ((ids: readonly string[]) => void) | undefined,
  );
  const selected = React.useMemo(() => new Set(selectedList), [selectedList]);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return rows;
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = read(a, column);
      const vb = read(b, column);
      if (isEmpty(va) || isEmpty(vb)) return isEmpty(va) === isEmpty(vb) ? 0 : isEmpty(va) ? 1 : -1;
      return compare(va, vb) * factor;
    });
  }, [rows, columns, sort]);

  const cycleSort = (key: string) => {
    if (sort?.key !== key) setSort({ key, direction: "asc" });
    else if (sort.direction === "asc") setSort({ key, direction: "desc" });
    else setSort(null);
  };

  // ---- change flash ----
  const rowEls = React.useRef(new Map<string, HTMLTableRowElement>());
  const previous = React.useRef<Map<string, Row> | null>(null);
  React.useLayoutEffect(() => {
    const before = previous.current;
    const now = new Map<string, Row>();
    for (const row of rows) now.set(getRowId(row), row);
    previous.current = now;
    // Nothing flashes on first render, while loading, or when opted out.
    if (!before || !flash || loading) return;
    for (const [id, row] of now) {
      const old = before.get(id);
      if (old !== undefined && shallowEqual(old, row)) continue;
      const el = rowEls.current.get(id);
      if (!el) continue;
      // Restart the shared ui-flash animation even if it's mid-run.
      el.classList.remove("ui-flash");
      void el.offsetWidth;
      el.classList.add("ui-flash");
      el.addEventListener("animationend", () => el.classList.remove("ui-flash"), { once: true });
    }
  }, [rows, getRowId, flash, loading]);

  // ---- selection ----
  const visibleIds = sorted.map(getRowId);
  const selectedVisible = visibleIds.filter((id) => selected.has(id)).length;
  const allSelected = visibleIds.length > 0 && selectedVisible === visibleIds.length;
  const someSelected = selectedVisible > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) setSelectedList(selectedList.filter((id) => !visibleIds.includes(id)));
    else setSelectedList([...new Set([...selectedList, ...visibleIds])]);
  };
  const toggleRow = (id: string, on: boolean) => {
    setSelectedList(on ? [...selectedList, id] : selectedList.filter((x) => x !== id));
  };

  const colCount = columns.length + (selectable ? 1 : 0);
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <Table density={density} containerClassName={className} aria-label={aria["aria-label"]} aria-busy={loading || undefined}>
      <colgroup>
        {selectable ? <col style={{ width: 40 }} /> : null}
        {columns.map((c) => (
          <col key={c.key} style={c.width !== undefined ? { width: c.width } : undefined} />
        ))}
      </colgroup>
      <TableHeader>
        <TableRow>
          {selectable ? (
            <TableHead className="pr-0">
              <Checkbox
                aria-label={allSelected ? "Deselect all rows" : "Select all rows"}
                checked={allSelected}
                indeterminate={someSelected}
                disabled={visibleIds.length === 0 || loading}
                onCheckedChange={toggleAll}
                className="align-middle"
              />
            </TableHead>
          ) : null}
          {columns.map((column) => {
            const active = sort?.key === column.key ? sort.direction : null;
            return (
              <TableHead
                key={column.key}
                align={column.align}
                aria-sort={active === "asc" ? "ascending" : active === "desc" ? "descending" : column.sortable ? "none" : undefined}
                className={column.sortable ? "p-0" : undefined}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => cycleSort(column.key)}
                    className={cn(
                      "group/sort flex h-8 w-full cursor-default items-center gap-1 px-3 uppercase outline-none transition-colors",
                      "hover:text-ink-2 focus-visible:text-ink-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                      active && "text-ink-2",
                      column.align === "right" && "flex-row-reverse",
                      column.align === "center" && "justify-center",
                    )}
                  >
                    {column.header}
                    <span
                      aria-hidden
                      className={cn(
                        "w-2.5 text-center font-mono text-[10px] normal-case",
                        active ? "text-ink-3" : "text-ink-3 opacity-0 transition-opacity group-hover/sort:opacity-100",
                      )}
                    >
                      {active === "asc" ? "↑" : active === "desc" ? "↓" : "↕"}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }, (_, i) => (
            <TableRow key={`loading-${i}`}>
              {selectable ? <TableCell className="pr-0" /> : null}
              {columns.map((c, j) => (
                <TableCell key={c.key} align={c.align}>
                  <Skeleton className={cn("h-3", j === 0 ? "w-24" : "w-14", c.align === "right" && "ml-auto")} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : sorted.length === 0 ? (
          <tr>
            <td colSpan={colCount} className="px-3 py-10 text-center text-ui text-ink-2">
              {empty}
            </td>
          </tr>
        ) : (
          sorted.map((row) => {
            const id = getRowId(row);
            const isSelected = selected.has(id);
            const clickable = onRowClick !== undefined;
            return (
              <TableRow
                key={id}
                ref={(el) => {
                  if (el) rowEls.current.set(id, el);
                  else rowEls.current.delete(id);
                }}
                selected={isSelected}
                interactive={clickable}
                tabIndex={clickable ? 0 : undefined}
                onClick={clickable ? () => onRowClick(row) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
              >
                {selectable ? (
                  <TableCell className="pr-0" onClick={stop} onKeyDown={stop}>
                    <Checkbox
                      aria-label="Select row"
                      checked={isSelected}
                      onCheckedChange={(on) => toggleRow(id, on)}
                      className="align-middle"
                    />
                  </TableCell>
                ) : null}
                {columns.map((column) => {
                  const raw = read(row, column);
                  return (
                    <TableCell key={column.key} align={column.align} mono={column.mono} className="max-w-0 truncate">
                      {column.render ? column.render(row) : isEmpty(raw) ? <span className="text-ink-3">—</span> : String(raw)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
