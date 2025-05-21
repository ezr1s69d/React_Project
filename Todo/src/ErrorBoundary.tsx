import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>
        <h2>Oops, something went wrong.</h2>
        <pre>{this.state.error?.toString()}</pre>
      </div>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
