"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { MegaMenu, type NavMenuItem } from "@/components/shared/mega-menu";

import { useBrand } from "@/contexts/brand-context";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { fadeUp, staggerContainer } from "@/lib/animation/variants";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  logo: React.ReactNode;
  items: NavMenuItem[];
  cta?: { label: string; href: string };
  className?: string;
}

const SCROLL_THRESHOLD = 80;

/**
 * Site header — DESIGN_SYSTEM.md §15. Behavior branches on the active
 * brand rather than a prop, since it's a brand-identity decision, not a
 * per-instance configuration one:
 *
 * - Agency: transparent over the hero, crossfades to a glass surface past
 *   the scroll threshold, hides on scroll-down/reveals on scroll-up.
 * - Lumora Skin: persistent solid surface with a hairline border from the
 *   start — commerce nav must always stay reachable for cart access.
 */
export function Navbar({ logo, items, cta, className }: NavbarProps) {
  const brand = useBrand();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [expandedLabel, setExpandedLabel] = React.useState<string | null>(null);
  const lastScrollY = React.useRef(0);

  useLockBodyScroll(isMobileMenuOpen);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > SCROLL_THRESHOLD);

      if (brand === "agency") {
        const scrollingDown = currentScrollY > lastScrollY.current;
        setIsHidden(scrollingDown && currentScrollY > SCROLL_THRESHOLD);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [brand]);

  const isGlass = brand === "agency" && isScrolled;
  const isSolid = brand === "lumora";

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedLabel(null);
  };

  return (
    <>
      <motion.header
        animate={{ y: isHidden ? "-100%" : "0%" }}
        transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-base",
          isGlass && "glass-surface",
          isSolid && "border-b border-hairline-subtle bg-canvas",
          className,
        )}
      >
        <div className="mx-auto flex h-16 max-w-container-2xl items-center justify-between px-5 md:px-8 lg:h-20">
          <div className="shrink-0">{logo}</div>

          <MegaMenu items={items} />

          <div className="flex items-center gap-3">
            {cta && (
              <Button
                asChild
                variant="primary"
                size="sm"
                className="hidden md:inline-flex"
              >
                <a href={cta.href}>{cta.label}</a>
              </Button>
            )}
            <Button
              variant="icon"
              size="icon"
              className="lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-canvas pt-24 lg:hidden"
          >
            <motion.nav
              variants={staggerContainer(70)}
              initial="hidden"
              animate="visible"
              className="flex flex-1 flex-col gap-1 px-6"
              aria-label="Mobile"
            >
              {items.map((item) =>
                item.columns ? (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    className="border-b border-hairline-subtle"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left font-display text-heading-02"
                      aria-expanded={expandedLabel === item.label}
                      onClick={() =>
                        setExpandedLabel((current) =>
                          current === item.label ? null : item.label,
                        )
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "size-5 transition-transform duration-fast",
                          expandedLabel === item.label && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedLabel === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.65, 0, 0.35, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <ul className="grid gap-3 py-2 pl-2">
                            {item.columns
                              .flatMap((column) => column.links)
                              .map((link) => (
                                <li key={link.href}>
                                  <a
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className="block py-1 text-body-md text-content-secondary"
                                  >
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.a
                    key={item.label}
                    variants={fadeUp}
                    href={item.href ?? "#"}
                    onClick={closeMobileMenu}
                    className="border-b border-hairline-subtle py-4 font-display text-heading-02"
                  >
                    {item.label}
                  </motion.a>
                ),
              )}
              {cta && (
                <motion.div variants={fadeUp} className="pt-6">
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <a href={cta.href} onClick={closeMobileMenu}>
                      {cta.label}
                    </a>
                  </Button>
                </motion.div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
