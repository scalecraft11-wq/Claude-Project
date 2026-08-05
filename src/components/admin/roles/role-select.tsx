"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRoleAction } from "@/lib/admin/actions/roles";

const ROLE_OPTIONS = ["CUSTOMER", "EDITOR", "MANAGER", "ADMIN"] as const;

export function RoleSelect({
  userId,
  role,
  isCurrentUser,
}: {
  userId: string;
  role: string;
  isCurrentUser: boolean;
}) {
  const [current, setCurrent] = React.useState(role);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = async (value: string) => {
    const previous = current;
    setCurrent(value);
    setIsSaving(true);
    setError(null);

    const result = await updateUserRoleAction(userId, {
      role: value as (typeof ROLE_OPTIONS)[number],
    });

    setIsSaving(false);
    if (!result.success) {
      setCurrent(previous);
      setError(result.message);
      return;
    }
  };

  return (
    <div className="grid gap-1">
      <Select
        value={current}
        onValueChange={handleChange}
        disabled={isSaving || isCurrentUser}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option.charAt(0) + option.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-caption text-danger">{error}</p>}
    </div>
  );
}
