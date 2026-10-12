import { useEffect, useState } from 'react';

// Notificações sem biblioteca: um "emissor" simples + container com aria-live
const TOAST_DURATION_IN_MS = 4000;
let toastListener = null;
let nextToastId = 1;

function emitToast(type, message) {
  toastListener?.({ id: nextToastId++, type, message });
}

export const toast = {
  success: (message) => emitToast('success', message),
  error: (message) => emitToast('error', message),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts((currentToasts) => [...currentToasts, newToast]);
      setTimeout(() => {
        setToasts((currentToasts) => currentToasts.filter((currentToast) => currentToast.id !== newToast.id));
      }, TOAST_DURATION_IN_MS);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toasts.map((visibleToast) => (
        <div key={visibleToast.id} className={`toast toast-${visibleToast.type}`}>
          <span aria-hidden="true">{visibleToast.type === 'success' ? '✓' : '⚠'}</span>
          {visibleToast.message}
        </div>
      ))}
    </div>
  );
}
