export interface TranslationContent {
  headerTitle: string;
  govtBadge: string;
  stepIndicator: string;
  stepNames: string[];
  selectLanguageTitle: string;
  selectLanguageDesc: string;
  startFeedbackCTA: string;
  verifyIdentity: {
    title: string;
    subtitle: string;
    mobileTab: string;
    aadhaarTab: string;
    mobilePlaceholder: string;
    aadhaarPlaceholder: string;
    submitBtn: string;
  };
  bottomSheet: {
    title: string;
    subtitle: string;
    speakOption: string;
    speakDesc: string;
    typeOption: string;
    typeDesc: string;
    photoOption: string;
    photoDesc: string;
    listeningText: string;
    stopToSaveText: string;
    textPlaceholder: string;
    photoUploadText: string;
    photoLimitText: string;
    skipBtn: string;
    submitBtn: string;
  };
  questions: {
    id: number;
    title: string;
    category: string;
    description?: string;
    type: 'choice' | 'text' | 'rating';
    options?: string[];
  }[];
  ratingLabels: {
    couldBeBetter: string;
    acceptable: string;
    excellent: string;
  };
  couldBeBetterPrompt: string;
  couldBeBetterPlaceholder: string;
  improvementTags: string[];
  commonButtons: {
    previous: string;
    next: string;
    submit: string;
    skip: string;
    verifyAndProceed: string;
    resendOTP: string;
    trackFeedback: string;
    submitAnother: string;
    downloadReceipt: string;
  };
  confirmation: {
    thankYou: string;
    subtitle: string;
    trackingLabel: string;
    smsSentNotice: string;
    slaNotice: string;
  };
  scannerPage: {
    headerTitle: string;
    headerSubtitle: string;
    scanQrTitle: string;
    detectedFacility: string;
    changeBtn: string;
    securePrivate: string;
    govtVerified: string;
    support247: string;
    continueBtn: string;
  };
}

