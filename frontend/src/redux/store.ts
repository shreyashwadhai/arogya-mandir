import { configureStore } from '@reduxjs/toolkit';
import journeyReducer from './features/journeySlice';
import accessibilityReducer from './features/accessibilitySlice';
import facilityReducer from './features/facilitySlice';
import adminReducer from './features/adminSlice';

export const store = configureStore({
  reducer: {
    journey: journeyReducer,
    accessibility: accessibilityReducer,
    facility: facilityReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
