import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import treatmentReducer from './slices/treatmentSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    treatments: treatmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;