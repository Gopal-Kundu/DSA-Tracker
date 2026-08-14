import React from 'react';
import { ArrowLeft, FolderOpen, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
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
  const { loading, initialFetched } = useSelector((state) => state.questions);

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

      {/* Show Loading state ONLY during 1st question API call after login */}
      {loading && !initialFetched ? (
        <div className="empty-state">
          <Loader2 className="spinner text-accent" size={40} />
          <h3 style={{ marginTop: '0.75rem' }}>Loading...</h3>
          <p>Fetching questions from the server...</p>
        </div>
      ) : questionsToRender.length === 0 ? (
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
        <div className="questions-table-container" style={{ transition: 'opacity 0.2s ease', opacity: loading ? 0.6 : 1 }}>
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
                isApiCalling={isApiCalling || loading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(QuestionTable);
