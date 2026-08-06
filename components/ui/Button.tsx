import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-btn-bg text-white shadow-[0_8px_20px_-8px_rgba(24,24,24,0.45)] hover:bg-btn-hover hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(24,24,24,0.5)]",
  secondary:
    "border border-brand text-brand-2 bg-transparent hover:bg-brand hover:text-white hover:-translate-y-0.5",
  outline:
    "border border-border-strong text-fg bg-white hover:border-fg/40 hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(24,24,24,0.04)]",
  ghost: "bg-transparent text-fg hover:bg-black/[0.04]",
};

const sizes: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "text-xs px-4 py-2 gap-1.5",
  md: "text-sm px-6 py-3 gap-2",
  lg: "text-base px-8 py-4 gap-2.5",
};

const base =
  "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-300 ease-out cursor-pointer active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: BaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
