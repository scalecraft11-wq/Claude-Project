"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col gap-10 bg-bg-elevated border-l border-border-subtle px-8 py-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-extrabold uppercase">Menu</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/[0.04]"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "block border-b border-border-subtle py-4 font-display text-3xl font-extrabold uppercase tracking-tight text-fg-muted transition-colors hover:text-brand",
                      pathname === link.href && "text-fg"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="mt-auto text-xs text-fg-faint">
              © {new Date().getFullYear()} Velocity Shoes. Move Beyond Limits.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
