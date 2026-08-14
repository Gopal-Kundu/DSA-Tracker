import React from 'react';
import { Folder, FolderOpen } from 'lucide-react';

const FoldersGrid = ({ foldersData, setActiveFolder }) => {
  if (foldersData.length === 0) {
    return (
      <div className="empty-state">
        <FolderOpen className="empty-state-icon" size={48} />
        <h3>Your DSA revision sheet is empty</h3>
        <p>Start curating your personal DSA roadmap by clicking the "Add Question" button above.</p>
      </div>
    );
  }

  return (
    <div className="folders-grid">
      {foldersData.map(folder => {
        const percent = folder.total > 0 ? Math.round((folder.solved / folder.total) * 100) : 0;
        return (
          <div key={folder.name} className="folder-card" onClick={() => setActiveFolder(folder.name)}>
            <div className="folder-card-glow"></div>
            <div className="folder-card-header">
              <div className="folder-icon-wrapper">
                <Folder size={32} className="folder-icon" />
              </div>
              <span className="folder-badge">{folder.total} Qs</span>
            </div>
            <div className="folder-card-content">
              <h3 className="folder-title" title={folder.name}>{folder.name}</h3>
              <div className="folder-stats">
                <span className="folder-stat-text">{folder.solved}/{folder.total} Solved</span>
                <span className="folder-stat-percent">{percent}%</span>
              </div>
              <div className="folder-progress-bar">
                <div className="folder-progress-fill" style={{ width: `${percent}%` }}></div>
              </div>
              <div className="folder-difficulty-distribution">
                {folder.easy > 0 && <span className="dist-badge easy">{folder.easy} Easy</span>}
                {folder.medium > 0 && <span className="dist-badge medium">{folder.medium} Med</span>}
                {folder.hard > 0 && <span className="dist-badge hard">{folder.hard} Hard</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FoldersGrid;
