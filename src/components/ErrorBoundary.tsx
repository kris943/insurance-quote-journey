import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: (reset: () => void) => ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Last line of defence so an unexpected render error never shows a blank screen. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook for an error-reporting service (Sentry, CloudWatch RUM, …).
    console.error('Unhandled UI error', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    return this.state.hasError ? this.props.fallback(this.reset) : this.props.children;
  }
}
