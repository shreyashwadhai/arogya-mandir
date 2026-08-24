import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AccessibilityState {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  textToSpeechEnabled: boolean;
  isSpeaking: boolean;
  showGovtDashboard: boolean;
  showTrackModal: boolean;
  activeTrackIdInput: string;
}

const initialState: AccessibilityState = {
  fontSize: 'normal',
  highContrast: false,
  textToSpeechEnabled: true,
  isSpeaking: false,
  showGovtDashboard: false,
  showTrackModal: false,
  activeTrackIdInput: '',
};

export const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    setFontSize: (state, action: PayloadAction<'normal' | 'large' | 'xlarge'>) => {
      state.fontSize = action.payload;
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },
    toggleTextToSpeech: (state) => {
      state.textToSpeechEnabled = !state.textToSpeechEnabled;
    },
    setIsSpeaking: (state, action: PayloadAction<boolean>) => {
      state.isSpeaking = action.payload;
    },
    toggleGovtDashboard: (state) => {
      state.showGovtDashboard = !state.showGovtDashboard;
    },
    openTrackModal: (state, action: PayloadAction<string | undefined>) => {
      state.showTrackModal = true;
      if (action.payload) {
        state.activeTrackIdInput = action.payload;
      }
    },
    closeTrackModal: (state) => {
      state.showTrackModal = false;
    },
    setActiveTrackIdInput: (state, action: PayloadAction<string>) => {
      state.activeTrackIdInput = action.payload;
    }
  },
});

export const {
  setFontSize,
  toggleHighContrast,
  toggleTextToSpeech,
  setIsSpeaking,
  toggleGovtDashboard,
  openTrackModal,
  closeTrackModal,
  setActiveTrackIdInput
} = accessibilitySlice.actions;

export default accessibilitySlice.reducer;
