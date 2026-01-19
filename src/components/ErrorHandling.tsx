import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Global Error Boundary Component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Something went wrong</h2>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network Error Component
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Connection Error</h3>
          <p className="text-muted-foreground">
            Unable to connect to the server. Please check your internet connection.
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </Card>
    </div>
  );
}

// Generic Error Display
export function ErrorDisplay({ 
  title = "Error",
  message = "Something went wrong. Please try again.",
  onRetry 
}: { 
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="p-6 text-center space-y-4 border-red-200 bg-red-50/50">
      <AlertTriangle className="h-10 w-10 text-red-600 mx-auto" />
      <div className="space-y-2">
        <h3 className="font-semibold text-red-900">{title}</h3>
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-3 w-3" />
          Try Again
        </Button>
      )}
    </Card>
  );
}

// Inline Error (for form fields, etc.)
export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
      <AlertTriangle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
