import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  // Update state when an error is caught
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  // Log error details
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    // TODO: Optionally send error to server / adminService
    // adminService.reportError({ error, stack: errorInfo.componentStack });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-xl w-full border border-red-300 dark:border-red-900">
            <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-700 dark:text-gray-200 mb-6 text-center">
              An unexpected error occurred. Don’t worry, we’re on it!
            </p>

            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 overflow-auto max-h-48">
                <p className="font-mono text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {this.state.errorInfo && (
              <details className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 mb-2">
                  View Stack Trace
                </summary>
                <pre className="bg-gray-100 dark:bg-gray-950 p-4 rounded-lg overflow-auto text-xs font-mono whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Reload Page
              </button>
              {/* Optional: Add a report button */}
              {/* <button
                onClick={reportError}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Report
              </button> */}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
