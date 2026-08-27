import { DEFAULT_FEEDBACKS } from '../../services/storageService';

export interface FeedbackRecord {
  id: string;
  trackingId: string;
  patientName: string;
  gender: string;
  age: number;
  mobileNumber: string;
  aadhaarMasked: string;
  address: string;
  facilityName: string;
  district: string;
  timestamp: string;
  date: string;
  month: string;
  year: string;
  clinicName: string;
  clinicCode: string;
  stationHq: string;
  visitorType: 'Dependant';
  responseType: 'Excellent Service' | 'Acceptable standard' | 'Could Be Better';
  overallRating: 'Could Be Better' | 'Acceptable' | 'Excellent';
  status: 'Assigned to CMO' | 'Action In Progress' | 'Logged & Verified' | 'Resolved';
  urgency: 'High SLA Priority' | 'Normal';
  isGrievance: boolean;
  complaintCountText?: string;
  
  registration: {
    rating: 'Could Be Better' | 'Acceptable' | 'Excellent';
    comments: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
    tags: string[];
  };
  doctor: {
    rating: 'Could Be Better' | 'Acceptable' | 'Excellent';
    comments: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
    tags: string[];
  };
  pharmacy: {
    rating: 'Could Be Better' | 'Acceptable' | 'Excellent';
    comments: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
    tags: string[];
  };
  cleanliness: {
    rating: 'Could Be Better' | 'Acceptable' | 'Excellent';
    comments: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
    tags: string[];
  };
  suggestions: {
    text: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
  };
  
  officerNotes?: Array<{
    date: string;
    officer: string;
    note: string;
  }>;
}

export const DUMMY_FEEDBACK_RECORDS: FeedbackRecord[] = DEFAULT_FEEDBACKS as any;
