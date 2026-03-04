import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#CFECF7] flex items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8">⚠️</div>
                <h2 className="text-3xl font-[1000] text-gray-900 mb-4 tracking-tighter uppercase">Critical System Interruption</h2>
                <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                    A runtime exception has occurred. The deployment kernel has been halted to prevent data corruption.
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl text-[10px] font-mono text-left text-gray-400 mb-8 overflow-auto max-h-32">
                    {this.state.error?.toString()}
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
                >
                    Reinitialize System
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
