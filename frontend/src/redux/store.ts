import { configureStore } from '@reduxjs/toolkit';
import journeyReducer from './features/journeySlice';
import accessibilityReducer from './features/accessibilitySlice';
import facilityReducer from './features/facilitySlice';

export const store = configureStore({
  reducer: {
    journey: journeyReducer,
    accessibility: accessibilityReducer,
    facility: facilityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
