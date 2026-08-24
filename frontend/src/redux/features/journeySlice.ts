import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AadhaarData {
  fullName: string;
  dob: string;
  gender: string;
  aadhaarNumber: string;
  mobileNumber: string;
  address: string;
  frontPhotoUrl: string | null;
  backPhotoUrl: string | null;
  isManualRegistration: boolean;
}

export interface FeedbackResponses {
  userRole: string;
  patientName: string;
  healthCardToken: string;
  mobileNumber: string;
  registrationRating: 'Could Be Better' | 'Acceptable' | 'Excellent' | '';
  registrationComments: string;
  registrationAudioUrl?: string | null;
  registrationImageUrl?: string | null;
  registrationImprovementTags: string[];
  doctorRating: 'Could Be Better' | 'Acceptable' | 'Excellent' | '';
  doctorComments: string;
  doctorAudioUrl?: string | null;
  doctorImageUrl?: string | null;
  doctorImprovementTags: string[];
  pharmacyRating: 'Could Be Better' | 'Acceptable' | 'Excellent' | '';
  pharmacyComments: string;
  pharmacyAudioUrl?: string | null;
  pharmacyImageUrl?: string | null;
  pharmacyImprovementTags: string[];
  prescribedMedicinesAvailable: 'Could Be Better' | 'Acceptable' | 'Excellent' | '';
  medicinesComments: string;
  medicinesAudioUrl?: string | null;
  medicinesImageUrl?: string | null;
  medicinesImprovementTags: string[];
  cleanlinessRating: 'Could Be Better' | 'Acceptable' | 'Excellent' | '';
  cleanlinessComments: string;
  cleanlinessAudioUrl?: string | null;
  cleanlinessImageUrl?: string | null;
  cleanlinessImprovementTags: string[];
  additionalSuggestions: string;
  suggestionAudioUrl?: string | null;
  suggestionImageUrl?: string | null;
  isGrievanceEscalation: boolean;
}

export interface JourneyState {
  currentStep: number; // 1: QR Scan, 2: Registration, 3: OTP, 4: Language, 5: Feedback, 6: Confirmation
  selectedLanguage: 'en' | 'hi' | 'pa' | 'ur';
  aadhaarData: AadhaarData;
  otpVerified: boolean;
  otpDigits: string[];
  otpTimerSeconds: number;
  currentQuestionIndex: number; // 0 to 9
  feedbackResponses: FeedbackResponses;
  trackingId: string;
  submissionTimestamp: string | null;
  trackedFeedbacks: Array<{
    trackingId: string;
    patientName: string;
    facilityName: string;
    status: 'Logged & Verified' | 'Assigned to CMO' | 'Action In Progress' | 'Resolved';
    timestamp: string;
    commentsCount: number;
    urgency: 'Normal' | 'High SLA Priority';
  }>;
}

const initialState: JourneyState = {
  currentStep: 1,
  selectedLanguage: 'en',
  aadhaarData: {
    fullName: '',
    dob: '',
    gender: '',
    aadhaarNumber:'',
    mobileNumber:'',
    address: '',
    frontPhotoUrl: null,
    backPhotoUrl: null,
    isManualRegistration: false,
  },
  otpVerified: false,
  otpDigits: ['', '', '', '', '', ''],
  otpTimerSeconds: 30,
  currentQuestionIndex: 0,
  feedbackResponses: {
    userRole: 'Patient',
    patientName: '',
    healthCardToken: '',
    mobileNumber: '',
    registrationRating: '',
    registrationComments: '',
    registrationAudioUrl: null,
    registrationImageUrl: null,
    registrationImprovementTags: [],
    doctorRating: '',
    doctorComments: '',
    doctorAudioUrl: null,
    doctorImageUrl: null,
    doctorImprovementTags: [],
    pharmacyRating: '',
    pharmacyComments: '',
    pharmacyAudioUrl: null,
    pharmacyImageUrl: null,
    pharmacyImprovementTags: [],
    prescribedMedicinesAvailable: '',
    medicinesComments: '',
    medicinesAudioUrl: null,
    medicinesImageUrl: null,
    medicinesImprovementTags: [],
    cleanlinessRating: '',
    cleanlinessComments: '',
    cleanlinessAudioUrl: null,
    cleanlinessImageUrl: null,
    cleanlinessImprovementTags: [],
    additionalSuggestions: '',
    suggestionAudioUrl: null,
    suggestionImageUrl: null,
    isGrievanceEscalation: false,
  },
  trackingId: 'AM-FB-2026-42342',
  submissionTimestamp: null,
  trackedFeedbacks: [
    {
      trackingId: 'AM-FB-2026-42342',
      patientName: 'Harpreet Singh',
      facilityName: 'District Hospital, Central Delhi (Arogya Mandir #402)',
      status: 'Assigned to CMO',
      timestamp: '20 Aug 2026, 01:15 PM',
      commentsCount: 2,
      urgency: 'High SLA Priority'
    },
    {
      trackingId: 'AM-FB-2026-38910',
      patientName: 'Sunita Sharma',
      facilityName: 'Arogya Mandir Centre #108 - Rohini',
      status: 'Resolved',
      timestamp: '18 Aug 2026, 04:40 PM',
      commentsCount: 4,
      urgency: 'Normal'
    }
  ],
};

