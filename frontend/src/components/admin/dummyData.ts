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
  overallRating: 'Could Be Better' | 'Acceptable' | 'Excellent';
  status: 'Assigned to CMO' | 'Action In Progress' | 'Logged & Verified' | 'Resolved';
  urgency: 'High SLA Priority' | 'Normal';
  isGrievance: boolean;
  
  // Category Details
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

// Sample audio URLs for playable voice notes demo
const SAMPLE_AUDIO_1 = "https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg";
const SAMPLE_AUDIO_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// Sample SVG / Unsplash Image Data URIs for uploaded photos demo
const SAMPLE_IMAGE_CLEANLINESS = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80";
const SAMPLE_IMAGE_PRESCRIPTION = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80";
const SAMPLE_IMAGE_QUEUE = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80";

export const DUMMY_FEEDBACK_RECORDS: FeedbackRecord[] = [
  {
    id: "fb-101",
    trackingId: "AM-FB-2026-98124",
    patientName: "Harpreet Singh",
    gender: "Male",
    age: 44,
    mobileNumber: "+91 98102 34567",
    aadhaarMasked: "XXXX-XXXX-4821",
    address: "Block B, Tilak Nagar, New Delhi",
    facilityName: "District Hospital, Central Delhi (Arogya Mandir #402)",
    district: "Central Delhi",
    timestamp: "24 Aug 2026, 01:15 PM",
    overallRating: "Could Be Better",
    status: "Assigned to CMO",
    urgency: "High SLA Priority",
    isGrievance: true,
    registration: {
      rating: "Acceptable",
      comments: "QR scanning was quick, but counter line took 25 minutes.",
      tags: ["लंबी लाइन"],
    },
    doctor: {
      rating: "Could Be Better",
      comments: "Doctor was attentive, but spent only 2 minutes explaining the dosage details.",
      audioUrl: SAMPLE_AUDIO_1,
      tags: ["ठीक से समझाया नहीं", "बहुत इंतज़ार"],
    },
    pharmacy: {
      rating: "Could Be Better",
      comments: "3 out of 5 prescribed hypertension medicines were out of stock. Had to buy externally.",
      imageUrl: SAMPLE_IMAGE_PRESCRIPTION,
      tags: ["दवा उपलब्ध नहीं"],
    },
    cleanliness: {
      rating: "Could Be Better",
      comments: "Washroom near OPD waiting area was unhygienic with overflowing bin.",
      audioUrl: SAMPLE_AUDIO_1,
      imageUrl: SAMPLE_IMAGE_CLEANLINESS,
      tags: ["साफ-सफाई"],
    },
    suggestions: {
      text: "Please restock essential cardiac and BP medicines and add a second pharmacy dispensing window.",
      audioUrl: SAMPLE_AUDIO_2,
    },
    officerNotes: [
      {
        date: "24 Aug 2026, 02:00 PM",
        officer: "Dr. R. K. Varma (CMO Central Delhi)",
        note: "Escalated to Chief Pharmacist for immediate inventory audit of hypertension medicine stock.",
      },
    ],
  },
  {
    id: "fb-102",
    trackingId: "AM-FB-2026-87419",
    patientName: "Sunita Sharma",
    gender: "Female",
    age: 38,
    mobileNumber: "+91 98711 98234",
    aadhaarMasked: "XXXX-XXXX-9102",
    address: "Sector 14, Rohini, Delhi",
    facilityName: "Arogya Mandir Centre #108 - Rohini",
    district: "North West Delhi",
    timestamp: "24 Aug 2026, 11:30 AM",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    registration: {
      rating: "Excellent",
      comments: "Smooth token system and helpful staff at helpdesk.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Dr. Ananya performed a thorough checkup and explained pediatric diet carefully.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "All medicines available free of charge under Mukhyamantri Seva.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Very clean waiting lounge and drinking water dispenser working properly.",
      tags: [],
    },
    suggestions: {
      text: "Keep up the great work! Requesting Sunday morning OPD facility if possible.",
    },
  },
  {
    id: "fb-103",
    trackingId: "AM-FB-2026-76192",
    patientName: "Rajesh Kumar Gupta",
    gender: "Male",
    age: 56,
    mobileNumber: "+91 99580 12890",
    aadhaarMasked: "XXXX-XXXX-6519",
    address: "Laxmi Nagar, East Delhi",
    facilityName: "Arogya Mandir Health Wellness Clinic #204 - Laxmi Nagar",
    district: "East Delhi",
    timestamp: "23 Aug 2026, 04:45 PM",
    overallRating: "Could Be Better",
    status: "Action In Progress",
    urgency: "High SLA Priority",
    isGrievance: true,
    registration: {
      rating: "Could Be Better",
      comments: "Digital token screen was offline. Staff had to manually write token numbers.",
      audioUrl: SAMPLE_AUDIO_1,
      tags: ["लंबी लाइन", "सिस्टम धीमा"],
    },
    doctor: {
      rating: "Acceptable",
      comments: "Doctor was good but OPD consultation room was overcrowded.",
      tags: ["बहुत इंतज़ार"],
    },
    pharmacy: {
      rating: "Could Be Better",
      comments: "Insulin syringes were unavailable.",
      imageUrl: SAMPLE_IMAGE_PRESCRIPTION,
      tags: ["दवा उपलब्ध नहीं"],
    },
    cleanliness: {
      rating: "Acceptable",
      comments: "Floor was being mopped regularly.",
      tags: [],
    },
    suggestions: {
      text: "Fix the digital token screen display in waiting hall.",
    },
    officerNotes: [
      {
        date: "24 Aug 2026, 09:15 AM",
        officer: "Er. S. N. Malhotra (IT Cell)",
        note: "Dispatched technician to replace HDMI cable and reset digital token queue display.",
      },
    ],
  },
  {
    id: "fb-104",
    trackingId: "AM-FB-2026-64301",
    patientName: "Meenakshi Devi",
    gender: "Female",
    age: 62,
    mobileNumber: "+91 97170 54321",
    aadhaarMasked: "XXXX-XXXX-3341",
    address: "Vasant Kunj, South Delhi",
    facilityName: "Sub-District Civil Hospital - Vasant Kunj",
    district: "South Delhi",
    timestamp: "23 Aug 2026, 02:10 PM",
    overallRating: "Acceptable",
    status: "Logged & Verified",
    urgency: "Normal",
    isGrievance: false,
    registration: {
      rating: "Acceptable",
      comments: "Staff guided senior citizens politely.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Orthopedic specialist was very courteous and patient.",
      tags: [],
    },
    pharmacy: {
      rating: "Acceptable",
      comments: "Got 4 out of 4 medicines.",
      tags: [],
    },
    cleanliness: {
      rating: "Acceptable",
      comments: "Seating arrangement is good.",
      tags: [],
    },
    suggestions: {
      text: "Add more wheelchair ramps near emergency entry gate.",
      audioUrl: SAMPLE_AUDIO_2,
    },
  },
  {
    id: "fb-105",
    trackingId: "AM-FB-2026-53892",
    patientName: "Mohd. Tariq Khan",
    gender: "Male",
    age: 29,
    mobileNumber: "+91 98112 09876",
    aadhaarMasked: "XXXX-XXXX-1980",
    address: "Jamia Nagar, Okhla, New Delhi",
    facilityName: "Arogya Mandir Urban Health Centre #309 - Okhla",
    district: "South East Delhi",
    timestamp: "22 Aug 2026, 05:20 PM",
    overallRating: "Could Be Better",
    status: "Assigned to CMO",
    urgency: "High SLA Priority",
    isGrievance: true,
    registration: {
      rating: "Could Be Better",
      comments: "Registration counter closed 15 minutes before official closing time.",
      audioUrl: SAMPLE_AUDIO_1,
      tags: ["स्टाफ का व्यवहार"],
    },
    doctor: {
      rating: "Could Be Better",
      comments: "Doctor left early for duty shift without attending last 8 patients in queue.",
      imageUrl: SAMPLE_IMAGE_QUEUE,
      tags: ["बहुत इंतज़ार", "स्टाफ का व्यवहार"],
    },
    pharmacy: {
      rating: "Acceptable",
      comments: "Pharmacist was present.",
      tags: [],
    },
    cleanliness: {
      rating: "Acceptable",
      comments: "Litter on corridor, needs cleaning.",
      tags: ["साफ-सफाई"],
    },
    suggestions: {
      text: "Enforce strict biometric attendance for OPD doctors on evening shifts.",
    },
  },
  {
    id: "fb-106",
    trackingId: "AM-FB-2026-41908",
    patientName: "Pooja Verma",
    gender: "Female",
    age: 27,
    mobileNumber: "+91 98991 76543",
    aadhaarMasked: "XXXX-XXXX-7723",
    address: "Dwarka Sector 7, Delhi",
    facilityName: "Arogya Mandir Polyclinic #501 - Dwarka",
    district: "South West Delhi",
    timestamp: "22 Aug 2026, 10:15 AM",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    registration: {
      rating: "Excellent",
      comments: "ABHA Card integration worked instantly.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Gynecologist gave comprehensive care instructions.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "Medicines labeled with timing stickers.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Sanitizer dispensers available at all doors.",
      tags: [],
    },
    suggestions: {
      text: "Excellent service! Great facility.",
    },
  },
];
