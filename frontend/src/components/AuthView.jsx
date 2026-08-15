import React from 'react';
import { Key, Loader2, User } from 'lucide-react';

const AuthView = ({
  currentView,
  setCurrentView,
  authForm,
  setAuthForm,
  authError,
  setAuthError,
  authLoading,
  handleAuthSubmit,
  isApiCalling
}) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{currentView === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {currentView === 'login'
              ? 'Sign in to access your custom DSA sheet progress.'
              : 'Start tracking your LeetCode goals with isolated metrics.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={(e) => handleAuthSubmit(e, currentView)}>
          {authError && <div className="auth-error">{authError}</div>}

          <div className="form-group">
            <label htmlFor="auth-username">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="auth-username"
                placeholder="Enter your username"
                required
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                value={authForm.username}
                onChange={(e) => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
              />
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="auth-password"
                placeholder="Enter your password (min 6 chars)"
                required
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
              />
              <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={authLoading || isApiCalling}>
            {authLoading || isApiCalling ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>{currentView === 'login' ? 'Logging in...' : 'Creating account...'}</span>
              </>
            ) : (
              <span>{currentView === 'login' ? 'Access Dashboard' : 'Generate Account'}</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          {currentView === 'login' ? (
            <p className="auth-switch-text">
              New to LeetTracker?{' '}
              <span className="auth-link" onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('signup'); }}>
                Create Account
              </span>
            </p>
          ) : (
            <p className="auth-switch-text">
              Already registered?{' '}
              <span className="auth-link" onClick={() => { setAuthError(''); setAuthForm({ username: '', password: '' }); setCurrentView('login'); }}>
                Log In
              </span>
            </p>
          )}
          <div className="auth-back-home">
            <span className="auth-link back-link" onClick={() => setCurrentView('landing')}>
              ← Back to Home
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
