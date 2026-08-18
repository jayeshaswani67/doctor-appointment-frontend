import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // THIS WILL PRINT THE EXACT REAL ERROR TO YOUR CONSOLE
    console.error("EXACT ERROR CAUGHT:", error);
    console.error("COMPONENT STACK:", errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
          <h2 style={{ color: "red" }}>Something went wrong!</h2>
          <pre style={{ background: "#f4f4f4", padding: "20px", borderRadius: "8px" }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}