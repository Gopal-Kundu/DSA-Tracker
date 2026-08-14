import React, { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import { FolderOpen, Loader2 } from 'lucide-react';
import './App.css';
import { baseURL } from './config';

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

// Import Modals
import AddQuestionModal from './components/modals/AddQuestionModal';
import EditQuestionModal from './components/modals/EditQuestionModal';
import NotesModal from './components/modals/NotesModal';
import ResetModal from './components/modals/ResetModal';

function App() {
  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Form State
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // LeetTracker Board State
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // API calling state tracker
  const [activeRequests, setActiveRequests] = useState(0);
  const isApiCalling = activeRequests > 0;

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
    setActiveRequests(prev => prev + 1);
    try {
      return await fetch(url, {
        ...options,
        credentials: 'include'
      });
    } finally {
      setActiveRequests(prev => Math.max(0, prev - 1));
    }
  }, []);

  const [filters, setFilters] = useState({
    search: '',
    topic: 'all',
    difficulty: 'all',
    status: 'all',
    sort: 'none'
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'folder'
  const [activeFolder, setActiveFolder] = useState(null); // name of active topic folder

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

  // Fetch questions for authenticated user
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customFetch(`${baseURL}/api/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setUsername('');
        setCurrentView('landing');
        showToast("Session expired. Please log in again.", "warning");
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast("Could not retrieve questions. Server connection error.", "warning");
    } finally {
      setLoading(false);
    }
  }, [customFetch, showToast]);

  // Verify session cookie on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customFetch(`${baseURL}/api/auth/me`);
      if (response.ok) {
        const data = await response.json();
        setUsername(data.user.username);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        fetchQuestions();
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
      setLoading(false);
    }
  }, [customFetch, fetchQuestions]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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
        fetchQuestions();
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
    try {
      await customFetch(`${baseURL}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUsername('');
      setQuestions([]);
      setCurrentView('landing');
      setIsMobileMenuOpen(false);
      showToast("Logged out successfully.", "info");
    }
  }, [customFetch, showToast]);

  // Compute stats reactively
  const stats = useMemo(() => {
    const total = questions.length;
    const solved = questions.filter(q => q.done).length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    const topicsSet = new Set(questions.map(q => q.topic));

    const difficulty = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 }
    };

    questions.forEach(q => {
      if (difficulty[q.difficulty]) {
        difficulty[q.difficulty].total += 1;
        if (q.done) {
          difficulty[q.difficulty].solved += 1;
        }
      }
    });

    return {
      total,
      solved,
      percentage,
      totalTopics: topicsSet.size,
      difficulty
    };
  }, [questions]);

  // Topic options for filter dropdown
  const topicsList = useMemo(() => {
    const set = new Set(questions.map(q => q.topic));
    return Array.from(set).sort();
  }, [questions]);

  // Non-blocking deferred search for zero-lag typing
  const deferredSearch = useDeferredValue(filters.search);

  // Filtered & Sorted questions logic
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // Apply Search Filter
    if (deferredSearch.trim() !== '') {
      const q = deferredSearch.toLowerCase().trim();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q)
      );
    }

    // Apply Topic Filter
    if (filters.topic !== 'all') {
      result = result.filter(item => item.topic === filters.topic);
    }

    // Apply Difficulty Filter
    if (filters.difficulty !== 'all') {
      result = result.filter(item => item.difficulty === filters.difficulty);
    }

    // Apply Status Filter
    if (filters.status !== 'all') {
      const isSolved = filters.status === 'solved';
      result = result.filter(item => item.done === isSolved);
    }

    // Apply Sorting Options
    if (filters.sort === 'time-asc') {
      result.sort((a, b) => (a.timeTaken || 0) - (b.timeTaken || 0));
    } else if (filters.sort === 'time-desc') {
      result.sort((a, b) => (b.timeTaken || 0) - (a.timeTaken || 0));
    } else if (filters.sort === 'rev-asc') {
      result.sort((a, b) => (a.revisions || 0) - (b.revisions || 0));
    } else if (filters.sort === 'rev-desc') {
      result.sort((a, b) => (b.revisions || 0) - (a.revisions || 0));
    }

    return result;
  }, [questions, deferredSearch, filters.topic, filters.difficulty, filters.status, filters.sort]);

  // Questions to render based on Folder selection
  const questionsToRender = useMemo(() => {
    if (viewMode === 'folder' && activeFolder) {
      return filteredQuestions.filter(q => q.topic === activeFolder);
    }
    return filteredQuestions;
  }, [filteredQuestions, viewMode, activeFolder]);

  // Folders Aggregated Data for Folder View
  const foldersData = useMemo(() => {
    const map = {};
    filteredQuestions.forEach(q => {
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
  }, [filteredQuestions]);

  // Toggle question solved status
  const toggleQuestionStatus = useCallback(async (id) => {
    const question = questions.find(q => (q._id || q.id) === id);
    if (!question) return;

    const nextDone = !question.done;
    setQuestions(prev => prev.map(q => (q._id || q.id) === id ? { ...q, done: nextDone } : q));

    try {
      const response = await customFetch(`${baseURL}/api/questions/${id}/toggle`, {
        method: 'PATCH'
      });
      if (response.ok) {
        showToast(nextDone ? "Marked as solved!" : "Marked as unsolved.", "info");
      } else {
        setQuestions(prev => prev.map(q => (q._id || q.id) === id ? { ...q, done: !nextDone } : q));
        showToast("Failed to update status on server.", "warning");
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setQuestions(prev => prev.map(q => (q._id || q.id) === id ? { ...q, done: !nextDone } : q));
      showToast("Network error updating question status.", "warning");
    }
  }, [questions, customFetch, showToast]);

  // Save Notes handler
  const handleSaveNotes = useCallback(async (e) => {
    e.preventDefault();
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
        setQuestions(prev => prev.map(item => (item._id || item.id) === noteModalData.id ? { ...item, notes: noteModalData.notes } : item));
        setIsNoteModalOpen(false);
        showToast(`Note saved for "${noteModalData.name}"`, "success");
      } else {
        showToast("Failed to save note.", "warning");
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      showToast("Network error saving note.", "warning");
    }
  }, [noteModalData, customFetch, showToast]);

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
    e.preventDefault();
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
        const newQuestion = await response.json();
        setQuestions(prev => [newQuestion, ...prev]);
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
      } else {
        const err = await response.json();
        showToast(err.error || "Failed to add question.", "warning");
      }
    } catch (error) {
      console.error('Error adding question:', error);
      showToast("Server error adding question.", "warning");
    }
  }, [addForm, customFetch, showToast]);

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
    e.preventDefault();
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
        const updatedQuestion = await response.json();
        setQuestions(prev => prev.map(q => (q._id || q.id) === editForm.id ? updatedQuestion : q));
        setIsEditModalOpen(false);
        showToast(`Updated "${updatedQuestion.name}".`, "success");
      } else {
        const err = await response.json();
        showToast(err.error || "Failed to update question.", "warning");
      }
    } catch (error) {
      console.error('Error updating question:', error);
      showToast("Server error updating question.", "warning");
    }
  }, [editForm, customFetch, showToast]);

  // Delete Question
  const handleDeleteClick = useCallback(async (question) => {
    const qId = question._id || question.id;
    if (!window.confirm(`Are you sure you want to delete "${question.name}"?`)) return;

    try {
      const response = await customFetch(`${baseURL}/api/questions/${qId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setQuestions(prev => prev.filter(q => (q._id || q.id) !== qId));
        showToast(`Deleted "${question.name}".`, "info");
      } else {
        showToast("Failed to delete question.", "warning");
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast("Server error deleting question.", "warning");
    }
  }, [customFetch, showToast]);

  // Revisions Counter Increments / Decrements
  const handleUpdateRevisions = useCallback(async (id, nextRevisions) => {
    if (nextRevisions < 0) return;
    setQuestions(prev => prev.map(q => (q._id || q.id) === id ? { ...q, revisions: nextRevisions } : q));

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
  }, [customFetch, showToast]);

  // Confirm Reset Sheet Progress
  const handleResetConfirm = useCallback(async () => {
    try {
      const response = await customFetch(`${baseURL}/api/questions/reset`, {
        method: 'POST'
      });

      if (response.ok) {
        setQuestions(prev => prev.map(q => ({ ...q, done: false, revisions: 0 })));
        setIsResetModalOpen(false);
        showToast("Sheet progress reset successfully.", "info");
      } else {
        showToast("Failed to reset progress.", "warning");
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      showToast("Server error resetting progress.", "warning");
    }
  }, [customFetch, showToast]);

  // Radial Progress Circle math
  const circleCircumference = 2 * Math.PI * 34; // r=34 => 213.628
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
        isApiCalling={isApiCalling}
        setAuthError={setAuthError}
        setAuthForm={setAuthForm}
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
        isApiCalling={isApiCalling}
        setAuthError={setAuthError}
        setAuthForm={setAuthForm}
      />

      <main className="main-content">
        {loading ? (
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
              <LandingView setCurrentView={setCurrentView} isApiCalling={isApiCalling} />
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
                isApiCalling={isApiCalling}
              />
            )}

            {currentView === 'dashboard' && (
              <>
                <HeroStats stats={stats} />

                <FilterToolbar
                  filters={filters}
                  setFilters={setFilters}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  setActiveFolder={setActiveFolder}
                  setIsAddModalOpen={setIsAddModalOpen}
                  setIsResetModalOpen={setIsResetModalOpen}
                  topicsList={topicsList}
                  isApiCalling={isApiCalling}
                />

                {viewMode === 'folder' && !activeFolder ? (
                  <FoldersGrid
                    foldersData={foldersData}
                    setActiveFolder={setActiveFolder}
                  />
                ) : (
                  <QuestionTable
                    questionsToRender={questionsToRender}
                    viewMode={viewMode}
                    activeFolder={activeFolder}
                    setActiveFolder={setActiveFolder}
                    setFilters={setFilters}
                    toggleQuestionStatus={toggleQuestionStatus}
                    openNotesModal={openNotesModal}
                    handleUpdateRevisions={handleUpdateRevisions}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    isApiCalling={isApiCalling}
                  />
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
        isApiCalling={isApiCalling}
      />

      <EditQuestionModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditSubmit={handleEditSubmit}
        topicsList={topicsList}
        isApiCalling={isApiCalling}
      />

      <NotesModal
        isNoteModalOpen={isNoteModalOpen}
        setIsNoteModalOpen={setIsNoteModalOpen}
        noteModalData={noteModalData}
        setNoteModalData={setNoteModalData}
        handleSaveNotes={handleSaveNotes}
        isApiCalling={isApiCalling}
      />

      <ResetModal
        isResetModalOpen={isResetModalOpen}
        setIsResetModalOpen={setIsResetModalOpen}
        handleResetConfirm={handleResetConfirm}
        isApiCalling={isApiCalling}
      />

      <ToastContainer toasts={toasts} setToasts={setToasts} isApiCalling={isApiCalling} />

      <Footer />
    </div>
  );
}

export default App;
