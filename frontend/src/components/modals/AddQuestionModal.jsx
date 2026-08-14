import React from 'react';
import { Award, Clock, Code, ExternalLink, FolderOpen, PlusCircle, X, Youtube } from 'lucide-react';

const AddQuestionModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  addForm,
  setAddForm,
  handleAddSubmit,
  topicsList,
  isApiCalling
}) => {
  if (!isAddModalOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <PlusCircle className="modal-header-icon text-accent" size={24} />
            <h2>Add New Question</h2>
          </div>
          <button className="modal-close btn-close-modal" onClick={() => setIsAddModalOpen(false)} disabled={isApiCalling}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleAddSubmit}>
          <div className="modal-body">
            <div className="modal-form-grid">
              <div className="form-group grid-full">
                <label htmlFor="input-name" className="form-label-with-icon">
                  <Code size={14} />
                  <span>Question Title</span>
                </label>
                <input
                  type="text"
                  id="input-name"
                  placeholder="e.g., Two Sum, Reverse Linked List"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="input-topic" className="form-label-with-icon">
                  <FolderOpen size={14} />
                  <span>Topic Name</span>
                </label>
                <input
                  type="text"
                  id="input-topic"
                  placeholder="e.g., Arrays & Hashing..."
                  required
                  list="existing-topics-react"
                  value={addForm.topic}
                  onChange={(e) => setAddForm(prev => ({ ...prev, topic: e.target.value }))}
                />
                <datalist id="existing-topics-react">
                  {topicsList.map(topic => (
                    <option key={topic} value={topic} />
                  ))}
                </datalist>
                <span className="input-helper">Select or type a new topic.</span>
              </div>

              <div className="form-group">
                <label htmlFor="input-difficulty" className="form-label-with-icon">
                  <Award size={14} />
                  <span>Difficulty</span>
                </label>
                <select
                  id="input-difficulty"
                  className="custom-select"
                  required
                  value={addForm.difficulty}
                  onChange={(e) => setAddForm(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group grid-full">
                <label htmlFor="input-link" className="form-label-with-icon">
                  <ExternalLink size={14} />
                  <span>Question Link (URL)</span>
                </label>
                <input
                  type="url"
                  id="input-link"
                  placeholder="https://leetcode.com/problems/..."
                  required
                  value={addForm.link}
                  onChange={(e) => setAddForm(prev => ({ ...prev, link: e.target.value }))}
                />
              </div>

              <div className="form-group grid-full">
                <label htmlFor="input-youtube" className="form-label-with-icon">
                  <Youtube size={14} className="youtube-icon-red" />
                  <span>YouTube Link</span>
                </label>
                <input
                  type="url"
                  id="input-youtube"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={addForm.youtube}
                  onChange={(e) => setAddForm(prev => ({ ...prev, youtube: e.target.value }))}
                />
              </div>

              <div className="form-group grid-full">
                <label htmlFor="input-timetaken" className="form-label-with-icon">
                  <Clock size={14} />
                  <span>Time Taken (in minutes)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  id="input-timetaken"
                  placeholder="e.g., 25 or 12.5"
                  value={addForm.timeTaken}
                  onChange={(e) => setAddForm(prev => ({ ...prev, timeTaken: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)} disabled={isApiCalling}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isApiCalling}>Save Question</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
