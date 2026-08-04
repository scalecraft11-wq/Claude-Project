"use client";

import { useEffect } from "react";

/**
 * Last-resort error boundary — Next.js App Router convention. Only
 * activates if the root layout itself throws, so it must render its own
 * `<html>`/`<body>` and cannot assume the normal providers/fonts/tokens
 * pipeline is available. Kept deliberately minimal and dependency-free.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <p style={{ fontSize: "1.5rem", fontWeight: 500 }}>
          Something went wrong
        </p>
        <p style={{ color: "#5e5445", maxWidth: "32rem" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            border: "1px solid #998c78",
            borderRadius: "4px",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
