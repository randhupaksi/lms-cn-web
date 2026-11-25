"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X } from "lucide-react";

type Toast = { id: number; message: string };
type ToastContextValue = { success: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider.");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const nextId = useRef(0);

  const success = useCallback((message: string) => {
    nextId.current += 1;
    setToast({ id: nextId.current, message });
  }, []);
  const dismiss = useCallback(() => setToast(null), []);
  const value = useMemo(() => ({ success }), [success]);
  const toastId = toast?.id;

  useEffect(() => {
    if (toastId === undefined) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toastId]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast ? (
          <div className="toast-success" role="status" key={toast.id}>
            <CheckCircle2
              className="toast-success-icon"
              aria-hidden="true"
              size={19}
            />
            <div className="toast-success-copy">
              <strong>Berhasil</strong>
              <span>{toast.message}</span>
            </div>
            <button
              className="toast-dismiss"
              type="button"
              onClick={dismiss}
              aria-label="Tutup notifikasi"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}
