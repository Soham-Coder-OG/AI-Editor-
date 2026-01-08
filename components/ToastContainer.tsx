import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { Toast } from './Toast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end justify-start p-4 sm:p-6 space-y-4 z-50 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="w-full max-w-sm pointer-events-auto">
            <Toast toast={toast} onDismiss={removeToast} />
        </div>
      ))}
    </div>
  );
};
