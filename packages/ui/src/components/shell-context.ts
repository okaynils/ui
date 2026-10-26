/*
 * Internal wiring between AppShell, TopBar, SidebarTrigger and SidebarItem.
 * Not exported from the package.
 */
import * as React from "react";

export interface ShellContextValue {
  /** Open the sidebar as a sheet (only meaningful below the shell's breakpoint). */
  openNav: () => void;
}

export const ShellContext = React.createContext<ShellContextValue | null>(null);

/** Set inside the mobile nav sheet, so choosing an item closes it. */
export const SidebarNavigateContext = React.createContext<(() => void) | null>(null);
