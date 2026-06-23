"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Algo deu errado</h1>
            <p className="text-zinc-500 mb-6">Ocorreu um erro inesperado.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
