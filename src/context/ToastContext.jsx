import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-8 right-8 z-[10000] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              onClick={() => removeToast(toast.id)}
              className={`px-8 py-4 rounded-[24px] shadow-2xl backdrop-blur-xl border flex items-center gap-4 cursor-pointer min-w-[320px] isolate
                ${toast.type === 'success' ? 'bg-[#111827]/90 text-white border-white/10' : 
                  toast.type === 'error' ? 'bg-rose-950/90 text-white border-rose-500/20' : 
                  'bg-white/90 text-gray-900 border-gray-100'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
                ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {toast.type === 'success' ? '✓' : '✕'}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-1">{toast.type} notification</p>
                <p className="text-[13px] font-[1000] tracking-tight">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
