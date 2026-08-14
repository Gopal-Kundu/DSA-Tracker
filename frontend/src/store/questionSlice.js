import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  totalQuestions: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 20,
  loading: false,
  error: null,
  filters: {
    search: '',
    topic: 'all',
    difficulty: 'all',
    status: 'all',
    sort: 'none'
  },
  stats: {
    total: 0,
    solved: 0,
    percentage: 0,
    totalTopics: 0,
    difficulty: {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 }
    }
  },
  topicsList: [],
  viewMode: 'table',
  activeFolder: null
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestionsData: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.questions = payload;
        state.totalQuestions = payload.length;
        state.totalPages = Math.ceil(payload.length / state.limit) || 1;
      } else if (payload && typeof payload === 'object') {
        state.questions = payload.questions || [];
        state.totalQuestions = payload.totalQuestions ?? 0;
        state.totalPages = payload.totalPages ?? 1;
        state.currentPage = payload.currentPage ?? state.currentPage;
        if (payload.stats) state.stats = payload.stats;
        if (payload.topicsList) state.topicsList = payload.topicsList;
      }
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilter: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
      state.currentPage = 1; // Reset to page 1 on filter change
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setActiveFolder: (state, action) => {
      state.activeFolder = action.payload;
    },
    resetQuestionsState: () => initialState,

    // Synchronous state updates
    updateLocalQuestionDone: (state, action) => {
      const { id, nextDone } = action.payload;
      const item = state.questions.find(q => (q._id || q.id) === id);
      if (item) {
        item.done = nextDone;
        if (nextDone) state.stats.solved += 1;
        else state.stats.solved = Math.max(0, state.stats.solved - 1);
        if (state.stats.total > 0) {
          state.stats.percentage = Math.round((state.stats.solved / state.stats.total) * 100);
        }
      }
    },
    updateLocalRevisions: (state, action) => {
      const { id, revisions } = action.payload;
      const item = state.questions.find(q => (q._id || q.id) === id);
      if (item) {
        item.revisions = revisions;
      }
    },
    updateLocalNotes: (state, action) => {
      const { id, notes } = action.payload;
      const item = state.questions.find(q => (q._id || q.id) === id);
      if (item) {
        item.notes = notes;
      }
    },
    removeLocalQuestion: (state, action) => {
      const id = action.payload;
      state.questions = state.questions.filter(q => (q._id || q.id) !== id);
      state.totalQuestions = Math.max(0, state.totalQuestions - 1);
    },
    addLocalQuestion: (state, action) => {
      state.questions.unshift(action.payload);
      state.totalQuestions += 1;
    },
    editLocalQuestion: (state, action) => {
      const updated = action.payload;
      const id = updated._id || updated.id;
      const index = state.questions.findIndex(q => (q._id || q.id) === id);
      if (index !== -1) {
        state.questions[index] = updated;
      }
    }
  }
});

export const {
  setQuestionsData,
  setLoading,
  setError,
  setFilter,
  setFilters,
  setCurrentPage,
  setViewMode,
  setActiveFolder,
  resetQuestionsState,
  updateLocalQuestionDone,
  updateLocalRevisions,
  updateLocalNotes,
  removeLocalQuestion,
  addLocalQuestion,
  editLocalQuestion
} = questionSlice.actions;

export default questionSlice.reducer;
