import type { Dictionary } from './en';

export const hi: Dictionary = {
  brand: 'AirWise',
  tagline: 'अपने परिवार का स्मॉग साथी',
  pitch:
    'लाइव AQI को आपके घर और दिनचर्या के हिसाब से प्लान में बदलता है — हर टिप के साथ “क्यों”.',

  nav: {
    home: 'होम',
    plan: 'प्लान',
    impact: 'इम्पैक्ट',
    community: 'कम्युनिटी',
    profile: 'प्रोफ़ाइल',
  },

  lang: {
    en: 'EN',
    hi: 'हिं',
    label: 'भाषा',
  },

  profile: {
    title: 'आपकी पारिवारिक प्रोफ़ाइल',
    subtitle: 'हम टिप्स को आपके घर और सफर के अनुसार बनाते हैं।',
    city: 'शहर',
    cityHint: 'शहर सर्च करके चुनें।',
    citySearchHint: 'टाइप करके सर्च करें — लिस्ट से चुनें।',
    citySearchPlaceholder: 'शहर खोजें (जैसे मुंबई, लखनऊ)…',
    selectedLocation: 'चुना हुआ शहर',
    useGps: 'मेरी वर्तमान लोकेशन इस्तेमाल करें',
    gpsLoading: 'लोकेशन ढूँढी जा रही है…',
    gpsDenied: 'लोकेशन अनुमति नहीं मिली — शहर चुनें।',
    gpsUnsupported: 'इस ब्राउज़र में GPS नहीं चलता।',
    otherCity: 'दूसरा शहर (नाम लिखें)',
    homeType: 'घर का प्रकार',
    homeTypes: {
      apartment: 'अपार्टमेंट',
      house: 'स्वतंत्र मकान',
      villa: 'विला / बंगला',
    },
    commute: 'रोज़ का सफर',
    commuteOptions: {
      bike: 'बाइक / स्कूटर',
      car: 'कार',
      metro: 'मेट्रो',
      walk: 'पैदल',
    },
    kids: 'घर में बच्चे',
    elderly: 'घर में बुज़ुर्ग',
    save: 'प्रोफ़ाइल सेव करें',
    demoSeed: 'दिल्ली परिवार लोड करें',
    saved: 'प्रोफ़ाइल सेव हो गई',
  },

  home: {
    yourLocation: 'आपकी लोकेशन',
    useGps: 'लोकेशन एक्सेस दें',
    gpsLoading: 'लोकेशन मिल रही है…',
    gpsDenied:
      'लोकेशन ब्लॉक है — ब्राउज़र में Allow करें, या Profile से शहर चुनें।',
    gpsHint: 'ब्राउज़र एक बार पूछेगा — Allow दबाएं, पास का लाइव AQI मिलेगा।',
    aqiLabel: 'वायु गुणवत्ता सूचकांक',
    pm25: 'PM2.5',
    sampleBanner:
      'सैंपल डेटा — लाइव AQI उपलब्ध नहीं। डेमो मान दिखाए जा रहे हैं।',
    liveBanner: 'लाइव AQI (Open-Meteo)',
    generatePlan: 'आज का प्लान बनाएं',
    generating: 'प्लान बन रहा है…',
    viewPlan: 'प्लान खोलें',
    actionCards: 'आज का फोकस',
    retryAqi: 'AQI फिर से लाएं',
    loadingAqi: 'AQI लाया जा रहा है…',
    noCards: 'तीन एक्शन कार्ड पाने के लिए प्लान जनरेट करें।',
  },

  plan: {
    title: 'आपका दैनिक स्मॉग प्लान',
    empty: 'अभी कोई प्लान नहीं। पहले प्रोफ़ाइल सेव करके होम से जनरेट करें।',
    generate: 'प्लान बनाएं',
    regenerating: 'प्लान अपडेट हो रहा है…',
    retry: 'फिर कोशिश',
    cached: 'कैश किया हुआ प्लान',
    sections: {
      lowEmissionRoutine: 'कम-उत्सर्जन दिनचर्या',
      indoorHacks: 'घर के अंदर हवा के उपाय',
      sustainableAlternatives: 'टिकाऊ विकल्प',
    },
    why: 'क्यों',
  },

  impact: {
    title: 'व्हाट-इफ इम्पैक्ट मीटर',
    subtitle: 'टॉगल करें और अनुमानित एक्सपोज़र कमी व CO₂ बचत देखें।',
    approx: 'लगभग',
    exposureDown: 'एक्सपोज़र ↓',
    co2Saved: 'CO₂ बचत',
    kg: 'किग्रा / दिन',
    toggles: {
      metro: 'सफर मेट्रो से करें',
      windowsClosedMorning: 'सुबह पीक में खिड़कियाँ बंद रखें',
      purifier: 'पीक घंटों में एयर प्यूरीफ़ायर चलाएं',
    },
    familyNote:
      'संवेदनशील परिवार (बच्चे / बुज़ुर्ग) — प्रभाव थोड़ा अधिक वज़न में।',
    tip: 'आंकड़े डेमो के लिए निर्धारित अनुमान हैं — लैब माप नहीं।',
  },

  community: {
    title: 'मोहल्ला इम्पैक्ट',
    subtitle: 'सोसाइटी / मोहल्ला ग्रुप जॉइन करें और संयुक्त स्कोर देखें।',
    groupName: 'सोसाइटी / ग्रुप नाम',
    join: 'ग्रुप जॉइन करें',
    leave: 'ग्रुप छोड़ें',
    yourContribution: 'आपका योगदान',
    combinedScore: 'संयुक्त ग्रुप स्कोर',
    homes: 'घर',
    seedHint:
      'डेमो सीड: ग्रीन पार्क सोसाइटी — ~47 घर पहले से एक्सपोज़र घटा रहे हैं।',
    joinedAs: 'आप जुड़े हैं',
    notJoined: 'अभी किसी ग्रुप में नहीं — इम्पैक्ट जोड़ने के लिए जॉइन करें।',
  },

  common: {
    loading: 'लोड हो रहा है…',
    error: 'कुछ गलत हो गया',
    retry: 'फिर कोशिश',
    yes: 'हाँ',
    no: 'नहीं',
  },
};
