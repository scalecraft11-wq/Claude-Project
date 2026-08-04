"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui/button";

export type CookieConsent = "accepted" | "declined";

export interface CookieBannerProps {
  storageKey?: string;
  policyHref?: string;
  onConsentChange?: (consent: CookieConsent) => void;
}

/**
 * GDPR/CCPA consent banner — ARCHITECTURE.md §26. Renders nothing until
 * the client has checked `localStorage` for a prior choice (avoids a
 * hydration mismatch and a flash for returning visitors), slides up once,
 * and never reappears once a choice is recorded.
 */
export function CookieBanner({
  storageKey = "cookie-consent",
  policyHref = "/legal/privacy",
  onConsentChange,
}: CookieBannerProps) {
  const [consent, setConsent] = React.useState<CookieConsent | null>(null);
  const [hasChecked, setHasChecked] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    setConsent(stored === "accepted" || stored === "declined" ? stored : null);
    setHasChecked(true);
  }, [storageKey]);

  const recordConsent = (value: CookieConsent) => {
    window.localStorage.setItem(storageKey, value);
    setConsent(value);
    onConsentChange?.(value);
  };

  const isVisible = hasChecked && consent === null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="region"
          aria-label="Cookie consent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[70] rounded-card border border-hairline-subtle bg-surface p-6 shadow-elevation-4 sm:inset-x-auto sm:right-6 sm:max-w-sm"
        >
          <p className="text-body-sm text-content-secondary">
            We use cookies to improve your experience and understand how the
            site is used. Read our{" "}
            <a
              href={policyHref}
              className="text-content-primary underline underline-offset-2"
            >
              privacy policy
            </a>
            .
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              size="sm"
              variant="primary"
              className="flex-1"
              onClick={() => recordConsent("accepted")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => recordConsent("declined")}
            >
              Decline
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
