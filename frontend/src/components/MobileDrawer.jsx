import React from 'react';
import { Loader2, LogOut, RotateCcw, X } from 'lucide-react';

const MobileDrawer = ({
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
    <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
      <div className="drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className="drawer-content">
        <div className="drawer-header">
          <div className="logo-group">
            <h1>LeetTracker</h1>
          </div>
          <button className="btn-close-drawer" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {isAuthenticated && currentView === 'dashboard' ? (
            <div className="drawer-user-section">
              <div className="drawer-user-meta">
                <span className="username-display">@{username}</span>
              </div>

              {/* Progress Circle in Drawer */}
              <div className="progress-radial-wrapper drawer-progress">
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

              <button
                className="btn btn-secondary text-danger-hover"
                onClick={() => { setIsResetModalOpen(true); setIsMobileMenuOpen(false); }}
                style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <RotateCcw size={16} />
                <span>Reset Progress</span>
              </button>

              <button
                className="btn btn-danger btn-logout-drawer"
                onClick={handleLogout}
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="drawer-auth-actions">
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('login'); setIsMobileMenuOpen(false); }}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('signup'); setIsMobileMenuOpen(false); }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
