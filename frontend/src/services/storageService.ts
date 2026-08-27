import type {
  CmoUser,
  ArogyaCentre,
  FeedbackRecord,
  FeedbackQuestion,
  NotificationItem,
  EscalationHistoryItem,
  FeedbackReplyItem,
} from '../types/cmoTypes';

const STORAGE_KEYS = {
  CMOS: 'arogya_cmos_v1',
  CENTRES: 'arogya_centres_v1',
  FEEDBACKS: 'arogya_feedbacks_v2',
  QUESTIONS: 'arogya_questions_v1',
  NOTIFICATIONS: 'arogya_notifications_v1',
};

// Initial Realistic Delhi Arogya Mandir Dummy Data

export const DEFAULT_CMOS: CmoUser[] = [
  {
    id: 'super-admin',
    name: 'Dr. V. K. Paul',
    designation: 'Director General, Delhi State Health Mission (SuperAdmin)',
    email: 'superadmin@arogyamandir.delhi.gov.in',
    role: 'SUPER_ADMIN',
    level: 'SUPER_ADMIN',
    parentCmoId: null,
    zone: 'Central',
    district: 'All Districts (Delhi Capital Region)',
    assignedCentreIds: ['am-1', 'am-2', 'am-3', 'am-4', 'am-5', 'am-6'],
    status: 'active',
    phone: '+91 98110 01100',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-3',
    name: 'Dr. Rajesh Sharma',
    designation: 'State Upper Chief Medical Officer (CMO_3)',
    email: 'cmo3@arogyamandir.delhi.gov.in',
    role: 'CMO_3',
    level: 'CMO_3',
    parentCmoId: 'super-admin',
    zone: 'Central',
    district: 'Delhi State Capital Region (All Zones)',
    assignedCentreIds: ['am-1', 'am-2', 'am-3', 'am-4', 'am-5', 'am-6'],
    status: 'active',
    phone: '+91 98112 23344',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-2-north',
    name: 'Dr. Sunita Verma',
    designation: 'North Zone Nodal Officer (CMO_2)',
    email: 'cmo2.north@arogyamandir.delhi.gov.in',
    role: 'CMO_2',
    level: 'CMO_2',
    parentCmoId: 'cmo-3',
    zone: 'North',
    district: 'North Delhi District',
    assignedCentreIds: ['am-1', 'am-2'],
    status: 'active',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-2-south',
    name: 'Dr. Anil Kapoor',
    designation: 'South Zone Nodal Officer (CMO_2)',
    email: 'cmo2.south@arogyamandir.delhi.gov.in',
    role: 'CMO_2',
    level: 'CMO_2',
    parentCmoId: 'cmo-3',
    zone: 'South',
    district: 'South Delhi District',
    assignedCentreIds: ['am-5'],
    status: 'active',
    phone: '+91 98765 43211',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-2-east',
    name: 'Dr. Meena Gupta',
    designation: 'East Zone Nodal Officer (CMO_2)',
    email: 'cmo2.east@arogyamandir.delhi.gov.in',
    role: 'CMO_2',
    level: 'CMO_2',
    parentCmoId: 'cmo-3',
    zone: 'East',
    district: 'East Delhi District',
    assignedCentreIds: ['am-6'],
    status: 'active',
    phone: '+91 98765 43212',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-2-west',
    name: 'Dr. Rakesh Yadav',
    designation: 'West Zone Nodal Officer (CMO_2)',
    email: 'cmo2.west@arogyamandir.delhi.gov.in',
    role: 'CMO_2',
    level: 'CMO_2',
    parentCmoId: 'cmo-3',
    zone: 'West',
    district: 'West Delhi District',
    assignedCentreIds: ['am-3'],
    status: 'active',
    phone: '+91 98765 43213',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-1-rohini',
    name: 'Dr. Amit Kumar',
    designation: 'Primary Area Officer (CMO_1 - Rohini)',
    email: 'cmo1.rohini@arogyamandir.delhi.gov.in',
    role: 'CMO_1',
    level: 'CMO_1',
    parentCmoId: 'cmo-2-north',
    zone: 'North',
    district: 'Rohini Sector 7 Sub-District',
    assignedCentreIds: ['am-1'],
    status: 'active',
    phone: '+91 91234 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-1-pitampura',
    name: 'Dr. Priya Singh',
    designation: 'Primary Area Officer (CMO_1 - Pitampura)',
    email: 'cmo1.pitampura@arogyamandir.delhi.gov.in',
    role: 'CMO_1',
    level: 'CMO_1',
    parentCmoId: 'cmo-2-north',
    zone: 'North',
    district: 'Pitampura Sub-District',
    assignedCentreIds: ['am-2'],
    status: 'active',
    phone: '+91 91234 56790',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-1-janakpuri',
    name: 'Dr. Vikas Malhotra',
    designation: 'Primary Area Officer (CMO_1 - Janakpuri)',
    email: 'cmo1.janakpuri@arogyamandir.delhi.gov.in',
    role: 'CMO_1',
    level: 'CMO_1',
    parentCmoId: 'cmo-2-west',
    zone: 'West',
    district: 'Janakpuri Sub-District',
    assignedCentreIds: ['am-3'],
    status: 'active',
    phone: '+91 91234 56791',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cmo-1-cp',
    name: 'Dr. Swati Saxena',
    designation: 'Primary Area Officer (CMO_1 - Connaught Place)',
    email: 'cmo1.cp@arogyamandir.delhi.gov.in',
    role: 'CMO_1',
    level: 'CMO_1',
    parentCmoId: 'cmo-2-north',
    zone: 'Central',
    district: 'Central Delhi Sub-District',
    assignedCentreIds: ['am-4'],
    status: 'active',
    phone: '+91 91234 56792',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
  },
];

