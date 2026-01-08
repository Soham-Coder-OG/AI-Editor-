import React, { useEffect } from 'react';
import { ToastMessage } from '../contexts/ToastContext';
import { IconCheck } from './icons/IconCheck';
import { IconAlertTriangle } from './icons/IconAlertTriangle';
import { IconInfo } from './icons/IconInfo';
import { IconXCircle } from './icons/IconXCircle';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const toastConfig = {
  success: {
    icon: <IconCheck className="w-6 h-6 text-green-400" />,
    style: 'bg-green-500/10 border-green-500/30 text-green-300',
  },
  error: {
    icon: <IconAlertTriangle className="w-6 h-6 text-red-400" />,
    style: 'bg-red-500/10 border-red-500/30 text-red-400',
  },
  info: {
    icon: <IconInfo className="w-6 h-6 text-sky-400" />,
    style: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
  },
};

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const { id, message, type } = toast;
  const config = toastConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [id, onDismiss]);

  return (
    <div
      className={`relative w-full max-w-sm rounded-xl p-4 flex items-start gap-4 shadow-2xl shadow-background/50 backdrop-blur-xl border animate-fade-in ${config.style}`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-grow text-sm font-medium text-text">{message}</div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 text-subtle hover:text-text transition-colors"
        aria-label="Dismiss notification"
      >
        <IconXCircle className="w-5 h-5" />
      </button>
    </div>
  );
};
