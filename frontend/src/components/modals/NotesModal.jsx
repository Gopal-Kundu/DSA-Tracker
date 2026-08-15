import React, { useState, useEffect } from 'react';
import { Edit, FileText, X, Sparkles, Loader2, RotateCcw, Check } from 'lucide-react';
import { baseURL } from '../../config';

const NotesModal = ({
  isNoteModalOpen,
  setIsNoteModalOpen,
  noteModalData,
  setNoteModalData,
  handleSaveNotes,
  isApiCalling,
  customFetch,
  showToast
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRefinedText, setAiRefinedText] = useState('');
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [aiError, setAiError] = useState('');

  // Reset AI states when modal opens/closes
  useEffect(() => {
    if (!isNoteModalOpen) {
      setAiRefinedText('');
      setShowAiPreview(false);
      setAiError('');
      setIsAiLoading(false);
    }
  }, [isNoteModalOpen]);

  const handleAiRefine = async () => {
    if (!noteModalData.notes || !noteModalData.notes.trim()) {
      if (showToast) showToast('Please write some text in notes first!', 'warning');
      return;
    }

    setIsAiLoading(true);
    setAiError('');

    try {
      const fetchFn = customFetch || fetch;
      const response = await fetchFn(`${baseURL}/api/questions/refine-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: noteModalData.notes,
          name: noteModalData.name,
          topic: noteModalData.topic
        })
      });

      const data = await response.json();

      if (response.ok && data.refinedNotes) {
        setAiRefinedText(data.refinedNotes);
        setShowAiPreview(true);
        if (showToast) showToast('Note refined with AI!', 'success');
      } else {
        const errorMsg = data.error || 'Failed to refine note with AI.';
        setAiError(errorMsg);
        if (showToast) showToast(errorMsg, 'warning');
      }
    } catch (err) {
      console.error('Error refining note with AI:', err);
      const errStr = 'Network error while contacting AI service.';
      setAiError(errStr);
      if (showToast) showToast(errStr, 'warning');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiText = () => {
    setNoteModalData(prev => ({ ...prev, notes: aiRefinedText }));
    setShowAiPreview(false);
    if (showToast) showToast('AI refined text applied to note!', 'info');
  };

  if (!isNoteModalOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '600px' }}>
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
          <button
            className="modal-close btn-close-modal"
            onClick={() => setIsNoteModalOpen(false)}
            disabled={isApiCalling || isAiLoading}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSaveNotes}>
          <div className="modal-body">
            <div className="form-group">
              <div className="notes-header-flex">
                <label className="form-label-with-icon">
                  <Edit size={14} />
                  <span>Write Note</span>
                </label>

                <button
                  type="button"
                  className="btn-ai-refine"
                  onClick={handleAiRefine}
                  disabled={isAiLoading || isApiCalling || !noteModalData.notes?.trim()}
                  title="Refine note using AI"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="spinner" size={14} />
                      <span>Refining Note...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>AI Refine</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                className="notes-textarea"
                placeholder="Write your note here... (approach, edge cases, formulas, tricks)"
                value={noteModalData.notes}
                onChange={(e) => setNoteModalData(prev => ({ ...prev, notes: e.target.value }))}
                rows={6}
                autoFocus
              />
            </div>

            {/* AI Error Display */}
            {aiError && (
              <div className="ai-error-banner">
                <span>{aiError}</span>
                <button type="button" className="modal-close" onClick={() => setAiError('')}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* AI Refined Preview Section */}
            {showAiPreview && aiRefinedText && (
              <div className="ai-refined-card">
                <div className="ai-card-header">
                  <div className="ai-title-badge">
                    <Sparkles size={16} />
                    <span>AI Refined Note</span>
                  </div>
                  <span className="ai-model-tag">AI Powered</span>
                </div>

                <div className="ai-card-content">
                  {aiRefinedText}
                </div>

                <div className="ai-card-actions">
                  <button
                    type="button"
                    className="btn-ai-action btn-ai-redo"
                    onClick={handleAiRefine}
                    disabled={isAiLoading}
                    title="Regenerate refinement with AI"
                  >
                    <RotateCcw size={13} />
                    <span>Redo AI</span>
                  </button>

                  <button
                    type="button"
                    className="btn-ai-action btn-ai-apply"
                    onClick={handleApplyAiText}
                    title="Copy AI refined text to textarea"
                  >
                    <Check size={14} />
                    <span>Apply AI Text</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsNoteModalOpen(false)}
              disabled={isApiCalling || isAiLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isApiCalling || isAiLoading}
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesModal;
