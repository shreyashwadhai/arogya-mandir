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
  date: string; // Format: "Aug. 25, 2026" or YYYY-MM-DD
  month: string; // "Aug", "Jul", "Jun", etc.
  year: string; // "2026", "2025"
  clinicName: string; // "Rajkot", "Jamnagar", "Dwarka", "Delhi Cantt", "Rohini", etc.
  clinicCode: string; // "JAM/PC/RAJ", "JAM/PC/JAM", "DEL/PC/DWR"
  stationHq: string; // "Jamnagar", "Delhi HQ", "Ahmedabad"
  visitorType: 'ESM/Spouse' | 'Dependant';
  responseType: 'Excellent Service' | 'Acceptable standard' | 'Could Be Better';
  overallRating: 'Could Be Better' | 'Acceptable' | 'Excellent';
  status: 'Assigned to CMO' | 'Action In Progress' | 'Logged & Verified' | 'Resolved';
  urgency: 'High SLA Priority' | 'Normal';
  isGrievance: boolean;
  complaintCountText?: string; // e.g., "No Complaint (7th Time)"
  
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

// Sample playable audio URLs
const SAMPLE_AUDIO_1 = "https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg";
const SAMPLE_AUDIO_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// Sample Unsplash images for evidence lightbox
const SAMPLE_IMAGE_CLEANLINESS = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80";
const SAMPLE_IMAGE_PRESCRIPTION = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80";
const SAMPLE_IMAGE_QUEUE = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80";

