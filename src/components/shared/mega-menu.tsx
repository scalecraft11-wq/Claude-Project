"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

/** A single link within a mega menu column (or a plain top-level link). */
export interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
}

/** A top-level nav entry — either a plain link or a mega panel of columns. */
export interface NavMenuItem {
  label: string;
  href?: string;
  columns?: Array<{ heading?: string; links: NavLinkItem[] }>;
  /** Optional highlighted panel (e.g. a featured case study) shown
   * alongside the columns. */
  featured?: {
    title: string;
    description?: string;
    href: string;
    imageUrl?: string;
  };
}

export interface MegaMenuProps {
  items: NavMenuItem[];
  className?: string;
}

/**
 * Desktop mega menu — DESIGN_SYSTEM.md §15/§16. Built on Radix
 * NavigationMenu for full keyboard/roving-focus support; panels open on
 * hover with Radix's built-in intent delay and animate via
 * `data-motion`-driven enter/exit utilities (tailwindcss-animate) rather
 * than a hard show/hide.
 */
export function MegaMenu({ items, className }: MegaMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn("relative z-40 hidden lg:block", className)}
    >
      <NavigationMenuPrimitive.List className="flex items-center gap-1">
        {items.map((item) => (
          <NavigationMenuPrimitive.Item key={item.label}>
            {item.columns ? (
              <>
                <NavigationMenuPrimitive.Trigger
                  className={cn(
                    "group flex items-center gap-1 rounded-sm px-3 py-2",
                    "text-body-sm font-medium text-content-primary",
                    "transition-colors duration-fast hover:text-accent focus-visible:outline-none",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className="size-3.5 transition-transform duration-fast group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </NavigationMenuPrimitive.Trigger>
                <NavigationMenuPrimitive.Content
                  className={cn(
                    "data-[motion=from-end]:slide-in-from-right-8 data-[motion=from-start]:slide-in-from-left-8",
                    "data-[motion=to-end]:slide-out-to-right-8 data-[motion=to-start]:slide-out-to-left-8",
                    "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
                    "absolute left-0 top-0 w-full duration-base data-[motion^=from-]:fade-in",
                  )}
                >
                  <div
                    className={cn(
                      "grid gap-8 rounded-md border border-hairline-subtle bg-surface p-6 shadow-elevation-3",
                      item.featured ? "grid-cols-[2fr_1fr]" : "grid-cols-2",
                    )}
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {item.columns.map((column, columnIndex) => (
                        <div
                          key={column.heading ?? columnIndex}
                          className="grid gap-3"
                        >
                          {column.heading && (
                            <p className="text-overline text-content-muted">
                              {column.heading}
                            </p>
                          )}
                          <ul className="grid gap-1">
                            {column.links.map((link) => (
                              <li key={link.href}>
                                <NavigationMenuPrimitive.Link asChild>
                                  <Link
                                    href={link.href}
                                    className="group/link block rounded-sm px-2 py-1.5 transition-colors duration-fast hover:bg-surface-raised"
                                  >
                                    <span className="block text-body-sm font-medium text-content-primary group-hover/link:text-accent">
                                      {link.label}
                                    </span>
                                    {link.description && (
                                      <span className="block text-body-sm text-content-secondary">
                                        {link.description}
                                      </span>
                                    )}
                                  </Link>
                                </NavigationMenuPrimitive.Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {item.featured && (
                      <NavigationMenuPrimitive.Link asChild>
                        <Link
                          href={item.featured.href}
                          className="group/featured rounded-md bg-surface-raised p-4"
                        >
                          {item.featured.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element -- decorative mega-menu preview, not a content image
                            <img
                              src={item.featured.imageUrl}
                              alt=""
                              className="mb-3 aspect-video w-full rounded-sm object-cover"
                            />
                          )}
                          <p className="text-body-sm font-medium text-content-primary group-hover/featured:text-accent">
                            {item.featured.title}
                          </p>
                          {item.featured.description && (
                            <p className="mt-1 text-body-sm text-content-secondary">
                              {item.featured.description}
                            </p>
                          )}
                        </Link>
                      </NavigationMenuPrimitive.Link>
                    )}
                  </div>
                </NavigationMenuPrimitive.Content>
              </>
            ) : (
              <NavigationMenuPrimitive.Link asChild>
                <Link
                  href={item.href ?? "#"}
                  className="block rounded-sm px-3 py-2 text-body-sm font-medium text-content-primary transition-colors duration-fast hover:text-accent"
                >
                  {item.label}
                </Link>
              </NavigationMenuPrimitive.Link>
            )}
          </NavigationMenuPrimitive.Item>
        ))}
        <NavigationMenuPrimitive.Indicator
          className={cn(
            "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
            "top-full flex h-2 items-end justify-center overflow-hidden",
          )}
        >
          <div className="relative top-1 size-2.5 rotate-45 rounded-tl-xs bg-surface" />
        </NavigationMenuPrimitive.Indicator>
      </NavigationMenuPrimitive.List>
      <div className="perspective-[2000px] absolute left-0 top-full flex justify-center">
        <NavigationMenuPrimitive.Viewport
          className={cn(
            "relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] overflow-hidden rounded-md border border-hairline-subtle bg-surface shadow-elevation-3",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        />
      </div>
    </NavigationMenuPrimitive.Root>
  );
}
