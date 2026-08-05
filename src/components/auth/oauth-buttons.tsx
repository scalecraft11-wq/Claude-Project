"use client";

import { signIn } from "next-auth/react";
import * as React from "react";

import { Button } from "@/components/ui/button";

/**
 * Google/GitHub sign-in — `signIn()` handles the full OAuth redirect
 * dance itself, so there's no form/validation here, just a loading state
 * per button so a slow redirect doesn't look like a dead click.
 */
export function OAuthButtons({ callbackUrl }: { callbackUrl?: string }) {
  const [pendingProvider, setPendingProvider] = React.useState<string | null>(
    null,
  );

  const handleSignIn = (provider: "google" | "github") => {
    setPendingProvider(provider);
    void signIn(provider, { redirectTo: callbackUrl ?? "/dashboard" });
  };

  return (
    <div className="grid gap-3">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        isLoading={pendingProvider === "google"}
        disabled={pendingProvider !== null}
        onClick={() => handleSignIn("google")}
      >
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        isLoading={pendingProvider === "github"}
        disabled={pendingProvider !== null}
        onClick={() => handleSignIn("github")}
      >
        Continue with GitHub
      </Button>
    </div>
  );
}
