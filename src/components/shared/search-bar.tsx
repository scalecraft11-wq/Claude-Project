"use client";

import { Search, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  /** Debounced — fires `debounceMs` after the user stops typing. */
  onSearch: (query: string) => void;
  debounceMs?: number;
  defaultValue?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * A debounced search input. Feeds `<CommandMenu>`/a search-results view;
 * does not render results itself, keeping this reusable across contexts
 * (case-study/blog search, the Lumora PLP, the command palette's inline
 * variant).
 */
export function SearchBar({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  defaultValue = "",
  className,
  "aria-label": ariaLabel = "Search",
}: SearchBarProps) {
  const [value, setValue] = React.useState(defaultValue);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (next: string) => {
    setValue(next);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onSearch(next), debounceMs);
  };

  const handleClear = () => {
    setValue("");
    clearTimeout(timeoutRef.current);
    onSearch("");
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-sm border border-hairline-subtle bg-surface px-4 focus-within:border-accent",
        "transition-colors duration-fast",
        className,
      )}
    >
      <Search
        className="size-4 shrink-0 text-content-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        aria-label={ariaLabel}
        value={value}
        placeholder={placeholder}
        onChange={(event) => handleChange(event.target.value)}
        className="h-11 w-full bg-transparent text-body-md outline-none placeholder:text-content-muted"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="shrink-0 text-content-muted transition-colors duration-fast hover:text-content-primary"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
