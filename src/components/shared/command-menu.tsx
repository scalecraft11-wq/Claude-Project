"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

export interface CommandMenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandMenuGroup {
  heading: string;
  items: CommandMenuItem[];
}

export interface CommandMenuProps {
  groups: CommandMenuGroup[];
  emptyMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Global ⌘K command palette — DESIGN_SYSTEM.md §16. Manages its own open
 * state and the `⌘K`/`Ctrl+K` shortcut when uncontrolled; pass `open`/
 * `onOpenChange` to drive it externally instead (e.g. from a search icon
 * in the navbar).
 */
export function CommandMenu({
  groups,
  emptyMessage = "No results found.",
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = onOpenChangeProp ?? setInternalOpen;

  React.useEffect(() => {
    if (isControlled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setInternalOpen((current) => !current);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isControlled]);

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.heading} heading={group.heading}>
            {group.items.map((item) => (
              <CommandItem
                key={item.label}
                value={item.label}
                onSelect={() => runCommand(item.onSelect)}
              >
                {item.icon}
                {item.label}
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
