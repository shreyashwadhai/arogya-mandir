export type CmoLevel = 'CMO_1' | 'CMO_2' | 'CMO_3';
export type UserRole = 'SUPER_ADMIN' | CmoLevel;
export type GeographicZone = 'North' | 'South' | 'East' | 'West' | 'Central';

export interface CmoUser {
  id: string; // e.g. 'cmo-1', 'cmo-2', 'cmo-3', 'super-admin'
  name: string;
  designation: string;
  email: string;
  role: UserRole;
  level: CmoLevel | 'SUPER_ADMIN';
  parentCmoId: string | null; // ID of upper CMO, null for CMO_3 or Super Admin
  zone: GeographicZone;
  district: string; // e.g. "North Delhi", "South Delhi"
  assignedCentreIds: string[]; // List of Arogya Mandir centre IDs
  status: 'active' | 'inactive';
  phone: string;
  avatarUrl?: string;
}

export interface ArogyaCentre {
  id: string;
  name: string; // e.g. "Rohini Sector 7 Arogya Mandir"
  code: string; // e.g. "DEL/AM/ROH"
  zone: GeographicZone;
  district: string; // e.g. "North Delhi"
  locality: string;
  address: string;
  cmoId: string; // Assigned CMO_1 ID
  contactPhone: string;
  activePatientsCount: number;
}

export interface EscalationHistoryItem {
  id: string;
  escalatedByCmoId: string;
  escalatedByCmoName: string;
  escalatedByRole: string;
  escalatedToCmoId: string;
  escalatedToCmoName: string;
  escalatedToRole: string;
  timestamp: string;
  reasonText: string;
  voiceNoteUrl?: string | null;
  actionType?: 'escalate' | 'revert' | 'resolve';
}

export interface FeedbackReplyItem {
  questionKey: string;
  questionText: string;
  patientComment: string;
  replyText: string;
  hasVoiceNote?: boolean;
  audioUrl?: string | null;
  repliedBy: string; // Name of CMO
  repliedByRole: string;
  repliedAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // CMO ID or 'super-admin'
  message: string;
  timestamp: string;
  feedbackId: string;
  trackingId: string;
  isRead: boolean;
  type: 'escalation' | 'resolution' | 'new_feedback' | 'revert';
  escalatedBy?: string;
}

export interface FeedbackCategoryRating {
  rating: 'Could Be Better' | 'Acceptable' | 'Excellent';
  comments: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  tags: string[];
}

export interface FeedbackRecord {
  id: string;
  trackingId: string;
  patientName: string;
  gender: string;
  age: number;
  mobileNumber: string;
  aadhaarMasked: string;
  address: string;
  facilityName: string; // Arogya Mandir centre name
  centreId: string;
  district: string;
  zone: GeographicZone;
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
  overallStarRating?: number; // 1 to 5 stars
  status: 'Assigned to CMO' | 'Action In Progress' | 'Escalated' | 'Resolved' | 'Closed' | 'Reverted';
  assignedCmoId: string; // ID of CMO currently handling this
  previousCmoId?: string | null;
  urgency: 'High SLA Priority' | 'Normal';
  isGrievance: boolean;
  complaintCountText?: string;
  
  // Category Details
  registration: FeedbackCategoryRating;
  doctor: FeedbackCategoryRating;
  pharmacy: FeedbackCategoryRating;
  cleanliness: FeedbackCategoryRating;
  suggestions: {
    text: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
  };
  
  // Escalation History & Replies
  escalationHistory: EscalationHistoryItem[];
  replies: Record<string, FeedbackReplyItem>; // Map of questionKey -> reply
  
  officerNotes?: Array<{
    date: string;
    officer: string;
    note: string;
  }>;
}

export interface FeedbackQuestion {
  id: string;
  key: string; // e.g. "doctor", "pharmacy", "cleanliness"
  category: string;
  text: string;
  hindiText: string;
  slaHours: number; // e.g. 24, 48 hours
  isActive: boolean;
  order: number;
}
