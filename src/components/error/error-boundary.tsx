"use client";

import * as Sentry from "@sentry/nextjs";
import * as React from "react";

import { ErrorFallback } from "@/components/error/error-fallback";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback render — defaults to `<ErrorFallback>`. */
  fallback?: (args: { error: Error; reset: () => void }) => React.ReactNode;
  /** Called in addition to the always-on Sentry report — for callers that
   * also want to react locally (e.g. reset some unrelated local state). */
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Generic error boundary for wrapping a specific risky subtree (a 3D
 * canvas, a third-party embed) without tearing down the whole route —
 * `app/error.tsx` is the route-segment-level equivalent Next.js provides
 * natively; use this one for a narrower blast radius.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    Sentry.captureException(error);
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  override render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      return this.props.fallback ? (
        this.props.fallback({ error, reset: this.reset })
      ) : (
        <ErrorFallback onRetry={this.reset} />
      );
    }
    return this.props.children;
  }
}
