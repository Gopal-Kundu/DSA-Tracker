import React, { useState, useEffect, useMemo } from 'react';
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
  // Authentication & Navigation State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [currentView, setCurrentView] = useState(localStorage.getItem('token') ? 'dashboard' : 'landing');
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

  const customFetch = async (url, options) => {
    setActiveRequests(prev => prev + 1);
    try {
      return await fetch(url, options);
    } finally {
      setActiveRequests(prev => Math.max(0, prev - 1));
    }
  };

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

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Fetch questions for authenticated user
  const fetchQuestions = async (activeToken) => {
    const targetToken = activeToken || token;
    if (!targetToken) return;

    try {
      setLoading(true);
      const response = await customFetch(`${baseURL}/api/questions`, {
        headers: {
          'Authorization': `Bearer ${targetToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else if (response.status === 401) {
        handleLogout();
        showToast("Session expired. Please log in again.", "warning");
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast("Could not retrieve questions. Server connection error.", "warning");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount/token change
  useEffect(() => {
    if (token) {
      fetchQuestions(token);
    }
  }, [token]);

  // Auth Handlers
  const handleAuthSubmit = async (e, type) => {
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        setToken(data.token);
        setUsername(data.user.username);
        setAuthForm({ username: '', password: '' });
        setCurrentView('dashboard');
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
    setQuestions([]);
    setCurrentView('landing');
    setIsMobileMenuOpen(false);
    showToast("Logged out successfully.", "info");
  };

  // Compute stats reactively
  const stats = useMemo(() => {
    const total = questions.length;
    const solved = questions.filter(q => q.done).length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    const uniqueTopics = new Set(questions.map(q => q.topic));
    const totalTopics = uniqueTopics.size;

    const diffBreakdown = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    };

    questions.forEach(q => {
      if (diffBreakdown[q.difficulty]) {
        diffBreakdown[q.difficulty].total++;
        if (q.done) {
          diffBreakdown[q.difficulty].solved++;
        }
      }
    });

    return {
      total,
      solved,
      percentage,
      totalTopics,
      topicsList: Array.from(uniqueTopics).sort(),
      difficulty: diffBreakdown
    };
  }, [questions]);

  // Toggle solved status
  const toggleQuestionStatus = async (id) => {
    const q = questions.find(item => (item._id || item.id) === id);
    if (!q) return;
    const qId = q._id || q.id;
    const newDoneState = !q.done;

    setQuestions(prev => prev.map(item => (item._id || item.id) === qId ? { ...item, done: newDoneState } : item));

    try {
      const response = await customFetch(`${baseURL}/api/questions/${qId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ done: newDoneState })
      });
      if (response.ok) {
        if (newDoneState) {
          showToast(`"${q.name}" marked as completed!`, "success");
        } else {
          showToast(`"${q.name}" marked as incomplete.`, "info");
        }
      } else {
        setQuestions(prev => prev.map(item => (item._id || item.id) === qId ? { ...item, done: !newDoneState } : item));
        showToast("Failed to update status on server.", "warning");
      }
    } catch (error) {
      console.error('Failed to update status on server:', error);
      setQuestions(prev => prev.map(item => (item._id || item.id) === qId ? { ...item, done: !newDoneState } : item));
      showToast("Failed to update status on server.", "warning");
    }
  };

  // Update revisions counter
  const handleUpdateRevisions = async (id, newRevisionsVal) => {
    if (newRevisionsVal < 0) return;
    const q = questions.find(item => (item._id || item.id) === id);
    if (!q) return;
    const qId = q._id || q.id;
    const oldRevisions = q.revisions || 0;

    setQuestions(prev => prev.map(item => (item._id || item.id) === qId ? { ...item, revisions: newRevisionsVal } : item));

    try {
      const response = await customFetch(`${baseURL}/api/questions/${qId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ revisions: newRevisionsVal })
      });
      if (response.ok) {
        showToast(`Updated revisions for "${q.name}" to ${newRevisionsVal}.`, "success");
      } else {
        setQuestions(prev => prev.map(item => (item._id || item.id) === qId ? { ...item, revisions: oldRevisions } : item));
        showToast("Failed to update revisions on server.", "warning");
      }
    } catch (error) {
      console.error('Failed to update revisions:', error);
      setQuestions(prev => prev.map(item => (item._id || item.id) === qId ? { ...item, revisions: oldRevisions } : item));
      showToast("Failed to update revisions on server.", "warning");
    }
  };

  const parseTimeInput = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
  };

  // Add question handler
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.topic.trim() || !addForm.name.trim() || !addForm.link.trim()) return;

    const parsedTime = parseTimeInput(addForm.timeTaken);

    const newQuestion = {
      topic: addForm.topic.trim(),
      name: addForm.name.trim(),
      link: addForm.link.trim(),
      difficulty: addForm.difficulty,
      youtube: addForm.youtube.trim(),
      timeTaken: parsedTime,
      notes: addForm.notes.trim(),
      done: false
    };

    try {
      const response = await customFetch(`${baseURL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newQuestion)
      });
      if (response.ok) {
        const responseData = await response.json();
        setQuestions(prev => [...prev, responseData.question || responseData]);
        setIsAddModalOpen(false);
        setAddForm({ topic: '', name: '', link: '', difficulty: 'Medium', youtube: '', timeTaken: '', notes: '' });
        showToast(`"${newQuestion.name}" added successfully!`, "success");
      } else {
        showToast("Failed to add question.", "warning");
      }
    } catch (error) {
      console.error('Error adding question:', error);
      showToast("Failed to add question.", "warning");
    }
  };

  // Open edit modal and populate data
  const handleEditClick = (q) => {
    setEditForm({
      id: q._id || q.id,
      topic: q.topic,
      name: q.name,
      link: q.link,
      difficulty: q.difficulty,
      youtube: q.youtube || '',
      timeTaken: q.timeTaken || '',
      notes: q.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Edit question handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.topic.trim() || !editForm.name.trim() || !editForm.link.trim()) return;

    const parsedTime = parseTimeInput(editForm.timeTaken);

    const updatedFields = {
      topic: editForm.topic.trim(),
      name: editForm.name.trim(),
      link: editForm.link.trim(),
      difficulty: editForm.difficulty,
      youtube: editForm.youtube.trim(),
      timeTaken: parsedTime,
      notes: editForm.notes.trim()
    };

    try {
      const response = await customFetch(`${baseURL}/api/questions/${editForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      if (response.ok) {
        const responseData = await response.json();
        setQuestions(prev => prev.map(item => (item._id || item.id) === editForm.id ? (responseData.question || { ...item, ...updatedFields }) : item));
        setIsEditModalOpen(false);
        showToast(`"${updatedFields.name}" updated!`, "success");
      } else {
        showToast("Failed to update question.", "warning");
      }
    } catch (error) {
      console.error('Error updating question:', error);
      showToast("Failed to update question.", "warning");
    }
  };

  // Open Notes Modal
  const openNotesModal = (q) => {
    setNoteModalData({
      id: q._id || q.id,
      name: q.name,
      topic: q.topic,
      notes: q.notes || ''
    });
    setIsNoteModalOpen(true);
  };

  // Save Notes handler
  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!noteModalData.id) return;

    try {
      const response = await customFetch(`${baseURL}/api/questions/${noteModalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      console.error('Error saving note:', error);
      showToast("Failed to save note.", "warning");
    }
  };

  // Delete question handler
  const handleDeleteClick = async (q) => {
    if (!window.confirm(`Are you sure you want to delete "${q.name}"?`)) return;
    const qId = q._id || q.id;

    try {
      const response = await customFetch(`${baseURL}/api/questions/${qId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setQuestions(prev => prev.filter(item => (item._id || item.id) !== qId));
        const remainingTopics = new Set(questions.filter(item => (item._id || item.id) !== qId).map(item => item.topic));
        if (filters.topic !== 'all' && !remainingTopics.has(filters.topic)) {
          setFilters(prev => ({ ...prev, topic: 'all' }));
        }
        if (activeFolder && !remainingTopics.has(activeFolder)) {
          setActiveFolder(null);
        }
        showToast(`"${q.name}" has been deleted.`, "warning");
      } else {
        showToast("Failed to delete question.", "warning");
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast("Failed to delete question.", "warning");
    }
  };

  // Reset progress handler
  const handleResetConfirm = async () => {
    try {
      const response = await customFetch(`${baseURL}/api/questions/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setQuestions(prev => prev.map(q => ({ ...q, done: false })));
        setIsResetModalOpen(false);
        showToast("All progress has been reset.", "info");
      } else {
        showToast("Failed to reset progress.", "warning");
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      showToast("Failed to reset progress.", "warning");
    }
  };

  // Filtered questions memoization
  const filteredQuestions = useMemo(() => {
    const searchLower = filters.search.toLowerCase();

    const filtered = questions.filter(q => {
      const matchesSearch = q.name.toLowerCase().includes(searchLower) || q.topic.toLowerCase().includes(searchLower);
      const matchesTopic = filters.topic === 'all' || q.topic === filters.topic;
      const matchesDifficulty = filters.difficulty === 'all' || q.difficulty === filters.difficulty;
      const matchesStatus = filters.status === 'all' ||
        (filters.status === 'solved' && q.done) ||
        (filters.status === 'unsolved' && !q.done);
      return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const activeSort = filters.sort || 'none';

      if (activeSort === 'time-asc') {
        const timeA = typeof a.timeTaken === 'number' ? a.timeTaken : (Number(a.timeTaken) || 0);
        const timeB = typeof b.timeTaken === 'number' ? b.timeTaken : (Number(b.timeTaken) || 0);
        if (timeA !== timeB) return timeA - timeB;
      } else if (activeSort === 'time-desc') {
        const timeA = typeof a.timeTaken === 'number' ? a.timeTaken : (Number(a.timeTaken) || 0);
        const timeB = typeof b.timeTaken === 'number' ? b.timeTaken : (Number(b.timeTaken) || 0);
        if (timeA !== timeB) return timeB - timeA;
      } else if (activeSort === 'rev-asc') {
        const revA = a.revisions || 0;
        const revB = b.revisions || 0;
        if (revA !== revB) return revA - revB;
      } else if (activeSort === 'rev-desc') {
        const revA = a.revisions || 0;
        const revB = b.revisions || 0;
        if (revA !== revB) return revB - revA;
      }

      const idA = parseInt(a._id || a.id, 10);
      const idB = parseInt(b._id || b.id, 10);
      if (!isNaN(idA) && !isNaN(idB)) {
        return idA - idB;
      }
      if (isNaN(idA) && !isNaN(idB)) return 1;
      if (!isNaN(idA) && isNaN(idB)) return -1;
      return (a._id || a.id || '').localeCompare(b._id || b.id || '');
    });
  }, [questions, filters]);

  // Grouped questions data for Folders View
  const foldersData = useMemo(() => {
    const folders = {};
    filteredQuestions.forEach(q => {
      if (!folders[q.topic]) {
        folders[q.topic] = {
          name: q.topic,
          total: 0,
          solved: 0,
          easy: 0,
          medium: 0,
          hard: 0
        };
      }
      folders[q.topic].total++;
      if (q.done) {
        folders[q.topic].solved++;
      }
      if (q.difficulty === 'Easy') folders[q.topic].easy++;
      else if (q.difficulty === 'Medium') folders[q.topic].medium++;
      else if (q.difficulty === 'Hard') folders[q.topic].hard++;
    });
    return Object.values(folders).sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredQuestions]);

  // Questions to render in the table
  const questionsToRender = useMemo(() => {
    if (viewMode === 'folder' && activeFolder) {
      return filteredQuestions.filter(q => q.topic === activeFolder);
    }
    return filteredQuestions;
  }, [filteredQuestions, viewMode, activeFolder]);

  // SVG Circle Stroke offset calculation
  const circleCircumference = 2 * Math.PI * 34;
  const strokeDashoffset = circleCircumference - (stats.percentage / 100) * circleCircumference;

  return (
    <div className="app-container">
      {/* Header Navbar */}
      <Navbar
        token={token}
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

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        token={token}
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

      {/* Main Views */}
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
        <main className="main-content">
          {/* Difficulty Stats panel */}
          <HeroStats stats={stats} />

          {/* Search Bar & Toolbar */}
          <FilterToolbar
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setActiveFolder={setActiveFolder}
            topicsList={stats.topicsList}
            setIsAddModalOpen={setIsAddModalOpen}
            setIsResetModalOpen={setIsResetModalOpen}
            isApiCalling={isApiCalling}
          />

          {/* Board View */}
          <section className="topics-grid">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="spinner" size={32} />
                <p>Initializing LeetTracker Board...</p>
              </div>
            ) : filteredQuestions.length === 0 && viewMode === 'table' ? (
              <div className="empty-state">
                <FolderOpen className="empty-state-icon" size={48} />
                <h3>Your DSA revision sheet is empty</h3>
                <p>Start curating your personal DSA roadmap by clicking the "Add Question" button above.</p>
              </div>
            ) : viewMode === 'folder' && !activeFolder ? (
              <FoldersGrid foldersData={foldersData} setActiveFolder={setActiveFolder} />
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
          </section>
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <NotesModal
        isNoteModalOpen={isNoteModalOpen}
        setIsNoteModalOpen={setIsNoteModalOpen}
        noteModalData={noteModalData}
        setNoteModalData={setNoteModalData}
        handleSaveNotes={handleSaveNotes}
        isApiCalling={isApiCalling}
      />

      <AddQuestionModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        addForm={addForm}
        setAddForm={setAddForm}
        handleAddSubmit={handleAddSubmit}
        topicsList={stats.topicsList}
        isApiCalling={isApiCalling}
      />

      <EditQuestionModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditSubmit={handleEditSubmit}
        topicsList={stats.topicsList}
        isApiCalling={isApiCalling}
      />

      <ResetModal
        isResetModalOpen={isResetModalOpen}
        setIsResetModalOpen={setIsResetModalOpen}
        handleResetConfirm={handleResetConfirm}
        isApiCalling={isApiCalling}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} setToasts={setToasts} isApiCalling={isApiCalling} />
    </div>
  );
}

export default App;
