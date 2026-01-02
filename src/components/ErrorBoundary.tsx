/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-slate-600 mb-4">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-left text-sm bg-slate-50 p-4 rounded-md mb-4">
                  <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-red-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
