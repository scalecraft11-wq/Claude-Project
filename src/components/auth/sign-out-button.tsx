"use client";

import { signOut } from "next-auth/react";
import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

export function SignOutButton(props: ButtonProps) {
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      isLoading={isSigningOut}
      onClick={() => {
        setIsSigningOut(true);
        void signOut({ redirectTo: "/" });
      }}
      {...props}
    >
      Sign out
    </Button>
  );
}
