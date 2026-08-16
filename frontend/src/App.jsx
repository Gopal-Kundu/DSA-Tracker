import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { baseURL } from './config';

// Import Redux Actions
import {
  setQuestionsData,
  setLoading as setReduxLoading,
  setError,
  setFilters as setReduxFilters,
  setCurrentPage,
  setViewMode as setReduxViewMode,
  setActiveFolder as setReduxActiveFolder,
  resetQuestionsState,
  updateLocalQuestionDone,
  updateLocalRevisions,
  updateLocalNotes,
  removeLocalQuestion,
  addLocalQuestion,
  editLocalQuestion
} from './store/questionSlice';

// Import Modular Components
import Navbar from './components/Navbar';
import MobileDrawer from './components/MobileDrawer';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import HeroStats from './components/HeroStats';
import FilterToolbar from './components/FilterToolbar';
import FoldersGrid from './components/FoldersGrid';
import QuestionTable from './components/QuestionTable';
import Pagination from './components/Pagination';

// Import Modals
import AddQuestionModal from './components/modals/AddQuestionModal';
import EditQuestionModal from './components/modals/EditQuestionModal';
import NotesModal from './components/modals/NotesModal';
import ResetModal from './components/modals/ResetModal';

function App() {
  const dispatch = useDispatch();

  // Redux Store Selectors
  const {
    questions,
    totalQuestions,
    totalPages,
    currentPage,
    limit,
    loading: questionsLoading,
    filters,
    stats,
    topicsList,
    viewMode,
    activeFolder
  } = useSelector((state) => state.questions);

  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitialAuthChecking, setIsInitialAuthChecking] = useState(true);

  // Auth Form State
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Custom fetch helper that includes credentials (HTTP cookies)
  const customFetch = useCallback(async (url, options = {}) => {
    return await fetch(url, {
      ...options,
      credentials: 'include'
    });
  }, []);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteModalData, setNoteModalData] = useState({ id: '', name: '', topic: '', notes: '' });

  // Form States
  const [addForm, setAddForm] = useState({
    topic: '',
    name: '',
    link: '',
    difficulty: 'Medium',
    youtube: '',
    timeTaken: '',
    notes: ''
  });

  const [editForm, setEditForm] = useState({
    id: '',
    topic: '',
    name: '',
    link: '',
    difficulty: 'Medium',
    youtube: '',
    timeTaken: '',
    notes: ''
  });

  // Fetch questions from API and update Redux Store
  const fetchQuestions = useCallback(async (overrides = {}) => {
    const currentFilters = overrides.filters || filters;
    const page = overrides.page ?? currentPage;
    const effectiveTopic = (viewMode === 'folder' && activeFolder) ? activeFolder : currentFilters.topic;

    dispatch(setReduxLoading(true));
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        search: currentFilters.search.trim(),
        topic: effectiveTopic,
        difficulty: currentFilters.difficulty,
        status: currentFilters.status,
        sort: currentFilters.sort
      });

      const response = await customFetch(`${baseURL}/api/questions?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setQuestionsData(data));
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setUsername('');
        setCurrentView('landing');
        dispatch(resetQuestionsState());
        showToast("Session expired. Please log in again.", "warning");
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast("Could not retrieve questions. Server connection error.", "warning");
      dispatch(setError(error.message));
    } finally {
      dispatch(setReduxLoading(false));
    }
  }, [customFetch, dispatch, filters, currentPage, limit, viewMode, activeFolder, showToast]);

  // Fetch questions whenever filters, view mode, or active folder changes (debounced 300ms)
  useEffect(() => {
    if (isAuthenticated && currentView === 'dashboard') {
      const timer = setTimeout(() => {
        fetchQuestions();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, currentView, filters, viewMode, activeFolder, fetchQuestions]);

  // Verify session cookie once on initial mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsInitialAuthChecking(true);
        const response = await customFetch(`${baseURL}/api/auth/me`);
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user.username);
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        } else {
          setIsAuthenticated(false);
          setUsername('');
          setCurrentView('landing');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthenticated(false);
        setUsername('');
        setCurrentView('landing');
      } finally {
        setIsInitialAuthChecking(false);
      }
    };

    checkAuthStatus();
  }, [customFetch]);

  // Helper setter for filters to dispatch to Redux
  const handleSetFilters = useCallback((newFiltersOrUpdater) => {
    if (typeof newFiltersOrUpdater === 'function') {
      const nextFilters = newFiltersOrUpdater(filters);
      dispatch(setReduxFilters(nextFilters));
    } else {
      dispatch(setReduxFilters(newFiltersOrUpdater));
    }
  }, [dispatch, filters]);

  const handleSetViewMode = useCallback((mode) => {
    dispatch(setReduxViewMode(mode));
  }, [dispatch]);

  const handleSetActiveFolder = useCallback((folder) => {
    dispatch(setReduxActiveFolder(folder));
  }, [dispatch]);

  // Auth Handlers
  const handleAuthSubmit = useCallback(async (e, type) => {
    e.preventDefault();
    setAuthError('');

    if (!authForm.username.trim() || !authForm.password) {
      setAuthError('All fields are required.');
      return;
    }

    setAuthLoading(true);
    try {
      const endpoint = type === 'login' ? 'login' : 'signup';
      const response = await customFetch(`${baseURL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: authForm.username.trim(),
          password: authForm.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        setUsername(data.user.username);
        setIsAuthenticated(true);
        setAuthForm({ username: '', password: '' });
        setCurrentView('dashboard');
        fetchQuestions({ page: 1 });
        showToast(
          type === 'login'
            ? `Welcome back, ${data.user.username}!`
            : `Account created successfully! Welcome, ${data.user.username}!`,
          "success"
        );
      } else {
        setAuthError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('Connection failed. Please check if the server is running.');
    } finally {
      setAuthLoading(false);
    }
  }, [authForm, customFetch, fetchQuestions, showToast]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await customFetch(`${baseURL}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUsername('');
      dispatch(resetQuestionsState());
      setCurrentView('landing');
      setIsMobileMenuOpen(false);
      setIsLoggingOut(false);
      showToast("Logged out successfully.", "info");
    }
  }, [customFetch, dispatch, showToast]);

  // Questions to render based on Folder selection
  const questionsToRender = useMemo(() => {
    if (viewMode === 'folder' && activeFolder) {
      return questions.filter(q => q.topic === activeFolder);
    }
    return questions;
  }, [questions, viewMode, activeFolder]);

  // Folders Aggregated Data for Folder View
  const foldersData = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      if (!map[q.topic]) {
        map[q.topic] = { name: q.topic, total: 0, solved: 0, easy: 0, medium: 0, hard: 0 };
      }
      map[q.topic].total += 1;
      if (q.done) map[q.topic].solved += 1;
      if (q.difficulty === 'Easy') map[q.topic].easy += 1;
      if (q.difficulty === 'Medium') map[q.topic].medium += 1;
      if (q.difficulty === 'Hard') map[q.topic].hard += 1;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [questions]);

  // Toggle question solved status
  const toggleQuestionStatus = useCallback(async (id) => {
    const question = questions.find(q => (q._id || q.id) === id);
    if (!question) return;

    const nextDone = !question.done;
    dispatch(updateLocalQuestionDone({ id, nextDone }));

    try {
      const response = await customFetch(`${baseURL}/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: nextDone })
      });
      if (response.ok) {
        showToast(nextDone ? "Marked as solved!" : "Marked as unsolved.", "info");
        fetchQuestions();
      } else {
        dispatch(updateLocalQuestionDone({ id, nextDone: !nextDone }));
        showToast("Failed to update status on server.", "warning");
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      dispatch(updateLocalQuestionDone({ id, nextDone: !nextDone }));
      showToast("Network error updating question status.", "warning");
    }
  }, [questions, customFetch, dispatch, showToast, fetchQuestions]);

  // Save Notes handler
  const handleSaveNotes = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!noteModalData.id) return;

    try {
      const response = await customFetch(`${baseURL}/api/questions/${noteModalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: noteModalData.notes })
      });

      if (response.ok) {
        dispatch(updateLocalNotes({ id: noteModalData.id, notes: noteModalData.notes }));
        setIsNoteModalOpen(false);
        showToast(`Note saved for "${noteModalData.name}"`, "success");
      } else {
        showToast("Failed to save note.", "warning");
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      showToast("Network error saving note.", "warning");
    }
  }, [noteModalData, customFetch, dispatch, showToast]);

  const openNotesModal = useCallback((q) => {
    setNoteModalData({
      id: q._id || q.id,
      name: q.name,
      topic: q.topic,
      notes: q.notes || ''
    });
    setIsNoteModalOpen(true);
  }, []);

  // Add Question Submission
  const handleAddSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!addForm.name.trim() || !addForm.topic.trim() || !addForm.link.trim()) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    try {
      const response = await customFetch(`${baseURL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: addForm.name.trim(),
          topic: addForm.topic.trim(),
          difficulty: addForm.difficulty,
          link: addForm.link.trim(),
          youtube: addForm.youtube.trim(),
          timeTaken: addForm.timeTaken ? parseFloat(addForm.timeTaken) : null,
          notes: addForm.notes.trim()
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const newQuestion = resData.question || resData;
        dispatch(addLocalQuestion(newQuestion));
        setIsAddModalOpen(false);
        setAddForm({
          topic: '',
          name: '',
          link: '',
          difficulty: 'Medium',
          youtube: '',
          timeTaken: '',
          notes: ''
        });
        showToast(`Added "${newQuestion.name}" to your sheet.`, "success");
        fetchQuestions();
      } else {
        const err = await response.json();
        showToast(err.error || "Failed to add question.", "warning");
      }
    } catch (error) {
      console.error('Error adding question:', error);
      showToast("Server error adding question.", "warning");
    }
  }, [addForm, customFetch, dispatch, showToast, fetchQuestions]);

  // Open Edit Modal
  const handleEditClick = useCallback((question) => {
    setEditForm({
      id: question._id || question.id,
      name: question.name,
      topic: question.topic,
      difficulty: question.difficulty,
      link: question.link,
      youtube: question.youtube || '',
      timeTaken: question.timeTaken ? question.timeTaken.toString() : '',
      notes: question.notes || ''
    });
    setIsEditModalOpen(true);
  }, []);

  // Edit Question Submission
  const handleEditSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editForm.name.trim() || !editForm.topic.trim() || !editForm.link.trim()) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    try {
      const response = await customFetch(`${baseURL}/api/questions/${editForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          topic: editForm.topic.trim(),
          difficulty: editForm.difficulty,
          link: editForm.link.trim(),
          youtube: editForm.youtube.trim(),
          timeTaken: editForm.timeTaken ? parseFloat(editForm.timeTaken) : null,
          notes: editForm.notes.trim()
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const updatedQuestion = resData.question || resData;
        dispatch(editLocalQuestion(updatedQuestion));
        setIsEditModalOpen(false);
        showToast(`Updated "${updatedQuestion.name}".`, "success");
        fetchQuestions();
      } else {
        const err = await response.json();
        showToast(err.error || "Failed to update question.", "warning");
      }
    } catch (error) {
      console.error('Error updating question:', error);
      showToast("Server error updating question.", "warning");
    }
  }, [editForm, customFetch, dispatch, showToast, fetchQuestions]);

  // Delete Question
  const handleDeleteClick = useCallback(async (question) => {
    const qId = question._id || question.id;
    if (!window.confirm(`Are you sure you want to delete "${question.name}"?`)) return;

    try {
      const response = await customFetch(`${baseURL}/api/questions/${qId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        dispatch(removeLocalQuestion(qId));
        showToast(`Deleted "${question.name}".`, "info");
        fetchQuestions();
      } else {
        showToast("Failed to delete question.", "warning");
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast("Server error deleting question.", "warning");
    }
  }, [customFetch, dispatch, showToast, fetchQuestions]);

  // Revisions Counter Increments / Decrements
  const handleUpdateRevisions = useCallback(async (id, nextRevisions) => {
    if (nextRevisions < 0) return;
    dispatch(updateLocalRevisions({ id, revisions: nextRevisions }));

    try {
      const response = await customFetch(`${baseURL}/api/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ revisions: nextRevisions })
      });

      if (!response.ok) {
        showToast("Failed to update revision count.", "warning");
      }
    } catch (error) {
      console.error('Error updating revisions:', error);
    }
  }, [customFetch, dispatch, showToast]);

  // Confirm Reset Sheet Progress
  const handleResetConfirm = useCallback(async () => {
    try {
      const response = await customFetch(`${baseURL}/api/questions/reset`, {
        method: 'POST'
      });

      if (response.ok) {
        setIsResetModalOpen(false);
        showToast("Sheet progress reset successfully.", "info");
        fetchQuestions({ page: 1 });
      } else {
        showToast("Failed to reset progress.", "warning");
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      showToast("Server error resetting progress.", "warning");
    }
  }, [customFetch, showToast, fetchQuestions]);

  // Radial Progress Circle math
  const circleCircumference = 2 * Math.PI * 34;
  const strokeDashoffset = circleCircumference - (stats.percentage / 100) * circleCircumference;

  return (
    <div className="app-layout">
      <Navbar
        isAuthenticated={isAuthenticated}
        currentView={currentView}
        setCurrentView={setCurrentView}
        username={username}
        stats={stats}
        circleCircumference={circleCircumference}
        strokeDashoffset={strokeDashoffset}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLoggingOut={isLoggingOut}
        setAuthError={setAuthError}
        setAuthForm={setAuthForm}
        setIsResetModalOpen={setIsResetModalOpen}
      />

      <MobileDrawer
        isAuthenticated={isAuthenticated}
        currentView={currentView}
        setCurrentView={setCurrentView}
        username={username}
        stats={stats}
        circleCircumference={circleCircumference}
        strokeDashoffset={strokeDashoffset}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLoggingOut={isLoggingOut}
        setAuthError={setAuthError}
        setAuthForm={setAuthForm}
        setIsResetModalOpen={setIsResetModalOpen}
      />

      <main className="main-content">
        {isInitialAuthChecking ? (
          <div className="loading-state">
            <div className="loading-spinner-wrapper">
              <Loader2 className="spinner text-accent" size={44} />
            </div>
            <h3>Loading LeetTracker</h3>
            <p>Syncing your personal DSA progress and revision sheet from the server...</p>
          </div>
        ) : (
          <>
            {currentView === 'landing' && (
              <LandingView setCurrentView={setCurrentView} />
            )}

            {(currentView === 'login' || currentView === 'signup') && (
              <AuthView
                currentView={currentView}
                setCurrentView={setCurrentView}
                authForm={authForm}
                setAuthForm={setAuthForm}
                authError={authError}
                setAuthError={setAuthError}
                authLoading={authLoading}
                handleAuthSubmit={handleAuthSubmit}
              />
            )}

            {currentView === 'dashboard' && (
              <>
                <HeroStats stats={stats} />

                <FilterToolbar
                  filters={filters}
                  setFilters={handleSetFilters}
                  viewMode={viewMode}
                  setViewMode={handleSetViewMode}
                  setActiveFolder={handleSetActiveFolder}
                  setIsAddModalOpen={setIsAddModalOpen}
                  setIsResetModalOpen={setIsResetModalOpen}
                  topicsList={topicsList}
                />

                {viewMode === 'folder' && !activeFolder ? (
                  <FoldersGrid
                    foldersData={foldersData}
                    setActiveFolder={handleSetActiveFolder}
                  />
                ) : (
                  <>
                    <QuestionTable
                      questionsToRender={questionsToRender}
                      viewMode={viewMode}
                      activeFolder={activeFolder}
                      setActiveFolder={handleSetActiveFolder}
                      filters={filters}
                      setFilters={handleSetFilters}
                      toggleQuestionStatus={toggleQuestionStatus}
                      openNotesModal={openNotesModal}
                      handleUpdateRevisions={handleUpdateRevisions}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                    <Pagination onPageChange={(page) => fetchQuestions({ page })} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AddQuestionModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        addForm={addForm}
        setAddForm={setAddForm}
        handleAddSubmit={handleAddSubmit}
        topicsList={topicsList}
      />

      <EditQuestionModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditSubmit={handleEditSubmit}
        topicsList={topicsList}
      />

      <NotesModal
        isNoteModalOpen={isNoteModalOpen}
        setIsNoteModalOpen={setIsNoteModalOpen}
        noteModalData={noteModalData}
        setNoteModalData={setNoteModalData}
        handleSaveNotes={handleSaveNotes}
        customFetch={customFetch}
        showToast={showToast}
      />


      <ResetModal
        isResetModalOpen={isResetModalOpen}
        setIsResetModalOpen={setIsResetModalOpen}
        handleResetConfirm={handleResetConfirm}
      />

      <ToastContainer toasts={toasts} setToasts={setToasts} />

      <Footer />
    </div>
  );
}

export default App;
