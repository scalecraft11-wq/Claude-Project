"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "max-w-[400px]",
  md: "max-w-[560px]",
  lg: "max-w-[880px]",
} as const;

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  size?: keyof typeof sizeMap;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * A convenience composition over `<Dialog>` for the common
 * title/description/body/footer pattern (DESIGN_SYSTEM.md §18) — use the
 * granular `Dialog*` primitives directly for anything more bespoke (the
 * command palette, a custom lightbox chrome).
 */
export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  size = "md",
  footer,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(sizeMap[size], className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
