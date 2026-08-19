import React, { useState, useEffect } from 'react';
import { Edit, FileText, X, Sparkles, Loader2, RotateCcw, Check, Clock, Plus, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { baseURL } from '../../config';

const NotesModal = ({
  isNoteModalOpen,
  setIsNoteModalOpen,
  noteModalData,
  setNoteModalData,
  handleSaveNotes,
  customFetch,
  showToast
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingType, setAiLoadingType] = useState(null); // 'refine' | 'complexity' | null
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [aiRefinedText, setAiRefinedText] = useState('');
  const [aiMode, setAiMode] = useState('refine'); // 'refine' | 'complexity'
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [aiError, setAiError] = useState('');
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  // Reset AI states when modal opens/closes
  useEffect(() => {
    if (!isNoteModalOpen) {
      setAiRefinedText('');
      setShowAiPreview(false);
      setAiError('');
      setIsAiLoading(false);
      setAiLoadingType(null);
      setIsSavingNote(false);
      setAiMode('refine');
      setActiveTab('write');
    }
  }, [isNoteModalOpen]);

  const handleAiRefine = async () => {
    if (!noteModalData.notes || !noteModalData.notes.trim()) {
      if (showToast) showToast('Please write some text in notes first!', 'warning');
      return;
    }

    setIsAiLoading(true);
    setAiLoadingType('refine');
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
          topic: noteModalData.topic,
          mode: 'refine'
        })
      });

      const data = await response.json();

      if (response.ok && data.refinedNotes) {
        setAiRefinedText(data.refinedNotes);
        setAiMode('refine');
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
      setAiLoadingType(null);
    }
  };

  const handleAiComplexity = async () => {
    setIsAiLoading(true);
    setAiLoadingType('complexity');
    setAiError('');

    try {
      const fetchFn = customFetch || fetch;
      const response = await fetchFn(`${baseURL}/api/questions/refine-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: noteModalData.notes || '',
          name: noteModalData.name,
          topic: noteModalData.topic,
          mode: 'complexity'
        })
      });

      const data = await response.json();

      if (response.ok && data.refinedNotes) {
        setAiRefinedText(data.refinedNotes);
        setAiMode('complexity');
        setShowAiPreview(true);
        if (showToast) showToast('Time complexity generated with AI!', 'success');
      } else {
        const errorMsg = data.error || 'Failed to analyze time complexity with AI.';
        setAiError(errorMsg);
        if (showToast) showToast(errorMsg, 'warning');
      }
    } catch (err) {
      console.error('Error generating time complexity with AI:', err);
      const errStr = 'Network error while contacting AI service.';
      setAiError(errStr);
      if (showToast) showToast(errStr, 'warning');
    } finally {
      setIsAiLoading(false);
      setAiLoadingType(null);
    }
  };

  const handleAddAiText = () => {
    setNoteModalData(prev => {
      const existing = prev.notes ? prev.notes.trim() : '';
      const updated = existing ? `${existing}\n\n${aiRefinedText}` : aiRefinedText;
      return { ...prev, notes: updated };
    });
    setShowAiPreview(false);
    if (showToast) showToast('AI analysis added to original note!', 'info');
  };

  const handleApplyAiText = () => {
    setNoteModalData(prev => ({ ...prev, notes: aiRefinedText }));
    setShowAiPreview(false);
    if (showToast) showToast('AI text replaced original note!', 'info');
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setIsSavingNote(true);
    try {
      await handleSaveNotes(e);
    } finally {
      setIsSavingNote(false);
    }
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
            disabled={isSavingNote || isAiLoading}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <div className="notes-header-flex">
                <div className="notes-mode-tabs">
                  <button
                    type="button"
                    className={`notes-tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                    onClick={() => setActiveTab('write')}
                  >
                    <Edit size={13} />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    className={`notes-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>
                </div>

                <div className="ai-buttons-group" style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn-ai-refine"
                    onClick={handleAiComplexity}
                    disabled={isAiLoading || isSavingNote}
                    title="Generate Time & Space Complexity using AI"
                  >
                    {isAiLoading && aiLoadingType === 'complexity' ? (
                      <>
                        <Loader2 className="spinner" size={14} />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Clock size={14} />
                        <span>Time Complexity</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn-ai-refine"
                    onClick={handleAiRefine}
                    disabled={isAiLoading || isSavingNote || !noteModalData.notes?.trim()}
                    title="Refine note using AI"
                  >
                    {isAiLoading && aiLoadingType === 'refine' ? (
                      <>
                        <Loader2 className="spinner" size={14} />
                        <span>Refining...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>AI Refine</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {activeTab === 'write' ? (
                <textarea
                  className="notes-textarea"
                  placeholder="Write your note here... (Markdown supported)"
                  value={noteModalData.notes || ''}
                  onChange={(e) => setNoteModalData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={6}
                  autoFocus
                />
              ) : (
                <div className="notes-markdown-preview">
                  {noteModalData.notes && noteModalData.notes.trim() ? (
                    <ReactMarkdown>{noteModalData.notes}</ReactMarkdown>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      No note content to preview yet. Switch to "Write" tab to add notes.
                    </p>
                  )}
                </div>
              )}
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
                    {aiMode === 'complexity' ? <Clock size={16} /> : <Sparkles size={16} />}
                    <span>{aiMode === 'complexity' ? 'AI Time Complexity Analysis' : 'AI Refined Note'}</span>
                  </div>
                  <span className="ai-model-tag">{aiMode === 'complexity' ? 'Complexity AI' : 'AI Powered'}</span>
                </div>

                <div className="ai-card-content">
                  <ReactMarkdown>{aiRefinedText}</ReactMarkdown>
                </div>

                <div className="ai-card-actions">
                  <button
                    type="button"
                    className="btn-ai-action btn-ai-redo"
                    onClick={aiMode === 'complexity' ? handleAiComplexity : handleAiRefine}
                    disabled={isAiLoading || isSavingNote}
                    title="Regenerate with AI"
                  >
                    <RotateCcw size={13} />
                    <span>Redo AI</span>
                  </button>

                  <button
                    type="button"
                    className="btn-ai-action btn-ai-add"
                    onClick={handleAddAiText}
                    disabled={isSavingNote}
                    title="Append AI text to original note"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>

                  <button
                    type="button"
                    className="btn-ai-action btn-ai-apply"
                    onClick={handleApplyAiText}
                    disabled={isSavingNote}
                    title="Replace original note with AI text"
                  >
                    <Check size={14} />
                    <span>Replace</span>
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
              disabled={isSavingNote || isAiLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSavingNote || isAiLoading}
            >
              {isSavingNote ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Note</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesModal;
