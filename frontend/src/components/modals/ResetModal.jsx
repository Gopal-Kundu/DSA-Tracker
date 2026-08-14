import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ResetModal = ({
  isResetModalOpen,
  setIsResetModalOpen,
  handleResetConfirm,
  isApiCalling
}) => {
  if (!isResetModalOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-card modal-confirm-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <AlertTriangle className="modal-header-icon text-danger" size={24} />
            <h2>Reset All Progress?</h2>
          </div>
          <button className="modal-close btn-close-modal" onClick={() => setIsResetModalOpen(false)} disabled={isApiCalling}>
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
          <button type="button" className="btn btn-secondary" onClick={() => setIsResetModalOpen(false)} disabled={isApiCalling}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={handleResetConfirm} disabled={isApiCalling}>Yes, Reset Progress</button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
