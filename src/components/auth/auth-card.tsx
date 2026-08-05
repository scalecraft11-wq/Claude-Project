import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** The one shared card recipe every auth page builds on. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Card className="shadow-elevation-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-6">{children}</CardContent>
      {footer && (
        <div className="border-t border-hairline-subtle p-6 pt-5 text-center text-body-sm text-content-secondary">
          {footer}
        </div>
      )}
    </Card>
  );
}
