"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { setPermissionGrantAction } from "@/lib/admin/actions/permissions";

const ROLES = ["CUSTOMER", "EDITOR", "MANAGER", "ADMIN"] as const;
type RoleName = (typeof ROLES)[number];

export interface PermissionRow {
  id: string;
  key: string;
  label: string;
  category: string;
  granted: Record<RoleName, boolean>;
}

function PermissionToggle({
  permissionId,
  role,
  granted,
}: {
  permissionId: string;
  role: RoleName;
  granted: boolean;
}) {
  const [checked, setChecked] = React.useState(granted);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = async (value: boolean) => {
    const previous = checked;
    setChecked(value);
    setIsSaving(true);
    const result = await setPermissionGrantAction(permissionId, role, value);
    setIsSaving(false);
    if (!result.success) setChecked(previous);
  };

  return (
    <div className="flex justify-center">
      <Switch
        checked={checked}
        onCheckedChange={handleChange}
        disabled={isSaving}
      />
    </div>
  );
}

export function PermissionsMatrix({
  permissions,
}: {
  permissions: PermissionRow[];
}) {
  const categories = Array.from(
    new Set(permissions.map((permission) => permission.category)),
  );

  return (
    <div className="grid gap-8">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="mb-3 font-display text-heading-03 text-content-primary">
            {category}
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role} className="text-center">
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions
                .filter((permission) => permission.category === category)
                .map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <p className="font-medium text-content-primary">
                        {permission.label}
                      </p>
                      <p className="text-caption text-content-muted">
                        {permission.key}
                      </p>
                    </TableCell>
                    {ROLES.map((role) => (
                      <TableCell key={role}>
                        <PermissionToggle
                          permissionId={permission.id}
                          role={role}
                          granted={permission.granted[role]}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
