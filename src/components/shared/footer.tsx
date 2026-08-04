import Link from "next/link";
import * as React from "react";

import type { NavLinkItem } from "@/components/shared/mega-menu";
import { Container } from "@/components/layouts";

export interface FooterColumn {
  heading: string;
  links: NavLinkItem[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface FooterProps {
  logo: React.ReactNode;
  description?: string;
  columns: FooterColumn[];
  socialLinks?: FooterSocialLink[];
  bottomLinks?: NavLinkItem[];
  copyrightText: string;
}

/**
 * Site footer — quiet, typographic, no card/shadow chrome (DESIGN_SYSTEM.md
 * §1: "editorial before app-like"). A Server Component — nothing here
 * needs interactivity or animation.
 */
export function Footer({
  logo,
  description,
  columns,
  socialLinks,
  bottomLinks,
  copyrightText,
}: FooterProps) {
  return (
    <footer className="border-t border-hairline-subtle">
      <Container size="2xl" as="div" className="py-section-sm">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="grid gap-4">
            {logo}
            {description && (
              <p className="max-w-measure text-body-sm text-content-secondary">
                {description}
              </p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <ul className="mt-2 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-full text-content-muted transition-colors duration-fast hover:bg-surface-raised hover:text-content-primary"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="grid gap-3">
              <p className="text-overline text-content-muted">
                {column.heading}
              </p>
              <ul className="grid gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-content-secondary transition-colors duration-fast hover:text-content-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-content-muted">{copyrightText}</p>
          {bottomLinks && bottomLinks.length > 0 && (
            <ul className="flex flex-wrap gap-6">
              {bottomLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-content-muted transition-colors duration-fast hover:text-content-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  );
}