export const DEFAULT_CENTRES: ArogyaCentre[] = [
  {
    id: 'am-1',
    name: 'Rohini Sector 7 Arogya Mandir',
    code: 'DEL/AM/ROH-07',
    zone: 'North',
    district: 'North Delhi',
    locality: 'Rohini Sector 7',
    address: 'Plot 4, Community Centre, Rohini Sector 7, New Delhi - 110085',
    cmoId: 'cmo-1',
    contactPhone: '+91 11 2704 1122',
    activePatientsCount: 1420,
  },
  {
    id: 'am-2',
    name: 'Pitampura Health & Wellness Centre',
    code: 'DEL/AM/PIT-02',
    zone: 'North',
    district: 'North Delhi',
    locality: 'Pitampura',
    address: 'Near TV Tower, Outer Ring Rd, Pitampura, New Delhi - 110034',
    cmoId: 'cmo-2',
    contactPhone: '+91 11 2731 8899',
    activePatientsCount: 1890,
  },
  {
    id: 'am-3',
    name: 'Janakpuri Block C Arogya Mandir',
    code: 'DEL/AM/JNK-03',
    zone: 'West',
    district: 'West Delhi',
    locality: 'Janakpuri',
    address: 'Block C, Opposite District Park, Janakpuri, New Delhi - 110058',
    cmoId: 'cmo-2',
    contactPhone: '+91 11 2555 4433',
    activePatientsCount: 1640,
  },
  {
    id: 'am-4',
    name: 'Connaught Place Model Arogya Centre',
    code: 'DEL/AM/CP-01',
    zone: 'Central',
    district: 'Central Delhi',
    locality: 'Connaught Place',
    address: 'Middle Circle, Block B, Connaught Place, New Delhi - 110001',
    cmoId: 'cmo-3',
    contactPhone: '+91 11 2332 9988',
    activePatientsCount: 2210,
  },
  {
    id: 'am-5',
    name: 'Lajpat Nagar Urban Health Centre',
    code: 'DEL/AM/LJP-04',
    zone: 'South',
    district: 'South Delhi',
    locality: 'Lajpat Nagar IV',
    address: 'Near National Heart Institute, Lajpat Nagar IV, New Delhi - 110024',
    cmoId: 'cmo-3',
    contactPhone: '+91 11 2643 7711',
    activePatientsCount: 1950,
  },
  {
    id: 'am-6',
    name: 'Preet Vihar Arogya Mandir',
    code: 'DEL/AM/PV-05',
    zone: 'East',
    district: 'East Delhi',
    locality: 'Preet Vihar',
    address: 'Main Vikas Marg, Near Metro Station, Preet Vihar, Delhi - 110092',
    cmoId: 'cmo-3',
    contactPhone: '+91 11 2252 6600',
    activePatientsCount: 1380,
  },
];

export const DEFAULT_QUESTIONS: FeedbackQuestion[] = [
  {
    id: 'q-1',
    key: 'doctor',
    category: 'Medical Care & Consultation',
    text: 'How was your Doctor Consultation Experience?',
    hindiText: 'आपका डॉक्टर परामर्श अनुभव कैसा रहा?',
    slaHours: 24,
    isActive: true,
    order: 1,
  },
  {
    id: 'q-2',
    key: 'pharmacy',
    category: 'Pharmacy & Dispensary',
    text: 'How was your Pharmacy / Medicine Counter Experience?',
    hindiText: 'आपका फार्मेसी / दवा काउंटर अनुभव कैसा रहा?',
    slaHours: 24,
    isActive: true,
    order: 2,
  },
  {
    id: 'q-3',
    key: 'cleanliness',
    category: 'Facility Sanitation',
    text: 'How was the Cleanliness & Sanitation of the Facility?',
    hindiText: 'सुविधा की स्वच्छता और सफाई कैसी थी?',
    slaHours: 48,
    isActive: true,
    order: 3,
  },
  {
    id: 'q-4',
    key: 'registration',
    category: 'Registration & Reception',
    text: 'How was your Registration and Waiting Experience?',
    hindiText: 'आपका पंजीकरण और प्रतीक्षा अनुभव कैसा रहा?',
    slaHours: 24,
    isActive: true,
    order: 4,
  },
  {
    id: 'q-5',
    key: 'suggestions',
    category: 'General Grievance & Feedback',
    text: 'Any Suggestions, Grievance or Additional Comments?',
    hindiText: 'कोई सुझाव, शिकायत या अतिरिक्त टिप्पणी?',
    slaHours: 72,
    isActive: true,
    order: 5,
  },
];

