"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileMenu } from "@/components/layout/MobileMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { productIds, openWishlist } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "glass" : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-brand">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M3 17L10 6L14 13L21 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-display text-xl font-extrabold uppercase tracking-tight">
              Velocity
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-semibold uppercase tracking-wide text-fg-muted transition-colors hover:text-fg",
                    active && "text-fg"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-brand"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-black/[0.04] hover:text-fg"
            >
              <Search size={19} />
            </button>
            <button
              onClick={openWishlist}
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-black/[0.04] hover:text-fg"
            >
              <Heart size={19} />
              {productIds.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-black">
                  {productIds.length}
                </span>
              )}
            </button>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-black/[0.04] hover:text-fg"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-black/[0.04] hover:text-fg lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} />
    </>
  );
}
