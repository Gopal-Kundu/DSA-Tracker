import React from 'react';
import { Award, Clock, Code, Edit, ExternalLink, FolderOpen, Loader2, X, Youtube } from 'lucide-react';

const EditQuestionModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editForm,
  setEditForm,
  handleEditSubmit,
  topicsList,
  isApiCalling
}) => {
  if (!isEditModalOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <Edit className="modal-header-icon text-accent" size={24} />
            <h2>Edit Question</h2>
          </div>
          <button className="modal-close btn-close-modal" onClick={() => setIsEditModalOpen(false)} disabled={isApiCalling}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleEditSubmit}>
          <div className="modal-body">
            <div className="modal-form-grid">
              <div className="form-group grid-full">
                <label htmlFor="edit-name" className="form-label-with-icon">
                  <Code size={14} />
                  <span>Question Title</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  placeholder="e.g., Two Sum, Reverse Linked List"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-topic" className="form-label-with-icon">
                  <FolderOpen size={14} />
                  <span>Topic Name</span>
                </label>
                <input
                  type="text"
                  id="edit-topic"
                  placeholder="e.g., Arrays & Hashing..."
                  required
                  list="existing-topics-react"
                  value={editForm.topic}
                  onChange={(e) => setEditForm(prev => ({ ...prev, topic: e.target.value }))}
                />
                <span className="input-helper">Select or type a new topic.</span>
              </div>

              <div className="form-group">
                <label htmlFor="edit-difficulty" className="form-label-with-icon">
                  <Award size={14} />
                  <span>Difficulty</span>
                </label>
                <select
                  id="edit-difficulty"
                  className="custom-select"
                  required
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group grid-full">
                <label htmlFor="edit-link" className="form-label-with-icon">
                  <ExternalLink size={14} />
                  <span>Question Link (URL)</span>
                </label>
                <input
                  type="url"
                  id="edit-link"
                  placeholder="https://leetcode.com/problems/..."
                  required
                  value={editForm.link}
                  onChange={(e) => setEditForm(prev => ({ ...prev, link: e.target.value }))}
                />
              </div>

              <div className="form-group grid-full">
                <label htmlFor="edit-youtube" className="form-label-with-icon">
                  <Youtube size={14} className="youtube-icon-red" />
                  <span>YouTube Link (Optional)</span>
                </label>
                <input
                  type="url"
                  id="edit-youtube"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editForm.youtube}
                  onChange={(e) => setEditForm(prev => ({ ...prev, youtube: e.target.value }))}
                />
              </div>

              <div className="form-group grid-full">
                <label htmlFor="edit-timetaken" className="form-label-with-icon">
                  <Clock size={14} />
                  <span>Time Taken (in minutes)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  id="edit-timetaken"
                  placeholder="e.g., 25 or 12.5"
                  value={editForm.timeTaken}
                  onChange={(e) => setEditForm(prev => ({ ...prev, timeTaken: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)} disabled={isApiCalling}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isApiCalling}>
              {isApiCalling ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Question</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