const createFb = (
  id: string,
  trackingId: string,
  patientName: string,
  gender: string,
  age: number,
  mobileNumber: string,
  address: string,
  facilityName: string,
  centreId: string,
  district: string,
  zone: 'North' | 'South' | 'East' | 'West' | 'Central',
  clinicName: string,
  clinicCode: string,
  assignedCmoId: string,
  date: string,
  timestamp: string,
  isGrievance: boolean,
  rating: 'Could Be Better' | 'Acceptable' | 'Excellent',
  issueSummary: string,
  complaintCategory: 'doctor' | 'pharmacy' | 'cleanliness' | 'registration',
  tags: string[]
): FeedbackRecord => ({
  id,
  trackingId,
  patientName,
  gender,
  age,
  mobileNumber,
  aadhaarMasked: `A H XXXX XXXX ${mobileNumber.slice(-4)}`,
  address,
  facilityName,
  centreId,
  district,
  zone,
  timestamp,
  date,
  month: 'Aug',
  year: '2026',
  clinicName,
  clinicCode,
  stationHq: 'Delhi Central Zone',
  visitorType: age > 55 ? 'Dependant' : 'Dependant',
  responseType: rating === 'Excellent' ? 'Excellent Service' : rating === 'Acceptable' ? 'Acceptable standard' : 'Could Be Better',
  overallRating: rating,
  status: isGrievance ? 'Assigned to CMO' : rating === 'Excellent' ? 'Resolved' : 'Assigned to CMO',
  assignedCmoId,
  previousCmoId: null,
  urgency: isGrievance ? 'High SLA Priority' : 'Normal',
  isGrievance,
  complaintCountText: isGrievance ? `${issueSummary.slice(0, 30)}...` : 'Routine Feedback',
  registration: {
    rating: complaintCategory === 'registration' ? rating : 'Acceptable',
    comments: complaintCategory === 'registration' ? issueSummary : 'Registration queue was standard.',
    tags: complaintCategory === 'registration' ? tags : ['Normal Queue'],
  },
  doctor: {
    rating: complaintCategory === 'doctor' ? rating : 'Acceptable',
    comments: complaintCategory === 'doctor' ? issueSummary : 'Doctor consultation completed.',
    tags: complaintCategory === 'doctor' ? tags : ['Good Doctor'],
  },
  pharmacy: {
    rating: complaintCategory === 'pharmacy' ? rating : 'Acceptable',
    comments: complaintCategory === 'pharmacy' ? issueSummary : 'Medicines issued.',
    tags: complaintCategory === 'pharmacy' ? tags : ['Medicines Available'],
  },
  cleanliness: {
    rating: complaintCategory === 'cleanliness' ? rating : 'Acceptable',
    comments: complaintCategory === 'cleanliness' ? issueSummary : 'Premises clean.',
    tags: complaintCategory === 'cleanliness' ? tags : ['Clean Area'],
  },
  suggestions: { text: issueSummary },
  escalationHistory: [],
  replies: {},
  officerNotes: [{ date, officer: 'System Auto-Assign', note: `Assigned to Primary CMO (${assignedCmoId}).` }],
});

