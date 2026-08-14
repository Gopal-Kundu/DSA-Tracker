import React from 'react';
import { Edit, FileText, X } from 'lucide-react';

const NotesModal = ({
  isNoteModalOpen,
  setIsNoteModalOpen,
  noteModalData,
  setNoteModalData,
  handleSaveNotes,
  isApiCalling
}) => {
  if (!isNoteModalOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <div className="modal-title-group">
            <FileText className="modal-header-icon text-accent" size={24} />
            <div>
              <h2>Question Notes</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {noteModalData.name} ({noteModalData.topic})
              </span>
            </div>
          </div>
          <button className="modal-close btn-close-modal" onClick={() => setIsNoteModalOpen(false)} disabled={isApiCalling}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSaveNotes}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label-with-icon" style={{ marginBottom: '0.5rem' }}>
                <Edit size={14} />
                <span>Write note</span>
              </label>
              <textarea
                className="notes-textarea"
                placeholder="Write your note here... (approach, edge cases, formulas, tricks)"
                value={noteModalData.notes}
                onChange={(e) => setNoteModalData(prev => ({ ...prev, notes: e.target.value }))}
                rows={6}
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsNoteModalOpen(false)} disabled={isApiCalling}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isApiCalling}>
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesModal;
