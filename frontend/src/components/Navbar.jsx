import React from 'react';
import { Loader2, LogOut, Menu, RotateCcw, X } from 'lucide-react';

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
  isLoggingOut,
  setAuthError,
  setAuthForm,
  setIsResetModalOpen
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
                <button
                  className="btn btn-secondary text-danger-hover"
                  onClick={() => setIsResetModalOpen(true)}
                  title="Reset Sheet Progress"
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Progress</span>
                </button>
                <button className="btn-logout" onClick={handleLogout} title="Log out from LeetTracker" disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <>
                      <Loader2 size={14} className="spinner" style={{ marginRight: '0.4rem' }} />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut size={14} style={{ marginRight: '0.4rem' }} />
                      <span>Log Out</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('login'); }}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('signup'); }}
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
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
