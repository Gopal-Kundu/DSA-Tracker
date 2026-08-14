import React from 'react';
import { AlertTriangle, Check, ExternalLink, X } from 'lucide-react';

const ToastContainer = ({ toasts, setToasts, isApiCalling }) => {
  return (
    <div className="toasts-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-card toast-${t.type}`}>
          <div className="toast-icon">
            {t.type === 'success' && <Check size={14} />}
            {t.type === 'info' && <ExternalLink size={14} />}
            {t.type === 'warning' && <AlertTriangle size={14} />}
          </div>
          <div className="toast-message">{t.message}</div>
          <button className="toast-close" onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} disabled={isApiCalling}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
