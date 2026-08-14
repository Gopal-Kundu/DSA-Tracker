import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  username: '',
  authChecking: true,
  authError: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.username = action.payload.username || '';
      state.authChecking = false;
      state.authError = action.payload.error || '';
    },
    setAuthChecking: (state, action) => {
      state.authChecking = action.payload;
    },
    setAuthError: (state, action) => {
      state.authError = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.authChecking = false;
      state.authError = '';
    }
  }
});

export const { setAuth, setAuthChecking, setAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
