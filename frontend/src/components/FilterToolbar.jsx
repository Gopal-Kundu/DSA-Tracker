import React from 'react';
import { Folder, List, PlusCircle, Search } from 'lucide-react';

const FilterToolbar = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  setActiveFolder,
  topicsList,
  setIsAddModalOpen,
  setIsResetModalOpen,
  isApiCalling
}) => {
  return (
    <>
      {/* Search Bar Row */}
      <div className="search-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search question name or topic..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      {/* Toolbar & Filters */}
      <section className="board-toolbar">
        <div className="filter-options">
          <div className="filter-left-group">
            {/* View Toggle Mode */}
            <div className="view-toggle-buttons">
              <button
                className={`btn-toggle ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => { setViewMode('table'); setActiveFolder(null); }}
                title="List View"
                disabled={isApiCalling}
              >
                <List size={14} />
                <span>List</span>
              </button>
              <button
                className={`btn-toggle ${viewMode === 'folder' ? 'active' : ''}`}
                onClick={() => { setViewMode('folder'); setActiveFolder(null); }}
                title="Folder View"
                disabled={isApiCalling}
              >
                <Folder size={14} />
                <span>Folders</span>
              </button>
            </div>

            {viewMode !== 'folder' && (
              <select
                value={filters.topic}
                onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                className="custom-select"
              >
                <option value="all">All Topics</option>
                {topicsList.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            )}

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="custom-select"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="custom-select"
            >
              <option value="all">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="custom-select"
            >
              <option value="none">Sort: Newest First</option>
              <option value="created-asc">Sort: Oldest First</option>
              <option value="name-asc">Title (A to Z)</option>
              <option value="name-desc">Title (Z to A)</option>
              <option value="diff-asc">Difficulty (Easy → Hard)</option>
              <option value="diff-desc">Difficulty (Hard → Easy)</option>
              <option value="time-asc">Time Taken (Low to High)</option>
              <option value="time-desc">Time Taken (High to Low)</option>
              <option value="rev-desc">Revisions (High to Low)</option>
              <option value="rev-asc">Revisions (Low to High)</option>
              <option value="status-solved">Status (Solved First)</option>
              <option value="status-unsolved">Status (Unsolved First)</option>
            </select>

            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)} disabled={isApiCalling}>
              <PlusCircle className="mini-icon" size={16} /> Add Question
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default React.memo(FilterToolbar);
