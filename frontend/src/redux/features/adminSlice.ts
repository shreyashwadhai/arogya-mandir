import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DUMMY_FEEDBACK_RECORDS, type FeedbackRecord } from '../../components/admin/dummyData';

export interface AdminState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  showAdminModal: boolean;
  activeTab: 'analytics' | 'feedbacks' | 'grievances' | 'facilities';
  searchQuery: string;
  ratingFilter: 'ALL' | 'Could Be Better' | 'Acceptable' | 'Excellent';
  mediaFilter: 'ALL' | 'AUDIO' | 'IMAGE' | 'BOTH';
  statusFilter: 'ALL' | 'Assigned to CMO' | 'Action In Progress' | 'Logged & Verified' | 'Resolved';
  selectedRecord: FeedbackRecord | null;
  showDetailModal: boolean;
  records: FeedbackRecord[];
}

// Read persisted session storage if user refreshed page
const getSavedAuth = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  }
  return false;
};

const getSavedEmail = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('adminEmail') || null;
  }
  return null;
};

const initialState: AdminState = {
  isAuthenticated: getSavedAuth(),
  adminEmail: getSavedEmail(),
  showAdminModal: getSavedAuth(),
  activeTab: 'analytics',
  searchQuery: '',
  ratingFilter: 'ALL',
  mediaFilter: 'ALL',
  statusFilter: 'ALL',
  selectedRecord: null,
  showDetailModal: false,
  records: DUMMY_FEEDBACK_RECORDS,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleAdminModal: (state) => {
      state.showAdminModal = !state.showAdminModal;
    },
    openAdminModal: (state) => {
      state.showAdminModal = true;
    },
    closeAdminModal: (state) => {
      state.showAdminModal = false;
    },
    loginAdmin: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.adminEmail = action.payload;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminEmail', action.payload);
      }
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.adminEmail = null;
      state.showAdminModal = false;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminEmail');
      }
    },
    setActiveTab: (state, action: PayloadAction<'analytics' | 'feedbacks' | 'grievances' | 'facilities'>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setRatingFilter: (state, action: PayloadAction<'ALL' | 'Could Be Better' | 'Acceptable' | 'Excellent'>) => {
      state.ratingFilter = action.payload;
    },
    setMediaFilter: (state, action: PayloadAction<'ALL' | 'AUDIO' | 'IMAGE' | 'BOTH'>) => {
      state.mediaFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'ALL' | 'Assigned to CMO' | 'Action In Progress' | 'Logged & Verified' | 'Resolved'>) => {
      state.statusFilter = action.payload;
    },
    openDetailModal: (state, action: PayloadAction<FeedbackRecord>) => {
      state.selectedRecord = action.payload;
      state.showDetailModal = true;
    },
    closeDetailModal: (state) => {
      state.showDetailModal = false;
      state.selectedRecord = null;
    },
    updateRecordStatus: (state, action: PayloadAction<{ id: string; status: FeedbackRecord['status']; note?: string; officerName?: string }>) => {
      const { id, status, note, officerName } = action.payload;
      const record = state.records.find((r) => r.id === id);
      if (record) {
        record.status = status;
        if (status === 'Resolved') {
          record.urgency = 'Normal';
        }
        if (note) {
          if (!record.officerNotes) record.officerNotes = [];
          record.officerNotes.unshift({
            date: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            officer: officerName || 'CMO Admin',
            note,
          });
        }
        if (state.selectedRecord?.id === id) {
          state.selectedRecord = { ...record };
        }
      }
    },
    addNewFeedbackFromUser: (state, action: PayloadAction<FeedbackRecord>) => {
      state.records.unshift(action.payload);
    },
  },
});

export const {
  toggleAdminModal,
  openAdminModal,
  closeAdminModal,
  loginAdmin,
  logoutAdmin,
  setActiveTab,
  setSearchQuery,
  setRatingFilter,
  setMediaFilter,
  setStatusFilter,
  openDetailModal,
  closeDetailModal,
  updateRecordStatus,
  addNewFeedbackFromUser,
} = adminSlice.actions;

export default adminSlice.reducer;
