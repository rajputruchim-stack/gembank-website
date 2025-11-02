import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
}

const icons: { [key in ToastType]: React.ReactNode } = {
  success: <CheckCircle className="text-green-500" size={24} />,
  error: <AlertTriangle className="text-red-500" size={24} />,
  info: <Info className="text-blue-500" size={24} />,
};

const Toast: React.FC<ToastProps> = ({ id, title, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onDismiss]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 flex items-start space-x-4 animate-slide-in-right">
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <button onClick={() => onDismiss(id)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
