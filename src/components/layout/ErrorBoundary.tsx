import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
          <div className="text-base font-semibold text-white">页面出错了</div>
          <div className="max-w-md text-center text-sm text-white/55">
            {this.state.error?.message || "发生了意外错误，请刷新页面重试。"}
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="rounded-lg bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-[color:var(--bg)] transition hover:brightness-110"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
