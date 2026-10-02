"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Label shown in the fallback, e.g. "Messages" — helps identify which section failed. */
  label?: string;
};

type State = { hasError: boolean };

/**
 * Catches render-time errors in a single dashboard section so one broken
 * section can't take down the whole app shell — the sidebar and the rest of
 * the dashboard stay usable, and the person can try that section again.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // In a real deployment this would report to an error-tracking service.
    console.error("Section failed to render:", this.props.label, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="rounded-[1.5rem] border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-700">
            {this.props.label ? `${this.props.label} couldn't load.` : "This section couldn't load."}
          </p>
          <p className="mt-1 text-sm text-red-600">Something went wrong. Try again, or switch to another section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