export const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setSelectedLanguage: (state, action: PayloadAction<'en' | 'hi' | 'pa' | 'ur'>) => {
      state.selectedLanguage = action.payload;
    },
    updateAadhaarData: (state, action: PayloadAction<Partial<AadhaarData>>) => {
      state.aadhaarData = { ...state.aadhaarData, ...action.payload };
      if (action.payload.mobileNumber) {
        state.feedbackResponses.mobileNumber = action.payload.mobileNumber;
      }
      if (action.payload.fullName) {
        state.feedbackResponses.patientName = action.payload.fullName;
      }
    },
    setOtpDigit: (state, action: PayloadAction<{ index: number; value: string }>) => {
      const { index, value } = action.payload;
      if (index >= 0 && index < 6) {
        state.otpDigits[index] = value;
      }
    },
    setOtpDigitsAll: (state, action: PayloadAction<string[]>) => {
      state.otpDigits = action.payload;
    },
    setOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload;
    },
    decrementOtpTimer: (state) => {
      if (state.otpTimerSeconds > 0) {
        state.otpTimerSeconds -= 1;
      }
    },
    resetOtpTimer: (state) => {
      state.otpTimerSeconds = 30;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < 9) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    updateFeedbackResponses: (state, action: PayloadAction<Partial<FeedbackResponses>>) => {
      state.feedbackResponses = { ...state.feedbackResponses, ...action.payload };
    },
    generateNewTrackingId: (state) => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newId = `AM-FB-2026-${randomNum}`;
      state.trackingId = newId;
      state.submissionTimestamp = new Date().toLocaleString();
      
      const hasGrievance = 
        state.feedbackResponses.registrationRating === 'Could Be Better' ||
        state.feedbackResponses.doctorRating === 'Could Be Better' ||
        state.feedbackResponses.pharmacyRating === 'Could Be Better' ||
        state.feedbackResponses.cleanlinessRating === 'Could Be Better' ||
        state.feedbackResponses.isGrievanceEscalation;

      state.trackedFeedbacks.unshift({
        trackingId: newId,
        patientName: state.feedbackResponses.patientName || 'Aadhaar Verified Citizen',
        facilityName: 'District Hospital, Central Delhi (Arogya Mandir #402)',
        status: hasGrievance ? 'Assigned to CMO' : 'Logged & Verified',
        timestamp: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        commentsCount: hasGrievance ? 1 : 0,
        urgency: hasGrievance ? 'High SLA Priority' : 'Normal'
      });
    },
    resetForm: (state) => {
      state.currentStep = 1;
      state.otpVerified = false;
      state.otpDigits = ['', '', '', '', '', ''];
      state.otpTimerSeconds = 30;
      state.currentQuestionIndex = 0;
      state.feedbackResponses = {
        userRole: 'Patient',
        patientName: state.aadhaarData.fullName || '',
        healthCardToken: '',
        mobileNumber: state.aadhaarData.mobileNumber || '',
        registrationRating: '',
        registrationComments: '',
        registrationAudioUrl: null,
        registrationImageUrl: null,
        registrationImprovementTags: [],
        doctorRating: '',
        doctorComments: '',
        doctorAudioUrl: null,
        doctorImageUrl: null,
        doctorImprovementTags: [],
        pharmacyRating: '',
        pharmacyComments: '',
        pharmacyAudioUrl: null,
        pharmacyImageUrl: null,
        pharmacyImprovementTags: [],
        prescribedMedicinesAvailable: '',
        medicinesComments: '',
        medicinesAudioUrl: null,
        medicinesImageUrl: null,
        medicinesImprovementTags: [],
        cleanlinessRating: '',
        cleanlinessComments: '',
        cleanlinessAudioUrl: null,
        cleanlinessImageUrl: null,
        cleanlinessImprovementTags: [],
        additionalSuggestions: '',
        suggestionAudioUrl: null,
        suggestionImageUrl: null,
        isGrievanceEscalation: false,
      };
    }
  },
});

export const {
  setCurrentStep,
  setSelectedLanguage,
  updateAadhaarData,
  setOtpDigit,
  setOtpDigitsAll,
  setOtpVerified,
  decrementOtpTimer,
  resetOtpTimer,
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  updateFeedbackResponses,
  generateNewTrackingId,
  resetForm
} = journeySlice.actions;

export default journeySlice.reducer;
