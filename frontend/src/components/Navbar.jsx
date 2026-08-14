import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = ({
  isAuthenticated,
  currentView,
  setCurrentView,
  username,
  stats,
  circleCircumference,
  strokeDashoffset,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isApiCalling,
  setAuthError,
  setAuthForm
}) => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <div
            className="logo-group"
            onClick={() => !isAuthenticated && setCurrentView('landing')}
            style={{ cursor: !isAuthenticated ? 'pointer' : 'default' }}
          >
            <h1>LeetTracker</h1>
          </div>

          {isAuthenticated && currentView === 'dashboard' && (
            <div className="header-meta desktop-only">
              <div className="meta-item">
                <span className="meta-label">Total Questions</span>
                <span className="meta-val">{stats.total}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Topics Available</span>
                <span className="meta-val">{stats.totalTopics}</span>
              </div>
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="desktop-nav">
            {isAuthenticated && currentView === 'dashboard' ? (
              <div className="header-user-info">
                {/* Progress Circle */}
                <div className="progress-radial-wrapper" style={{ marginRight: '1rem' }}>
                  <div className="radial-svg-container">
                    <svg viewBox="0 0 80 80">
                      <circle className="circle-bg" cx="40" cy="40" r="34" />
                      <circle
                        className="circle-fill"
                        cx="40"
                        cy="40"
                        r="34"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="radial-label-inner">
                      <span className="radial-percent">{stats.percentage}%</span>
                      <span className="radial-sub">SOLVED</span>
                    </div>
                  </div>
                  <div className="progress-details">
                    <span className="progress-fraction">{stats.solved} / {stats.total} Done</span>
                  </div>
                </div>

                <span className="username-display">@{username}</span>
                <button className="btn-logout" onClick={handleLogout} title="Log out from LeetTracker" disabled={isApiCalling}>
                  <LogOut size={14} style={{ marginRight: '0.4rem' }} /> Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('login'); }}
                  disabled={isApiCalling}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('signup'); }}
                  disabled={isApiCalling}
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            disabled={isApiCalling}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
