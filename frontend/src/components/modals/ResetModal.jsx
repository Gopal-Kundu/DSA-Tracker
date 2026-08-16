import React, { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ResetModal = ({
  isResetModalOpen,
  setIsResetModalOpen,
  handleResetConfirm
}) => {
  const [isResetting, setIsResetting] = useState(false);

  if (!isResetModalOpen) return null;

  const onReset = async () => {
    setIsResetting(true);
    try {
      await handleResetConfirm();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card modal-confirm-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <AlertTriangle className="modal-header-icon text-danger" size={24} />
            <h2>Reset All Progress?</h2>
          </div>
          <button className="modal-close btn-close-modal" onClick={() => setIsResetModalOpen(false)} disabled={isResetting}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body confirm-body">
          <p className="confirm-main-text">This action will reset your progress back to unsolved for all questions in your sheet.</p>
          <div className="warning-box">
            <AlertTriangle size={20} className="warning-box-icon" />
            <p className="warning-text">Warning: This action cannot be undone and all revision counts will be reset.</p>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setIsResetModalOpen(false)} disabled={isResetting}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onReset} disabled={isResetting}>
            {isResetting ? (
              <>
                <Loader2 className="spinner" size={16} />
                <span>Resetting...</span>
              </>
            ) : (
              <span>Yes, Reset Progress</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
