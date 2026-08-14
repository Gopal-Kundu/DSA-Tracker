import React from 'react';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import QuestionRow from './QuestionRow';

const QuestionTable = ({
  questionsToRender,
  viewMode,
  activeFolder,
  setActiveFolder,
  setFilters,
  toggleQuestionStatus,
  openNotesModal,
  handleUpdateRevisions,
  handleEditClick,
  handleDeleteClick,
  isApiCalling
}) => {
  return (
    <div>
      {viewMode === 'folder' && activeFolder && (
        <div className="folder-detail-header">
          <button className="btn btn-secondary btn-back" onClick={() => setActiveFolder(null)} disabled={isApiCalling}>
            <ArrowLeft size={16} /> Back to Folders
          </button>
          <div className="folder-path">
            <span className="path-parent" onClick={() => setActiveFolder(null)}>Folders</span>
            <span className="path-separator">/</span>
            <span className="path-current">{activeFolder}</span>
          </div>
        </div>
      )}

      {questionsToRender.length === 0 ? (
        <div className="empty-state">
          <FolderOpen className="empty-state-icon" size={48} />
          <h3>No questions found</h3>
          <p>No questions match your current search or filter criteria in this view.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilters({ search: '', topic: 'all', difficulty: 'all', status: 'all', sort: 'none' });
            }}
            style={{ marginTop: '1rem' }}
            disabled={isApiCalling}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="questions-table-container">
          <div className="questions-table-header">
            <div className="col-status">Status</div>
            <div className="col-title">Title</div>
            <div className="col-topic">Topic</div>
            <div className="col-notes">Notes</div>
            <div className="col-difficulty">Difficulty</div>
            <div className="col-timetaken">Time Taken</div>
            <div className="col-youtube">YouTube</div>
            <div className="col-revisions">Revisions</div>
            <div className="col-action">Action</div>
          </div>
          <div className="questions-table-body">
            {questionsToRender.map((q) => (
              <QuestionRow
                key={q._id || q.id}
                q={q}
                toggleQuestionStatus={toggleQuestionStatus}
                openNotesModal={openNotesModal}
                handleUpdateRevisions={handleUpdateRevisions}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                isApiCalling={isApiCalling}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;
