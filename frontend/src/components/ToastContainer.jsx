import React from 'react';
import { AlertCircle, AlertTriangle, Check, Info, X } from 'lucide-react';

const ToastContainer = ({ toasts, setToasts, isApiCalling }) => {
  return (
    <div className="toasts-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-card toast-${t.type}`}>
          <div className="toast-icon">
            {t.type === 'success' && <Check size={16} />}
            {t.type === 'info' && <Info size={16} />}
            {t.type === 'warning' && <AlertTriangle size={16} />}
            {(t.type === 'danger' || t.type === 'error') && <AlertCircle size={16} />}
          </div>
          <div className="toast-message">{t.message}</div>
          <button
            className="toast-close"
            onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
            disabled={isApiCalling}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