export const DUMMY_FEEDBACK_RECORDS: FeedbackRecord[] = [
  {
    id: "fb-101",
    trackingId: "AM-FB-2026-98124",
    patientName: "Jayantilal Keshavbhai Kathrotiya",
    gender: "Male",
    age: 58,
    mobileNumber: "+91 83062 72075",
    aadhaarMasked: "A H 0000 0385 1236",
    address: "Kothariya Main Road, Rajkot",
    facilityName: "CMO Polyclinic Rajkot",
    district: "Rajkot",
    timestamp: "Aug. 25, 2026, 10:45 AM",
    date: "Aug. 25, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Rajkot",
    clinicCode: "JAM/PC/RAJ",
    stationHq: "Jamnagar",
    visitorType: "ESM/Spouse",
    responseType: "Excellent Service",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "No Complaint (7th Time)",
    registration: {
      rating: "Excellent",
      comments: "Quick ABHA card validation and prompt registration.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "CMO and Senior Medical Officer explained treatment thoroughly.",
      audioUrl: SAMPLE_AUDIO_1,
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "All cardiac and routine medicines issued promptly.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Air-conditioned waiting hall and sanitized seats.",
      imageUrl: SAMPLE_IMAGE_CLEANLINESS,
      tags: [],
    },
    suggestions: {
      text: "Outstanding management by CMO Rajkot team.",
      audioUrl: SAMPLE_AUDIO_2,
    },
  },
  {
    id: "fb-102",
    trackingId: "AM-FB-2026-98125",
    patientName: "Bhavnaben Patel",
    gender: "Female",
    age: 52,
    mobileNumber: "+91 98251 44321",
    aadhaarMasked: "XXXX-XXXX-9812",
    address: "Moti Khavdi, Jamnagar",
    facilityName: "CMO Polyclinic Jamnagar",
    district: "Jamnagar",
    timestamp: "Aug. 24, 2026, 02:30 PM",
    date: "Aug. 24, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Jamnagar",
    clinicCode: "JAM/PC/JAM",
    stationHq: "Jamnagar",
    visitorType: "ESM/Spouse",
    responseType: "Excellent Service",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "No Complaint (3rd Time)",
    registration: {
      rating: "Excellent",
      comments: "Smooth token distribution.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Doctor was attentive and polite.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "Medicine desk was efficient.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Spotless polyclinic premises.",
      tags: [],
    },
    suggestions: {
      text: "Appreciate the quick service.",
    },
  },
  {
    id: "fb-103",
    trackingId: "AM-FB-2026-98126",
    patientName: "Harpreet Singh",
    gender: "Male",
    age: 44,
    mobileNumber: "+91 98102 34567",
    aadhaarMasked: "XXXX-XXXX-4821",
    address: "Block B, Tilak Nagar, New Delhi",
    facilityName: "District Hospital, Central Delhi",
    district: "Central Delhi",
    timestamp: "Aug. 24, 2026, 01:15 PM",
    date: "Aug. 24, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Rajkot",
    clinicCode: "JAM/PC/RAJ",
    stationHq: "Jamnagar",
    visitorType: "Dependant",
    responseType: "Excellent Service",
    overallRating: "Excellent",
    status: "Logged & Verified",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "No Complaint",
    registration: {
      rating: "Acceptable",
      comments: "QR scanning was quick, but counter line took 15 mins.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Doctor consulted politely.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "Issued medicines without delay.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Clean premises.",
      tags: [],
    },
    suggestions: {
      text: "Good experience overall.",
    },
  },
  {
    id: "fb-104",
    trackingId: "AM-FB-2026-98127",
    patientName: "Rameshchandra Varma",
    gender: "Male",
    age: 64,
    mobileNumber: "+91 94268 11980",
    aadhaarMasked: "XXXX-XXXX-5512",
    address: "Kalawad Road, Rajkot",
    facilityName: "CMO Polyclinic Rajkot",
    district: "Rajkot",
    timestamp: "Aug. 22, 2026, 11:20 AM",
    date: "Aug. 22, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Rajkot",
    clinicCode: "JAM/PC/RAJ",
    stationHq: "Jamnagar",
    visitorType: "ESM/Spouse",
    responseType: "Could Be Better",
    overallRating: "Could Be Better",
    status: "Assigned to CMO",
    urgency: "High SLA Priority",
    isGrievance: true,
    complaintCountText: "Grievance Raised (1st Time)",
    registration: {
      rating: "Acceptable",
      comments: "Token queue took over 30 mins.",
      tags: ["लंबी लाइन"],
    },
    doctor: {
      rating: "Could Be Better",
      comments: "Consultation time was very brief due to heavy patient rush.",
      audioUrl: SAMPLE_AUDIO_1,
      tags: ["ठीक से समझाया नहीं"],
    },
    pharmacy: {
      rating: "Could Be Better",
      comments: "Hypertension medicine out of stock.",
      imageUrl: SAMPLE_IMAGE_PRESCRIPTION,
      tags: ["दवा उपलब्ध नहीं"],
    },
    cleanliness: {
      rating: "Could Be Better",
      comments: "Washroom required cleaning.",
      imageUrl: SAMPLE_IMAGE_CLEANLINESS,
      tags: ["साफ-सफाई"],
    },
    suggestions: {
      text: "Please increase pharmacy counters during morning hours.",
      audioUrl: SAMPLE_AUDIO_2,
    },
    officerNotes: [
      {
        date: "Aug. 22, 2026, 03:00 PM",
        officer: "CMO Rajkot",
        note: "Escalated to Station HQ Jamnagar for emergency medicine replenishment.",
      },
    ],
  },
  {
    id: "fb-105",
    trackingId: "AM-FB-2026-98128",
    patientName: "Sunita Sharma",
    gender: "Female",
    age: 38,
    mobileNumber: "+91 98711 98234",
    aadhaarMasked: "XXXX-XXXX-9102",
    address: "Sector 14, Rohini, Delhi",
    facilityName: "Arogya Mandir Centre #108 - Rohini",
    district: "North West Delhi",
    timestamp: "Aug. 22, 2026, 09:40 AM",
    date: "Aug. 22, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Rohini",
    clinicCode: "DEL/PC/ROH",
    stationHq: "Delhi HQ",
    visitorType: "Dependant",
    responseType: "Excellent Service",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "No Complaint",
    registration: {
      rating: "Excellent",
      comments: "Smooth registration.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Doctor explained medication timeline.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "All medicines available.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Clean premises.",
      tags: [],
    },
    suggestions: {
      text: "Very satisfied with treatment.",
    },
  },
  {
    id: "fb-106",
    trackingId: "AM-FB-2026-98129",
    patientName: "Rajesh Kumar Gupta",
    gender: "Male",
    age: 56,
    mobileNumber: "+91 99580 12890",
    aadhaarMasked: "XXXX-XXXX-6519",
    address: "Laxmi Nagar, East Delhi",
    facilityName: "Arogya Mandir Clinic #204 - Laxmi Nagar",
    district: "East Delhi",
    timestamp: "Aug. 22, 2026, 04:15 PM",
    date: "Aug. 22, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Laxmi Nagar",
    clinicCode: "DEL/PC/LAX",
    stationHq: "Delhi HQ",
    visitorType: "ESM/Spouse",
    responseType: "Excellent Service",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "No Complaint",
    registration: {
      rating: "Excellent",
      comments: "Helpful staff.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Great doctor consultation.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "Quick medicine distribution.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Clean waiting lounge.",
      tags: [],
    },
    suggestions: {
      text: "Maintain high standards.",
    },
  },
  {
    id: "fb-107",
    trackingId: "AM-FB-2026-98130",
    patientName: "Manjula Bhatt",
    gender: "Female",
    age: 61,
    mobileNumber: "+91 94081 77654",
    aadhaarMasked: "XXXX-XXXX-3341",
    address: "Dwarka Sector 7, Delhi",
    facilityName: "CMO Polyclinic Dwarka",
    district: "South West Delhi",
    timestamp: "Aug. 21, 2026, 11:10 AM",
    date: "Aug. 21, 2026",
    month: "Aug",
    year: "2026",
    clinicName: "Dwarka",
    clinicCode: "DEL/PC/DWR",
    stationHq: "Delhi HQ",
    visitorType: "ESM/Spouse",
    responseType: "Acceptable standard",
    overallRating: "Acceptable",
    status: "Action In Progress",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "Minor Inquiry",
    registration: {
      rating: "Acceptable",
      comments: "Token screen was running slow.",
      tags: [],
    },
    doctor: {
      rating: "Acceptable",
      comments: "Good consultation.",
      tags: [],
    },
    pharmacy: {
      rating: "Acceptable",
      comments: "Got 3 out of 4 prescribed items.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Well maintained.",
      tags: [],
    },
    suggestions: {
      text: "Fix display monitor in waiting hall.",
    },
  },
  {
    id: "fb-108",
    trackingId: "AM-FB-2026-98131",
    patientName: "Col. Vikramjit Singh (Retd)",
    gender: "Male",
    age: 67,
    mobileNumber: "+91 98110 55432",
    aadhaarMasked: "XXXX-XXXX-7723",
    address: "Delhi Cantonment, New Delhi",
    facilityName: "CMO Polyclinic Delhi Cantt",
    district: "South Delhi",
    timestamp: "Jul. 15, 2026, 09:30 AM",
    date: "Jul. 15, 2026",
    month: "Jul",
    year: "2026",
    clinicName: "Delhi Cantt",
    clinicCode: "DEL/PC/CNT",
    stationHq: "Delhi HQ",
    visitorType: "ESM/Spouse",
    responseType: "Excellent Service",
    overallRating: "Excellent",
    status: "Resolved",
    urgency: "Normal",
    isGrievance: false,
    complaintCountText: "No Complaint",
    registration: {
      rating: "Excellent",
      comments: "Express counter for veteran officers.",
      tags: [],
    },
    doctor: {
      rating: "Excellent",
      comments: "Cardiologist was top tier.",
      tags: [],
    },
    pharmacy: {
      rating: "Excellent",
      comments: "Specialty meds delivered.",
      tags: [],
    },
    cleanliness: {
      rating: "Excellent",
      comments: "Military grade cleanliness.",
      tags: [],
    },
    suggestions: {
      text: "Praiseworthy efficiency.",
    },
  }
];
