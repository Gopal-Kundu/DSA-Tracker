import React from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown, FolderOpen, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import QuestionRow from './QuestionRow';

const QuestionTable = ({
  questionsToRender,
  viewMode,
  activeFolder,
  setActiveFolder,
  filters,
  setFilters,
  toggleQuestionStatus,
  openNotesModal,
  handleUpdateRevisions,
  handleEditClick,
  handleDeleteClick
}) => {
  const { loading, initialFetched } = useSelector((state) => state.questions);
  const currentSort = filters?.sort || 'none';

  const handleSortClick = (columnKey) => {
    setFilters(prev => {
      let nextSort = 'none';
      if (columnKey === 'status') {
        nextSort = prev.sort === 'status-solved' ? 'status-unsolved' : 'status-solved';
      } else if (columnKey === 'name') {
        nextSort = prev.sort === 'name-asc' ? 'name-desc' : 'name-asc';
      } else if (columnKey === 'diff') {
        nextSort = prev.sort === 'diff-asc' ? 'diff-desc' : 'diff-asc';
      } else if (columnKey === 'time') {
        nextSort = prev.sort === 'time-asc' ? 'time-desc' : 'time-asc';
      } else if (columnKey === 'rev') {
        nextSort = prev.sort === 'rev-desc' ? 'rev-asc' : 'rev-desc';
      }
      return { ...prev, sort: nextSort };
    });
  };

  const renderSortIcon = (columnKey) => {
    if (columnKey === 'status') {
      if (currentSort === 'status-solved') return <ArrowDown size={14} className="sort-icon-active" />;
      if (currentSort === 'status-unsolved') return <ArrowUp size={14} className="sort-icon-active" />;
    } else if (columnKey === 'name') {
      if (currentSort === 'name-asc') return <ArrowUp size={14} className="sort-icon-active" />;
      if (currentSort === 'name-desc') return <ArrowDown size={14} className="sort-icon-active" />;
    } else if (columnKey === 'diff') {
      if (currentSort === 'diff-asc') return <ArrowUp size={14} className="sort-icon-active" />;
      if (currentSort === 'diff-desc') return <ArrowDown size={14} className="sort-icon-active" />;
    } else if (columnKey === 'time') {
      if (currentSort === 'time-asc') return <ArrowUp size={14} className="sort-icon-active" />;
      if (currentSort === 'time-desc') return <ArrowDown size={14} className="sort-icon-active" />;
    } else if (columnKey === 'rev') {
      if (currentSort === 'rev-desc') return <ArrowDown size={14} className="sort-icon-active" />;
      if (currentSort === 'rev-asc') return <ArrowUp size={14} className="sort-icon-active" />;
    }
    return <ArrowUpDown size={12} className="sort-icon-neutral" />;
  };

  return (
    <div>
      {viewMode === 'folder' && activeFolder && (
        <div className="folder-detail-header">
          <button className="btn btn-secondary btn-back" onClick={() => setActiveFolder(null)}>
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
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="questions-table-container" style={{ transition: 'opacity 0.2s ease', opacity: loading ? 0.6 : 1 }}>
          <div className="questions-table-header">
            <div
              className={`col-status clickable-header ${currentSort.startsWith('status') ? 'active-sort' : ''}`}
              onClick={() => handleSortClick('status')}
              title="Click to sort by solved status"
            >
              <span>Status</span>
              {renderSortIcon('status')}
            </div>
            <div
              className={`col-title clickable-header ${currentSort.startsWith('name') ? 'active-sort' : ''}`}
              onClick={() => handleSortClick('name')}
              title="Click to sort alphabetically by title"
            >
              <span>Title</span>
              {renderSortIcon('name')}
            </div>
            <div className="col-topic">Topic</div>
            <div className="col-notes">Notes</div>
            <div
              className={`col-difficulty clickable-header ${currentSort.startsWith('diff') ? 'active-sort' : ''}`}
              onClick={() => handleSortClick('diff')}
              title="Click to sort by difficulty (Easy to Hard)"
            >
              <span>Difficulty</span>
              {renderSortIcon('diff')}
            </div>
            <div
              className={`col-timetaken clickable-header ${currentSort.startsWith('time') ? 'active-sort' : ''}`}
              onClick={() => handleSortClick('time')}
              title="Click to sort by time taken"
            >
              <span>Time Taken</span>
              {renderSortIcon('time')}
            </div>
            <div className="col-youtube">YouTube</div>
            <div
              className={`col-revisions clickable-header ${currentSort.startsWith('rev') ? 'active-sort' : ''}`}
              onClick={() => handleSortClick('rev')}
              title="Click to sort by revision count"
            >
              <span>Revisions</span>
              {renderSortIcon('rev')}
            </div>
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(QuestionTable);
