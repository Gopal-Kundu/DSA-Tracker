import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './questionSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    questions: questionReducer,
    auth: authReducer
  }
});

export default store;
