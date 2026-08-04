"use client";

import * as React from "react";

import { ErrorFallback } from "@/components/error/error-fallback";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback render — defaults to `<ErrorFallback>`. */
  fallback?: (args: { error: Error; reset: () => void }) => React.ReactNode;
  /**
   * Called once when an error is caught — this is the wire-up point for
   * Sentry (ARCHITECTURE.md §28) once it's installed. Left as a plain
   * callback rather than importing a reporting SDK directly, so this
   * component has zero third-party dependencies at the foundation stage.
   */
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