export const translations: Record<string, TranslationContent> = {
  en: {
    headerTitle: "AROGYA MANDIR FEEDBACK",
    govtBadge: "Govt. Verified Portal",
    stepIndicator: "Step",
    stepNames: [
      "QR Scan",
      "Registration",
      "OTP Verification",
      "Language",
      "Feedback Interview",
      "Confirmation"
    ],
    selectLanguageTitle: "Select Feedback Language",
    selectLanguageDesc: "Choose your preferred language for the feedback form. All questions and audio help will load in this language.",
    startFeedbackCTA: "Start Feedback →",
    verifyIdentity: {
      title: "Verify it's really you",
      subtitle: "Enter registered mobile number or last 4 digits of Aadhaar.",
      mobileTab: "Mobile",
      aadhaarTab: "Aadhaar",
      mobilePlaceholder: "Enter 10-digit mobile number",
      aadhaarPlaceholder: "1234",
      submitBtn: "Verify & Get OTP"
    },
    bottomSheet: {
      title: "What went wrong?",
      subtitle: "Tell us any way you like. This is optional, but it's how the problem gets fixed.",
      speakOption: "Record Voice",
      speakDesc: "Record a voice note.",
      typeOption: "Write Message",
      typeDesc: "Type a short message",
      photoOption: "Attach Photo",
      photoDesc: "Upload a photo of the issue",
      listeningText: "Listening... Press again to stop",
      stopToSaveText: "Stop & Save",
      textPlaceholder: "e.g., Had to wait 40 minutes at medicine counter...",
      photoUploadText: "Open camera or select photo",
      photoLimitText: "JPG or PNG · up to 5MB",
      skipBtn: "Skip",
      submitBtn: "Submit"
    },
    ratingLabels: {
      couldBeBetter: "Could Be Better",
      acceptable: "Acceptable",
      excellent: "Excellent"
    },
    couldBeBetterPrompt: "Please describe what could be improved...",
    couldBeBetterPlaceholder: "Share details like long wait times, staff behavior, medicine availability or sanitation issues...",
    improvementTags: [
      "Long Waiting Time",
      "Staff Behavior / Misconduct",
      "Medicine Out of Stock",
      "Unclean Sanitation / Washrooms",
      "Lack of Seating / Fans",
      "Unclear Guidance / Signs"
    ],
    questions: [
      {
        id: 1,
        title: "How was your Doctor Consultation Experience?",
        category: "MEDICAL CARE & DOCTORS",
        type: "rating"
      },
      {
        id: 2,
        title: "How was your Pharmacy / Medicine Counter Experience?",
        category: "PHARMACY DISPENSARY",
        type: "rating"
      },
      {
        id: 3,
        title: "Were all your Prescribed Medicines available free of cost?",
        category: "MEDICINE AVAILABILITY",
        type: "rating"
      },
      {
        id: 4,
        title: "How was the Cleanliness & Sanitation of the Facility?",
        category: "HOSPITAL CLEANLINESS",
        type: "rating"
      },
      {
        id: 5,
        title: "Any Suggestions, Grievance or Additional Comments?",
        category: "FEEDBACK & GRIEVANCE",
        description: "Your comments help us take immediate SLA action through the Chief Medical Officer (CMO).",
        type: "text"
      }
    ],
    commonButtons: {
      previous: "Previous",
      next: "Next",
      submit: "Submit",
      skip: "Skip",
      verifyAndProceed: "Verify & Proceed ✓",
      resendOTP: "Resend OTP",
      trackFeedback: "Track Your Feedback",
      submitAnother: "Submit Another Feedback ↺",
      downloadReceipt: "Download Grievance Slip 📄"
    },
    confirmation: {
      thankYou: "Thank You!",
      subtitle: "Your feedback & grievance have been logged into the Government Digital Health Portal.",
      trackingLabel: "Feedback Tracking ID",
      smsSentNotice: "SMS confirmation with tracking link sent to",
      slaNotice: "Your feedback is directly routed to Chief Medical Officer (CMO) & Health Directorate for 48-Hour SLA review."
    },
    scannerPage: {
      headerTitle: "Share Your Hospital Experience",
      headerSubtitle: "Your direct feedback helps the Ministry of Health and Family Welfare improve patient care and facilities nationwide.",
      scanQrTitle: "SCAN HOSPITAL QR CODE",
      detectedFacility: "Detected Facility",
      changeBtn: "Change",
      securePrivate: "Secure & Private",
      govtVerified: "Govt. Verified",
      support247: "24/7 Support",
      continueBtn: "Continue to Register"
    }
  },
  hi: {
    headerTitle: "आरोग्य मंदिर फीडबैक",
    govtBadge: "सरकारी सत्यापित पोर्टल",
    stepIndicator: "चरण",
    stepNames: [
      "QR स्कैन",
      "पंजीकरण",
      "ओटीपी सत्यापन",
      "भाषा चयन",
      "फीडबैक प्रश्न",
      "पुष्टि एवं रसीद"
    ],
    selectLanguageTitle: "फीडबैक की भाषा चुनें",
    selectLanguageDesc: "कृपया फीडबैक फॉर्म के लिए अपनी पसंदीदा भाषा चुनें। सभी प्रश्न और ऑडियो सहायता इसी भाषा में लोड होगी।",
    startFeedbackCTA: "फीडबैक शुरू करें →",
    verifyIdentity: {
      title: "Verify it's really you",
      subtitle: "रजिस्टर्ड मोबाइल नंबर या आधार के अंतिम 4 अंक डालें।",
      mobileTab: "मोबाइल",
      aadhaarTab: "आधार",
      mobilePlaceholder: "10-अंकों का मोबाइल नंबर दर्ज करें",
      aadhaarPlaceholder: "1234",
      submitBtn: "सत्यापित करें और ओटीपी प्राप्त करें"
    },
    bottomSheet: {
      title: "क्या दिक्कत हुई?",
      subtitle: "जैसे चाहें बताइए। यह वैकल्पिक है, पर इससे समस्या जल्दी ठीक होती है।",
      speakOption: "बोलकर बताएँ",
      speakDesc: "Record a voice note.",
      typeOption: "लिखकर बताएँ",
      typeDesc: "Type a short message",
      photoOption: "फोटो भेजें",
      photoDesc: "Upload a photo of the issue",
      listeningText: "सुन रहे हैं... दोबारा दबाकर रोकें",
      stopToSaveText: "रोकें और सहेजें",
      textPlaceholder: "जैसे: दवा काउंटर पर 40 मिनट लाइन में लगना पड़ा...",
      photoUploadText: "कैमरा खोलें या फोटो चुनें",
      photoLimitText: "JPG or PNG · up to 5MB",
      skipBtn: "छड़ें",
      submitBtn: "भेजें"
    },
    ratingLabels: {
      couldBeBetter: "सुधार की आवश्यकता (Could Be Better)",
      acceptable: "स्वीकार्य (Acceptable)",
      excellent: "उत्कृष्ट (Excellent)"
    },
    couldBeBetterPrompt: "कृपया विस्तार से बताएं कि क्या सुधार किया जा सकता है...",
    couldBeBetterPlaceholder: "लंबी प्रतीक्षा, कर्मचारियों का व्यवहार, दवाओं की अनुपलब्धता या स्वच्छता संबंधी विवरण दर्ज करें...",
    improvementTags: [
      "लंबी प्रतीक्षा अवधि",
      "कर्मचारियों का अनुचित व्यवहार",
      "दवाएं उपलब्ध नहीं थीं",
      "सफाई एवं शौचालय में गंदगी",
      "बैठने या पंखे की कमी",
      "अस्पष्ट दिशा-निर्देश"
    ],
    questions: [
      {
        id: 1,
        title: "डॉक्टर के साथ परामर्श का अनुभव कैसा रहा?",
        category: "चिकित्सा देखभाल एवं डॉक्टर",
        type: "rating"
      },
      {
        id: 2,
        title: "फार्मेसी / दवा वितरण काउंटर का अनुभव कैसा रहा?",
        category: "दवा वितरण एवं फार्मेसी",
        type: "rating"
      },
      {
        id: 3,
        title: "क्या डॉक्टर द्वारा लिखी गई सभी दवाएं मुफ्त उपलब्ध थीं?",
        category: "दवाओं की उपलब्धता",
        type: "rating"
      },
      {
        id: 4,
        title: "अस्पताल परिसर की स्वच्छता एवं सफाई कैसी थी?",
        category: "अस्पताल की स्वच्छता",
        type: "rating"
      },
      {
        id: 5,
        title: "क्या आप कोई सुझाव, शिकायत या टिप्पणी देना चाहते हैं?",
        category: "शिकायत एवं सुझाव",
        description: "आपकी शिकायत मुख्य चिकित्सा अधिकारी (CMO) के पास 48 घंटे में कार्रवाई हेतु भेजी जाती है।",
        type: "text"
      }
    ],
    commonButtons: {
      previous: "पिछला",
      next: "सुरक्षित करें एवं आगे बढ़ें →",
      submit: "सबमिट करें",
      skip: "प्रश्न छोड़ें",
      verifyAndProceed: "सत्यापित करें एवं आगे बढ़ें ✓",
      resendOTP: "पुनः ओटीपी भेजें",
      trackFeedback: "फीडबैक की स्थिति जांचें",
      submitAnother: "दूसरा फीडबैक दर्ज करें ↺",
      downloadReceipt: "शिकायत पर्ची डाउनलोड करें 📄"
    },
    confirmation: {
      thankYou: "धन्यवाद!",
      subtitle: "आपका फीडबैक एवं शिकायत सरकारी डिजिटल स्वास्थ्य पोर्टल पर सफलतापूर्वक दर्ज कर ली गई है।",
      trackingLabel: "फीडबैक ट्रैकिंग आईडी",
      smsSentNotice: "एसएमएस द्वारा ट्रैकिंग लिंक भेजा गया है:",
      slaNotice: "आपकी शिकायत मुख्य चिकित्सा अधिकारी (CMO) और स्वास्थ्य निदेशालय को 48 घंटे की समय सीमा के साथ भेजी गई है।"
    },
    scannerPage: {
      headerTitle: "अपने अस्पताल का अनुभव साझा करें",
      headerSubtitle: "आपका सीधा फीडबैक स्वास्थ्य एवं परिवार कल्याण मंत्रालय को देश भर में मरीज की देखभाल और सुविधाओं में सुधार करने में मदद करता है।",
      scanQrTitle: "अस्पताल क्यूआर कोड स्कैन करें",
      detectedFacility: "पहचाना गया अस्पताल",
      changeBtn: "बदलें",
      securePrivate: "सुरक्षित एवं गोपनीय",
      govtVerified: "सरकारी सत्यापित",
      support247: "24/7 सहायता",
      continueBtn: "पंजीकरण के लिए आगे बढ़ें"
    }
  },
  pa: {
    headerTitle: "ਅਰੋਗਿਆ ਮੰਦਰ ਫੀਡਬੈਕ",
    govtBadge: "ਸਰਕਾਰੀ ਪ੍ਰਮਾਣਿਤ ਪੋਰਟਲ",
    stepIndicator: "ਕਦਮ",
    stepNames: [
      "QR ਸਕੈਨ",
      "ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
      "OTP ਤਸਦੀਕ",
      "ਭਾਸ਼ਾ",
      "ਫੀਡਬੈਕ ਸਵਾਲ",
      "ਪੁਸ਼ਟੀ"
    ],
    selectLanguageTitle: "ਫੀਡਬੈਕ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    selectLanguageDesc: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ। ਸਾਰੇ ਸਵਾਲ ਇਸੇ ਭਾਸ਼ਾ ਵਿੱਚ ਲੋਡ ਹੋਣਗੇ।",
    startFeedbackCTA: "ਫੀਡਬੈਕ ਸ਼ੁਰੂ ਕਰੋ →",
    verifyIdentity: {
      title: "Verify it's really you",
      subtitle: "ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ ਜਾਂ ਆਧਾਰ ਦੇ ਆਖਰੀ 4 ਅੰਕ ਦਰਜ ਕਰੋ।",
      mobileTab: "ਮੋਬਾਈਲ",
      aadhaarTab: "ਆਧਾਰ",
      mobilePlaceholder: "10-ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
      aadhaarPlaceholder: "1234",
      submitBtn: "ਤਸਦੀਕ ਕਰੋ ਅਤੇ OTP ਪ੍ਰਾਪਤ ਕਰੋ"
    },
    bottomSheet: {
      title: "ਕੀ ਸਮੱਸਿਆ ਆਈ?",
      subtitle: "ਜਿਵੇਂ ਚਾਹੋ ਦੱਸੋ। ਇਹ ਵਿਕਲਪਿਕ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਸਮੱਸਿਆ ਜਲਦੀ ਠੀਕ ਹੁੰਦੀ ਹੈ।",
      speakOption: "ਬੋਲ ਕੇ ਦੱਸੋ",
      speakDesc: "Record a voice note.",
      typeOption: "ਲਿਖ ਕੇ ਦੱਸੋ",
      typeDesc: "Type a short message",
      photoOption: "ਫੋਟੋ ਭੇਜੋ",
      photoDesc: "Upload a photo of the issue",
      listeningText: "ਸੁਣ ਰਹੇ ਹਾਂ... ਰੋਕਣ ਲਈ ਦੁਬਾਰਾ ਦਬਾਓ",
      stopToSaveText: "ਰੋਕੋ ਅਤੇ ਸੰਭਾਲੋ",
      textPlaceholder: "ਜਿਵੇਂ: ਦਵਾਈ ਕਾਊਂਟਰ 'ਤੇ 40 ਮਿੰਟ ਇੰਤਜ਼ਾਰ ਕਰਨਾ ਪਿਆ...",
      photoUploadText: "ਕੈਮਰਾ ਖੋਲ੍ਹੋ ਜਾਂ ਫੋਟੋ ਚੁਣੋ",
      photoLimitText: "JPG or PNG · up to 5MB",
      skipBtn: "ਛੱਡੋ",
      submitBtn: "ਭੇਜੋ"
    },
    ratingLabels: {
      couldBeBetter: "ਸੁਧਾਰ ਦੀ ਲੋੜ (Could Be Better)",
      acceptable: "ਸਵੀਕਾਰਯੋਗ (Acceptable)",
      excellent: "ਸ਼ਾਨਦਾਰ (Excellent)"
    },
    couldBeBetterPrompt: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਕੀ ਸੁਧਾਰ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ...",
    couldBeBetterPlaceholder: "ਲੰਮਾ ਇੰਤਜ਼ਾਰ, ਅਮਲੇ ਦਾ ਵਿਵਹਾਰ, ਦਵਾਈਆਂ ਦੀ ਘਾਟ...",
    improvementTags: [
      "ਲੰਬਾ ਇੰਤਜ਼ਾਰ",
      "ਅਮਲੇ ਦਾ ਅਣਉਚਿਤ ਵਿਵਹਾਰ",
      "ਦਵਾਈਆਂ ਦੀ ਅਣਉਪਲਬਧਤਾ",
      "ਸਫਾਈ ਦੀ ਘਾਟ"
    ],
    questions: [
      {
        id: 1,
        title: "ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦਾ ਤਜਰਬਾ ਕਿਹੋ ਜਿਹਾ ਰਿਹਾ?",
        category: "ਡਾਕਟਰੀ ਦੇਖਭਾਲ",
        type: "rating"
      },
      {
        id: 2,
        title: "ਫਾਰਮੇਸੀ / ਦਵਾਈ ਕਾਊਂਟਰ ਦਾ ਤਜਰਬਾ ਕਿਹੋ ਜਿਹਾ ਰਿਹਾ?",
        category: "ਦਵਾਈ ਕਾਊਂਟਰ",
        type: "rating"
      },
      {
        id: 3,
        title: "ਕੀ ਡਾਕਟਰ ਦੁਆਰਾ ਲਿਖੀਆਂ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਮੁਫ਼ਤ ਮਿਲੀਆਂ?",
        category: "ਦਵਾਈਆਂ ਦੀ ਉਪਲਬਧਤਾ",
        type: "rating"
      },
      {
        id: 4,
        title: "ਹਸਪਤਾਲ ਦੀ ਸਫਾਈ ਕਿਹੋ ਜਿਹੀ ਸੀ?",
        category: "ਸਫਾਈ",
        type: "rating"
      },
      {
        id: 5,
        title: "ਕੋਈ ਸੁਝਾਅ ਜਾਂ ਸ਼ਿਕਾਇਤ?",
        category: "ਸ਼ਿਕਾਇਤ ਅਤੇ ਸੁਝਾਅ",
        type: "text"
      }
    ],
    commonButtons: {
      previous: "ਪਿਛਲਾ",
      next: "ਅੱਗੇ ਵਧੋ →",
      submit: "ਸਬਮਿਟ ਕਰੋ",
      skip: "ਛੱਡੋ",
      verifyAndProceed: "ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ ✓",
      resendOTP: "ਮੁੜ OTP ਭੇਜੋ",
      trackFeedback: "ਟ੍ਰੈਕ ਕਰੋ",
      submitAnother: "ਹੋਰ ਫੀਡਬੈਕ ਦਰਜ ਕਰੋ ↺",
      downloadReceipt: "ਰਸੀਦ ਡਾਊਨਲੋਡ ਕਰੋ 📄"
    },
    confirmation: {
      thankYou: "ਧੰਨਵਾਦ!",
      subtitle: "ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਸਰਕਾਰੀ ਪੋਰਟਲ 'ਤੇ ਦਰਜ ਕਰ ਲਿਆ ਗਿਆ ਹੈ।",
      trackingLabel: "ਟ੍ਰੈਕਿੰਗ ਆਈਡੀ",
      smsSentNotice: "ਐਸਐਮਐਸ ਭੇਜਿਆ ਗਿਆ:",
      slaNotice: "ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਮੁੱਖ ਮੈਡੀਕਲ ਅਫਸਰ (CMO) ਨੂੰ ਭੇਜੀ ਗਈ ਹੈ।"
    },
    scannerPage: {
      headerTitle: "ਆਪਣੇ ਹਸਪਤਾਲ ਦਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ",
      headerSubtitle: "ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਸਿਹਤ ਅਤੇ ਪਰਿਵਾਰ ਭਲਾਈ ਮੰਤਰਾਲੇ ਨੂੰ ਦੇਸ਼ ਭਰ ਵਿੱਚ ਮਰੀਜ਼ਾਂ ਦੀ ਦੇਖਭਾਲ ਅਤੇ ਸਹੂਲਤਾਂ ਵਿੱਚ ਸੁਧਾਰ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
      scanQrTitle: "ਹਸਪਤਾਲ QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
      detectedFacility: "ਪਛਾਣਿਆ ਗਿਆ ਹਸਪਤਾਲ",
      changeBtn: "ਬਦਲੋ",
      securePrivate: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ",
      govtVerified: "ਸਰਕਾਰੀ ਪ੍ਰਮਾਣਿਤ",
      support247: "24/7 ਸਹਾਇਤਾ",
      continueBtn: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ਅੱਗੇ ਵਧੋ"
    }
  },
  ur: {
    headerTitle: "آروگیہ مندر فیڈ بیک",
    govtBadge: "سربراہ پورٹل",
    stepIndicator: "مرحلہ",
    stepNames: [
      "کیو آر اسکین",
      "رجسٹریشن",
      "او ٹی پی تائید",
      "زبان کا انتخاب",
      "فیڈ بیک سوالات",
      "تصدیق"
    ],
    selectLanguageTitle: "فیڈ بیک کی زبان منتخب کریں",
    selectLanguageDesc: "برائے کرم اپنی پسندیدہ زبان منتخب کریں۔ تمام سوالات اسی زبان میں ظاہر ہوں گے۔",
    startFeedbackCTA: "فیڈ بیک شروع کریں ←",
    verifyIdentity: {
      title: "Verify it's really you",
      subtitle: "رجسٹرڈ موبائل نمبر یا آدھار کے آخری 4 ہندسے درج کریں۔",
      mobileTab: "موبائل",
      aadhaarTab: "آدھار",
      mobilePlaceholder: "10 ہندسوں کا موبائل نمبر درج کریں",
      aadhaarPlaceholder: "1234",
      submitBtn: "تصدیق کریں اور او ٹی پی حاصل کریں"
    },
    bottomSheet: {
      title: "کیا مسئلہ پیش آیا؟",
      subtitle: "جیسے چاہیں بتائیں۔ یہ اختیاری ہے، لیکن اس سے مسئلہ جلدی حل ہوتا ہے۔",
      speakOption: "بول کر بتائیں",
      speakDesc: "Record a voice note.",
      typeOption: "لکھ کر بتائیں",
      typeDesc: "Type a short message",
      photoOption: "تصویر بھیجیں",
      photoDesc: "Upload a photo of the issue",
      listeningText: "سن رہے ہیں... روکنے کے لیے دوبارہ دبائیں",
      stopToSaveText: "روکیں اور محفوظ کریں",
      textPlaceholder: "مثلاً: دوا کاؤنٹر پر 40 منٹ انتظار کرنا پڑا...",
      photoUploadText: "کیمرا کھولیں یا تصویر منتخب کریں",
      photoLimitText: "JPG or PNG · up to 5MB",
      skipBtn: "چھوڑیں",
      submitBtn: "بھیجیں"
    },
    ratingLabels: {
      couldBeBetter: "بہتری کی ضرورت (Could Be Better)",
      acceptable: "مقبول (Acceptable)",
      excellent: "بہترین (Excellent)"
    },
    couldBeBetterPrompt: "برائے کرم وضاحت کریں کہ کیا بہتر کیا جا سکتا ہے...",
    couldBeBetterPlaceholder: "طویل انتظار، عملے کا رویہ، ادویات کی عدم دستیابی...",
    improvementTags: [
      "طویل انتظار",
      "عملے کا نامناسب رویہ",
      "ادویات کی عدم دستیابی",
      "صفائی کی کمی"
    ],
    questions: [
      {
        id: 1,
        title: "ڈاکٹر کے ساتھ مشاورت کا تجربہ کیسا رہا؟",
        category: "طبی دیکھ بھال",
        type: "rating"
      },
      {
        id: 2,
        title: "فارمیسی / دوا کاؤنٹر کا تجربہ کیسا رہا؟",
        category: "دوا کاؤنٹر",
        type: "rating"
      },
      {
        id: 3,
        title: "کیا لکھی گئی تمام ادویات مفت دستیاب تھیں؟",
        category: "ادویات کی دستیابی",
        type: "rating"
      },
      {
        id: 4,
        title: "ہسپتال کی صفائی ستھرائی کیسی تھی؟",
        category: "صفائی",
        type: "rating"
      },
      {
        id: 5,
        title: "کوئی تجویز یا شکایت؟",
        category: "شکایت اور تجویز",
        type: "text"
      }
    ],
    commonButtons: {
      previous: "پچھلا",
      next: "آگے بڑھیں ←",
      submit: "جمع کریں",
      skip: "چھوڑیں",
      verifyAndProceed: "تصدیق کریں اور آگے بڑھیں ✓",
      resendOTP: "دوبارہ او ٹی پی بھیجیں",
      trackFeedback: "ٹریک کریں",
      submitAnother: "نیا فیڈ بیک دیں ↺",
      downloadReceipt: "رسید ڈاؤن لوڈ کریں 📄"
    },
    confirmation: {
      thankYou: "شکریہ!",
      subtitle: "آپ کا فیڈ بیک اور شکایت پورٹل پر درج کر لی گئی ہے۔",
      trackingLabel: "ٹریکنگ آئی ڈی",
      smsSentNotice: "ایس ایم ایس بھیج دیا گیا:",
      slaNotice: "آپ کی شکایت چیف میڈیکل آفیسر (CMO) کو بھیجی گئی ہے۔"
    },
    scannerPage: {
      headerTitle: "اپنے ہسپتال کا تجربہ شیئر کریں",
      headerSubtitle: "آپ کا براہ راست فیڈ بیک وزارت صحت و خاندانی بہبود کو ملک بھر میں مریضوں کی دیکھ بھال میں بہتری لانے میں مدد کرتا ہے۔",
      scanQrTitle: "ہسپتال کیو آر کوڈ اسکین کریں",
      detectedFacility: "شناخت شدہ ہسپتال",
      changeBtn: "تبدیل کریں",
      securePrivate: "محفوظ اور نجی",
      govtVerified: "سرکاری تصدیق شدہ",
      support247: "24/7 مدد",
      continueBtn: "رجسٹریشن کے لیے آگے بڑھیں"
    }
  }
};
