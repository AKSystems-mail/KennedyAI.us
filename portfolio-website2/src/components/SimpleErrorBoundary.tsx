import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class SimpleErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error in 3D Component:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center h-full w-full bg-black/90 text-red-500 p-6 text-center border border-red-900/50 rounded-xl">
                    <h3 className="font-bold text-lg mb-2">Visualization Unavailable</h3>
                    <p className="text-xs font-mono text-gray-400 mb-4">{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-3 py-1 bg-gray-800 text-xs text-white rounded hover:bg-gray-700 transition"
                    >
                        Try Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SimpleErrorBoundary;