export const DEFAULT_FEEDBACKS: FeedbackRecord[] = [
  // --- CMO_1 Rohini (cmo-1-rohini) - 13 Feedbacks (10 Could Be Better, 3 Acceptable/Excellent) ---
  createFb('fb-roh-1', 'DEL-AM-2026-98101', 'Subhash Chandra Gupta', 'Male', 54, '+91 98118 72075', 'Flat 302, Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-27', 'Aug. 27, 2026, 09:15 AM', true, 'Could Be Better', 'Doctor was late by 45 minutes and consultation duration was very short.', 'doctor', ['Doctor Delay', 'Short Consultation']),
  createFb('fb-roh-2', 'DEL-AM-2026-98102', 'Smt. Kavita Sharma', 'Female', 42, '+91 98712 34102', 'House 45, Rohini Sec 8', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-27', 'Aug. 27, 2026, 09:40 AM', true, 'Could Be Better', 'Washrooms were not cleaned properly and tap was broken.', 'cleanliness', ['Washroom Hygiene']),
  createFb('fb-roh-3', 'DEL-AM-2026-98103', 'Rajesh Kumar Verma', 'Male', 61, '+91 98100 98103', 'Pocket A-3, Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-26', 'Aug. 26, 2026, 02:15 PM', true, 'Could Be Better', 'Metformin diabetic tablet unavailable at pharmacy.', 'pharmacy', ['Out of Stock']),
  createFb('fb-roh-4', 'DEL-AM-2026-98104', 'Meenakshi Sundaram', 'Female', 35, '+91 99112 98104', 'Block B, Rohini Sec 6', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-26', 'Aug. 26, 2026, 11:10 AM', true, 'Could Be Better', 'Counter staff unhelpful and uncooperative during registration.', 'registration', ['Unhelpful Staff']),
  createFb('fb-roh-5', 'DEL-AM-2026-98105', 'Harish Chander Malhotra', 'Male', 68, '+91 98188 98105', 'House 112, Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-25', 'Aug. 25, 2026, 10:20 AM', true, 'Could Be Better', 'ECG machine out of order, patient sent away without test.', 'doctor', ['Equipment Failure']),
  createFb('fb-roh-6', 'DEL-AM-2026-98106', 'Sunita Devi', 'Female', 50, '+91 98733 98106', 'Rohini Sec 8', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-25', 'Aug. 25, 2026, 11:45 AM', true, 'Could Be Better', 'No drinking water in dispenser in waiting hall.', 'cleanliness', ['No Water']),
  createFb('fb-roh-7', 'DEL-AM-2026-98107', 'Deepak Jindal', 'Male', 45, '+91 98101 98107', 'Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-24', 'Aug. 24, 2026, 09:50 AM', true, 'Could Be Better', 'Doctor rushed consultation without reviewing previous medical reports.', 'doctor', ['Short Consultation']),
  createFb('fb-roh-8', 'DEL-AM-2026-98108', 'Rekha Agarwal', 'Female', 38, '+91 99991 98108', 'Pocket F, Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-24', 'Aug. 24, 2026, 01:40 PM', true, 'Could Be Better', 'Dispensary shutter closed early at 1:40 PM before official time.', 'pharmacy', ['Early Close']),
  createFb('fb-roh-9', 'DEL-AM-2026-98109', 'Suresh Pal', 'Male', 59, '+91 98114 98109', 'Rohini Sec 8', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-23', 'Aug. 23, 2026, 10:30 AM', true, 'Could Be Better', 'Overflowing dustbins in OPD corridor causing foul smell.', 'cleanliness', ['Sanitation Issue']),
  createFb('fb-roh-10', 'DEL-AM-2026-98110', 'Geeta Rani', 'Female', 47, '+91 98711 98110', 'Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-23', 'Aug. 23, 2026, 11:15 AM', true, 'Could Be Better', 'Token server down, manual queue was chaotic.', 'registration', ['System Crash']),
  createFb('fb-roh-11', 'DEL-AM-2026-98111', 'Mohit Saxena', 'Male', 29, '+91 98991 98111', 'Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-22', 'Aug. 22, 2026, 10:00 AM', false, 'Acceptable', 'Reasonable waiting time and standard consultation.', 'doctor', ['Good Care']),
  createFb('fb-roh-12', 'DEL-AM-2026-98112', 'Asha Lata', 'Female', 63, '+91 98102 98112', 'Rohini Sec 7', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-22', 'Aug. 22, 2026, 11:30 AM', false, 'Excellent', 'Prompt blood pressure checkup and very polite doctor.', 'doctor', ['Caring Doctor']),
  createFb('fb-roh-13', 'DEL-AM-2026-98113', 'Vinod Tyagi', 'Male', 52, '+91 98118 98113', 'Rohini Sec 8', 'Rohini Sector 7 Arogya Mandir', 'am-1', 'North Delhi', 'North', 'Rohini Sector 7', 'DEL/AM/ROH-07', 'cmo-1-rohini', '2026-08-21', 'Aug. 21, 2026, 09:30 AM', false, 'Acceptable', 'Standard OPD consultation.', 'registration', ['Normal']),

  // --- CMO_1 Pitampura (cmo-1-pitampura) - 13 Feedbacks (10 Could Be Better, 3 Acceptable/Excellent) ---
  createFb('fb-pit-1', 'DEL-AM-2026-98201', 'Smt. Sunita Rani', 'Female', 48, '+91 98712 34567', 'Pitampura Village', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-27', 'Aug. 27, 2026, 11:30 AM', true, 'Could Be Better', 'BP tablet Amlodipine 5mg out of stock at dispensary.', 'pharmacy', ['Out of Stock']),
  createFb('fb-pit-2', 'DEL-AM-2026-98202', 'Col. Rameshwar Dayal', 'Male', 67, '+91 99100 88776', 'Outer Ring Rd, Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-27', 'Aug. 27, 2026, 10:15 AM', true, 'Could Be Better', 'Seating shortage for senior citizens in waiting hall.', 'registration', ['No Chairs']),
  createFb('fb-pit-3', 'DEL-AM-2026-98203', 'Anil Kulkarni', 'Male', 53, '+91 98119 98203', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-26', 'Aug. 26, 2026, 09:30 AM', true, 'Could Be Better', 'Doctor absent during morning OPD hours until 10 AM.', 'doctor', ['Doctor Absent']),
  createFb('fb-pit-4', 'DEL-AM-2026-98204', 'Pooja Singhal', 'Female', 31, '+91 99104 98204', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-26', 'Aug. 26, 2026, 01:20 PM', true, 'Could Be Better', 'Lab report delivery delayed by 3 days.', 'doctor', ['Lab Delay']),
  createFb('fb-pit-5', 'DEL-AM-2026-98205', 'Satish Chand', 'Male', 60, '+91 98115 98205', 'TV Tower Area, Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-25', 'Aug. 25, 2026, 11:00 AM', true, 'Could Be Better', 'No wheelchair assistance at entrance for disabled patients.', 'registration', ['No Wheelchair']),
  createFb('fb-pit-6', 'DEL-AM-2026-98206', 'Madhu Mohan', 'Female', 44, '+91 98716 98206', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-25', 'Aug. 25, 2026, 12:40 PM', true, 'Could Be Better', 'Dressing room dirty, lack of medical cotton and bandages.', 'cleanliness', ['Dirty Dressing Room']),
  createFb('fb-pit-7', 'DEL-AM-2026-98207', 'Joginder Singh', 'Male', 71, '+91 98117 98207', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-24', 'Aug. 24, 2026, 10:45 AM', true, 'Could Be Better', 'Thyroid generic medicine thyroxine out of stock.', 'pharmacy', ['Thyroxine Missing']),
  createFb('fb-pit-8', 'DEL-AM-2026-98208', 'Preeti Goyal', 'Female', 36, '+91 99108 98208', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-24', 'Aug. 24, 2026, 11:55 AM', true, 'Could Be Better', 'Counter staff rude during registration.', 'registration', ['Rude Staff']),
  createFb('fb-pit-9', 'DEL-AM-2026-98209', 'Naresh Kumar', 'Male', 56, '+91 98119 98209', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-23', 'Aug. 23, 2026, 09:20 AM', true, 'Could Be Better', 'Doctor consultation room AC not working, suffocation inside.', 'doctor', ['AC Breakdown']),
  createFb('fb-pit-10', 'DEL-AM-2026-98210', 'Sarita Bishnoi', 'Female', 49, '+91 98710 98210', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-23', 'Aug. 23, 2026, 10:50 AM', true, 'Could Be Better', 'Long waiting for blood sample collection, single technician.', 'doctor', ['Phlebotomy Delay']),
  createFb('fb-pit-11', 'DEL-AM-2026-98211', 'Tarun Grover', 'Male', 33, '+91 98991 98211', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-22', 'Aug. 22, 2026, 11:15 AM', false, 'Acceptable', 'Blood test completed smoothly.', 'doctor', ['Good']),
  createFb('fb-pit-12', 'DEL-AM-2026-98212', 'Shashi Kapoor', 'Female', 65, '+91 98102 98212', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-22', 'Aug. 22, 2026, 12:00 PM', false, 'Excellent', 'Great care by doctor and nursing staff.', 'doctor', ['Great Care']),
  createFb('fb-pit-13', 'DEL-AM-2026-98213', 'Arvind Joshi', 'Male', 58, '+91 98113 98213', 'Pitampura', 'Pitampura Health & Wellness Centre', 'am-2', 'North Delhi', 'North', 'Pitampura', 'DEL/AM/PIT-02', 'cmo-1-pitampura', '2026-08-21', 'Aug. 21, 2026, 10:10 AM', false, 'Acceptable', 'General health consultation satisfactory.', 'registration', ['Satisfactory']),

  // --- CMO_1 Janakpuri (cmo-1-janakpuri) - 13 Feedbacks (10 Could Be Better, 3 Acceptable/Excellent) ---
  createFb('fb-jnk-1', 'DEL-AM-2026-98301', 'Mahendra Pratap', 'Male', 62, '+91 98111 98301', 'Block C, Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-27', 'Aug. 27, 2026, 09:50 AM', true, 'Could Be Better', 'Insulin injection disposable syringes out of stock.', 'pharmacy', ['Syringes Missing']),
  createFb('fb-jnk-2', 'DEL-AM-2026-98302', 'Sarojini Devi', 'Female', 57, '+91 98712 98302', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-27', 'Aug. 27, 2026, 11:10 AM', true, 'Could Be Better', 'Doctor spent less than 2 minutes for consultation.', 'doctor', ['Too Short']),
  createFb('fb-jnk-3', 'DEL-AM-2026-98303', 'Alok Mathur', 'Male', 41, '+91 98103 98303', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-26', 'Aug. 26, 2026, 10:40 AM', true, 'Could Be Better', 'Dirty waiting hall chairs and dusty floor.', 'cleanliness', ['Dirty Chairs']),
  createFb('fb-jnk-4', 'DEL-AM-2026-98304', 'Nirmala Rao', 'Female', 50, '+91 99104 98304', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-26', 'Aug. 26, 2026, 12:15 PM', true, 'Could Be Better', 'Registration counter closed during peak OPD hours.', 'registration', ['Counter Closed']),
  createFb('fb-jnk-5', 'DEL-AM-2026-98305', 'Bhupendra Yagnik', 'Male', 69, '+91 98105 98305', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-25', 'Aug. 25, 2026, 09:30 AM', true, 'Could Be Better', 'Telmisartan hypertension tablets out of stock.', 'pharmacy', ['Out of Stock']),
  createFb('fb-jnk-6', 'DEL-AM-2026-98306', 'Kamla Vati', 'Female', 73, '+91 98706 98306', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-25', 'Aug. 25, 2026, 11:20 AM', true, 'Could Be Better', 'No ramp access for elderly patients with walker.', 'registration', ['No Ramp']),
  createFb('fb-jnk-7', 'DEL-AM-2026-98307', 'Rakesh Jhunjhunwala', 'Male', 46, '+91 98107 98307', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-24', 'Aug. 24, 2026, 10:00 AM', true, 'Could Be Better', 'Too noisy in consultation room, multiple people entering.', 'doctor', ['Noisy OPD']),
  createFb('fb-jnk-8', 'DEL-AM-2026-98308', 'Sudha Chandran', 'Female', 39, '+91 99108 98308', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-24', 'Aug. 24, 2026, 11:40 AM', true, 'Could Be Better', 'Doctor started OPD late at 10:15 AM.', 'doctor', ['Late OPD']),
  createFb('fb-jnk-9', 'DEL-AM-2026-98309', 'Gagan Deep', 'Male', 51, '+91 98109 98309', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-23', 'Aug. 23, 2026, 09:40 AM', true, 'Could Be Better', 'Pharmacy staff reluctant to explain medicine dosage.', 'pharmacy', ['No Explanation']),
  createFb('fb-jnk-10', 'DEL-AM-2026-98310', 'Usha Sharma', 'Female', 64, '+91 98710 98310', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-23', 'Aug. 23, 2026, 11:30 AM', true, 'Could Be Better', 'Unsanitary water spillage near drinking water cooler.', 'cleanliness', ['Water Spillage']),
  createFb('fb-jnk-11', 'DEL-AM-2026-98311', 'Pankaj Tripathi', 'Male', 45, '+91 98991 98311', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-22', 'Aug. 22, 2026, 10:15 AM', false, 'Acceptable', 'Fever medicine given promptly.', 'pharmacy', ['Tablets']),
  createFb('fb-jnk-12', 'DEL-AM-2026-98312', 'Vimla Devi', 'Female', 68, '+91 98102 98312', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-22', 'Aug. 22, 2026, 11:50 AM', false, 'Excellent', 'Polite behavior by pharmacist and thorough doctor.', 'pharmacy', ['Polite Pharmacist']),
  createFb('fb-jnk-13', 'DEL-AM-2026-98313', 'Sanjeev Kohli', 'Male', 54, '+91 98113 98313', 'Janakpuri', 'Janakpuri Block C Arogya Mandir', 'am-3', 'West Delhi', 'West', 'Janakpuri', 'DEL/AM/JNK-03', 'cmo-1-janakpuri', '2026-08-21', 'Aug. 21, 2026, 09:20 AM', false, 'Acceptable', 'Routine checkup went fine.', 'doctor', ['Fine']),

  // --- CMO_1 Connaught Place (cmo-1-cp) - 13 Feedbacks (10 Could Be Better, 3 Acceptable/Excellent) ---
  createFb('fb-cp-1', 'DEL-AM-2026-98401', 'Sarojini Naidu', 'Female', 70, '+91 98111 98401', 'Middle Circle, CP', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-27', 'Aug. 27, 2026, 09:10 AM', true, 'Could Be Better', 'Extremely long queue at registration counter.', 'registration', ['Long Queue']),
  createFb('fb-cp-2', 'DEL-AM-2026-98402', 'Vikramaditya Singh', 'Male', 48, '+91 98712 98402', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-27', 'Aug. 27, 2026, 10:30 AM', true, 'Could Be Better', 'Doctor not present in room during official OPD shift.', 'doctor', ['Doctor Missing']),
  createFb('fb-cp-3', 'DEL-AM-2026-98403', 'Ananya Deshmukh', 'Female', 32, '+91 99103 98403', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-26', 'Aug. 26, 2026, 11:20 AM', true, 'Could Be Better', 'Cleanliness of washroom unacceptable, bad odor.', 'cleanliness', ['Bad Odor Washroom']),
  createFb('fb-cp-4', 'DEL-AM-2026-98404', 'Brijesh Mishra', 'Male', 59, '+91 98104 98404', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-26', 'Aug. 26, 2026, 01:10 PM', true, 'Could Be Better', 'Multivitamin and Calcium tablets unavailable.', 'pharmacy', ['Supplements Missing']),
  createFb('fb-cp-5', 'DEL-AM-2026-98405', 'Kausar Jahan', 'Female', 45, '+91 98705 98405', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-25', 'Aug. 25, 2026, 09:45 AM', true, 'Could Be Better', 'Doctor prescribed branded medicine not in dispensary.', 'doctor', ['Branded Medicine']),
  createFb('fb-cp-6', 'DEL-AM-2026-98406', 'Hemant Soren', 'Male', 53, '+91 98106 98406', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-25', 'Aug. 25, 2026, 11:50 AM', true, 'Could Be Better', 'Token display screen malfunctioning, caused confusion.', 'registration', ['Display Broken']),
  createFb('fb-cp-7', 'DEL-AM-2026-98407', 'Seema Rastogi', 'Female', 41, '+91 99107 98407', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-24', 'Aug. 24, 2026, 10:15 AM', true, 'Could Be Better', 'No hand sanitizer or soap available in washrooms.', 'cleanliness', ['No Soap']),
  createFb('fb-cp-8', 'DEL-AM-2026-98408', 'Kailash Nath', 'Male', 66, '+91 98108 98408', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-24', 'Aug. 24, 2026, 12:00 PM', true, 'Could Be Better', 'Doctor delayed arrival by 1 hour.', 'doctor', ['Doctor Delay']),
  createFb('fb-cp-9', 'DEL-AM-2026-98409', 'Farida Parveen', 'Female', 55, '+91 98709 98409', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-23', 'Aug. 23, 2026, 09:30 AM', true, 'Could Be Better', 'Dispensary queue unmanaged, jumping of line.', 'pharmacy', ['Queue Jump']),
  createFb('fb-cp-10', 'DEL-AM-2026-98410', 'Trilok Chand', 'Male', 63, '+91 98110 98410', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-23', 'Aug. 23, 2026, 11:00 AM', true, 'Could Be Better', 'No ceiling fans working in waiting area hall.', 'cleanliness', ['Fan Breakdown']),
  createFb('fb-cp-11', 'DEL-AM-2026-98411', 'Rajiv Bajaj', 'Male', 37, '+91 98991 98411', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-22', 'Aug. 22, 2026, 10:20 AM', false, 'Acceptable', 'BP monitoring done quickly.', 'doctor', ['BP Monitoring']),
  createFb('fb-cp-12', 'DEL-AM-2026-98412', 'Savitri Devi', 'Female', 72, '+91 98102 98412', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-22', 'Aug. 22, 2026, 11:30 AM', false, 'Excellent', 'Security guard helped with wheelchair, great care.', 'registration', ['Wheelchair Help']),
  createFb('fb-cp-13', 'DEL-AM-2026-98413', 'Manmohan Sethi', 'Male', 50, '+91 98113 98413', 'Connaught Place', 'Connaught Place Model Arogya Centre', 'am-4', 'Central Delhi', 'Central', 'Connaught Place', 'DEL/AM/CP-01', 'cmo-1-cp', '2026-08-21', 'Aug. 21, 2026, 09:50 AM', false, 'Acceptable', 'Standard health checkup completed.', 'doctor', ['Completed']),
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-101',
    recipientId: 'cmo-2',
    message: 'Feedback DEL-AM-2026-98102 escalated to you by Dr. Amit Kumar (CMO_1). Reason: Stock replenishment.',
    timestamp: '2026-08-25 02:15 PM',
    feedbackId: 'fb-102',
    trackingId: 'DEL-AM-2026-98102',
    isRead: false,
    type: 'escalation',
    escalatedBy: 'Dr. Amit Kumar',
  },
  {
    id: 'notif-102',
    recipientId: 'cmo-1',
    message: 'New grievance feedback DEL-AM-2026-98101 received from Rohini Sector 7 Centre.',
    timestamp: '2026-08-26 09:15 AM',
    feedbackId: 'fb-101',
    trackingId: 'DEL-AM-2026-98101',
    isRead: false,
    type: 'new_feedback',
  },
];

// Storage Helper Functions
export class StorageService {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // Getters
  static getCmos(): CmoUser[] {
    if (!this.isClient()) return DEFAULT_CMOS;
    const data = localStorage.getItem(STORAGE_KEYS.CMOS);
    if (!data) {
      this.saveCmos(DEFAULT_CMOS);
      return DEFAULT_CMOS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CMOS;
    }
  }

  static getCentres(): ArogyaCentre[] {
    if (!this.isClient()) return DEFAULT_CENTRES;
    const data = localStorage.getItem(STORAGE_KEYS.CENTRES);
    if (!data) {
      this.saveCentres(DEFAULT_CENTRES);
      return DEFAULT_CENTRES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CENTRES;
    }
  }

  static getFeedbacks(): FeedbackRecord[] {
    if (!this.isClient()) return DEFAULT_FEEDBACKS;
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    if (!data) {
      this.saveFeedbacks(DEFAULT_FEEDBACKS);
      return DEFAULT_FEEDBACKS;
    }
    try {
      const records: FeedbackRecord[] = JSON.parse(data);
      let updated = false;
      DEFAULT_FEEDBACKS.forEach((def) => {
        if (!records.some((r) => r.id === def.id || r.trackingId === def.trackingId)) {
          records.unshift(def);
          updated = true;
        }
      });
      if (updated) {
        this.saveFeedbacks(records);
      }
      return records;
    } catch {
      return DEFAULT_FEEDBACKS;
    }
  }

  static getQuestions(): FeedbackQuestion[] {
    if (!this.isClient()) return DEFAULT_QUESTIONS;
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!data) {
      this.saveQuestions(DEFAULT_QUESTIONS);
      return DEFAULT_QUESTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_QUESTIONS;
    }
  }

  static getNotifications(recipientId?: string): NotificationItem[] {
    if (!this.isClient()) return DEFAULT_NOTIFICATIONS;
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let items: NotificationItem[] = DEFAULT_NOTIFICATIONS;
    if (data) {
      try {
        items = JSON.parse(data);
      } catch {
        items = DEFAULT_NOTIFICATIONS;
      }
    }
    if (recipientId) {
      return items.filter(
        (n) => n.recipientId === recipientId || recipientId === 'super-admin'
      );
    }
    return items;
  }

  // Setters
  static saveCmos(cmos: CmoUser[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.CMOS, JSON.stringify(cmos));
    }
  }

  static saveCentres(centres: ArogyaCentre[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.CENTRES, JSON.stringify(centres));
    }
  }

  static saveFeedbacks(feedbacks: FeedbackRecord[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
    }
  }

  static saveQuestions(questions: FeedbackQuestion[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }
  }

  static saveNotifications(notifications: NotificationItem[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  // Specific Actions
  static addCmo(cmo: CmoUser): void {
    const list = this.getCmos();
    list.push(cmo);
    this.saveCmos(list);
  }

  static updateCmo(cmo: CmoUser): void {
    const list = this.getCmos().map((c) => (c.id === cmo.id ? cmo : c));
    this.saveCmos(list);
  }

  static addCentre(centre: ArogyaCentre): void {
    const list = this.getCentres();
    list.push(centre);
    this.saveCentres(list);
  }

  static updateCentre(centre: ArogyaCentre): void {
    const list = this.getCentres().map((c) => (c.id === centre.id ? centre : c));
    this.saveCentres(list);
  }

  static addFeedback(record: FeedbackRecord): void {
    const list = this.getFeedbacks();
    list.unshift(record);
    this.saveFeedbacks(list);
  }

  static updateFeedback(record: FeedbackRecord): void {
    const list = this.getFeedbacks().map((r) => (r.id === record.id ? record : r));
    this.saveFeedbacks(list);
  }

  static escalateFeedback(
    feedbackId: string,
    targetCmoId: string,
    currentCmo: CmoUser,
    reasonText: string,
    voiceNoteUrl?: string | null
  ): FeedbackRecord | null {
    const feedbacks = this.getFeedbacks();
    const cmos = this.getCmos();
    const targetCmo = cmos.find((c) => c.id === targetCmoId);
    const feedback = feedbacks.find((f) => f.id === feedbackId);

    if (!feedback || !targetCmo) return null;

    const escalationItem: EscalationHistoryItem = {
      id: `esc-${Date.now()}`,
      escalatedByCmoId: currentCmo.id,
      escalatedByCmoName: currentCmo.name,
      escalatedByRole: `${currentCmo.role} (${currentCmo.designation})`,
      escalatedToCmoId: targetCmo.id,
      escalatedToCmoName: targetCmo.name,
      escalatedToRole: `${targetCmo.role} (${targetCmo.designation})`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      reasonText,
      voiceNoteUrl,
    };

    feedback.previousCmoId = feedback.assignedCmoId;
    feedback.assignedCmoId = targetCmo.id;
    feedback.status = 'Escalated';
    feedback.escalationHistory.unshift(escalationItem);

    if (!feedback.officerNotes) feedback.officerNotes = [];
    feedback.officerNotes.unshift({
      date: escalationItem.timestamp,
      officer: currentCmo.name,
      note: `Escalated to ${targetCmo.name} (${targetCmo.role}). Reason: ${reasonText}`,
    });

    this.saveFeedbacks(feedbacks);

    // Create notification for receiving CMO
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: targetCmo.id,
      message: `Feedback ${feedback.trackingId} was escalated to you by ${currentCmo.name} (${currentCmo.role}).`,
      timestamp: escalationItem.timestamp,
      feedbackId: feedback.id,
      trackingId: feedback.trackingId,
      isRead: false,
      type: 'escalation',
      escalatedBy: currentCmo.name,
    };

    const notifs = this.getNotifications();
    notifs.unshift(notifItem);
    this.saveNotifications(notifs);

    return feedback;
  }

  static addReply(
    feedbackId: string,
    reply: FeedbackReplyItem
  ): FeedbackRecord | null {
    const feedbacks = this.getFeedbacks();
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    if (!feedback) return null;

    if (!feedback.replies) feedback.replies = {};
    feedback.replies[reply.questionKey] = reply;

    this.saveFeedbacks(feedbacks);
    return feedback;
  }

  static revertFeedback(
    feedbackId: string,
    currentCmo: CmoUser,
    revertNotes: string,
    targetCmoId?: string
  ): FeedbackRecord | null {
    const feedbacks = this.getFeedbacks();
    const cmos = this.getCmos();
    const feedback = feedbacks.find((f) => f.id === feedbackId);

    if (!feedback) return null;

    // Default target CMO to CMO_1 (Rohini/Pitampura or previous assigned CMO)
    const targetCmo = targetCmoId 
      ? cmos.find((c) => c.id === targetCmoId)
      : cmos.find((c) => c.id === feedback.previousCmoId) || cmos.find((c) => c.role === 'CMO_1');

    if (!targetCmo) return null;

    const timestampStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const revertItem: EscalationHistoryItem = {
      id: `rev-${Date.now()}`,
      escalatedByCmoId: currentCmo.id,
      escalatedByCmoName: currentCmo.name,
      escalatedByRole: `${currentCmo.role} (${currentCmo.designation})`,
      escalatedToCmoId: targetCmo.id,
      escalatedToCmoName: targetCmo.name,
      escalatedToRole: `${targetCmo.role} (${targetCmo.designation})`,
      timestamp: timestampStr,
      reasonText: revertNotes || 'Ticket reverted back down for re-investigation.',
      actionType: 'revert',
    };

    feedback.previousCmoId = feedback.assignedCmoId;
    feedback.assignedCmoId = targetCmo.id;
    feedback.status = 'Reverted';
    if (!feedback.escalationHistory) feedback.escalationHistory = [];
    feedback.escalationHistory.unshift(revertItem);

    if (!feedback.officerNotes) feedback.officerNotes = [];
    feedback.officerNotes.unshift({
      date: timestampStr,
      officer: currentCmo.name,
      note: `↩️ Ticket Reverted back to ${targetCmo.name} (${targetCmo.role}). Directive: ${revertNotes}`,
    });

    this.saveFeedbacks(feedbacks);

    // Create notification for receiving CMO_1
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: targetCmo.id,
      message: `Feedback ${feedback.trackingId} was reverted back to you by ${currentCmo.name} (${currentCmo.role}) for further action.`,
      timestamp: timestampStr,
      feedbackId: feedback.id,
      trackingId: feedback.trackingId,
      isRead: false,
      type: 'revert',
      escalatedBy: currentCmo.name,
    };

    const notifs = this.getNotifications();
    notifs.unshift(notifItem);
    this.saveNotifications(notifs);

    return feedback;
  }

  static closeFeedback(
    feedbackId: string,
    currentCmo: CmoUser,
    closingNotes?: string
  ): FeedbackRecord | null {
    const feedbacks = this.getFeedbacks();
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    if (!feedback) return null;

    const timestampStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    feedback.status = 'Closed';
    if (!feedback.officerNotes) feedback.officerNotes = [];
    feedback.officerNotes.unshift({
      date: timestampStr,
      officer: currentCmo.name,
      note: `🔒 Ticket Permanently Closed by ${currentCmo.name} (${currentCmo.role}). Notes: ${closingNotes || 'Resolution verified & validated.'}`,
    });

    this.saveFeedbacks(feedbacks);
    return feedback;
  }

  static markNotificationRead(notifId: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    this.saveNotifications(updated);
  }

  static resetToDefaultData(): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.CMOS, JSON.stringify(DEFAULT_CMOS));
      localStorage.setItem(STORAGE_KEYS.CENTRES, JSON.stringify(DEFAULT_CENTRES));
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(DEFAULT_FEEDBACKS));
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
  }
}
