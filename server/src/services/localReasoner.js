/**
 * Local Smart Reasoning Engine (Zero-Config Offline AI Fallback)
 * Analyzes semantic nuances, builds educational micro-lessons, and formulates clear next steps
 * in English, Hindi, and Marathi when an external LLM key is absent or unreachable.
 */

export function analyzeLocally(text, ruleResult, language = 'en') {
  const selectedLang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';
  const flags = [...ruleResult.flags];
  const aiFlags = [];

  const lower = text.toLowerCase();

  // Nuance 1: Impersonation / Cloned Identity
  if (/(?:official|admin|sir|madam|team|desk|customer care|helpline)/i.test(lower) &&
      /(?:telegram|whatsapp|dm|message|inbox)/i.test(lower)) {
    aiFlags.push({
      id: "impersonation_nuance",
      severity: "HIGH",
      source: "ai",
      title: {
        en: "Profile Impersonation / Fake Support Persona",
        hi: "फर्जी सपोर्ट या अधिकारी बनकर बात करना",
        mr: "बनावट अधिकारी किंवा सपोर्ट टीम असल्याचे भासवणे"
      }[selectedLang],
      explanation: {
        en: "The sender uses official-sounding titles ('Admin', 'Support Desk') on a private messaging platform. Scammers impersonate real SEBI employees or brokerage customer support to gain unearned trust.",
        hi: "संदेश भेजने वाला निजी चैट पर 'एडमिन' या 'सपोर्ट डेस्क' जैसे आधिकारिक पदों का दिखावा कर रहा है ताकि आप उन पर भरोसा कर लें।",
        mr: "मेसेज पाठवणारी व्यक्ती खाजगी चॅटवर 'ॲडमिन' किंवा 'सपोर्ट डेस्क' सारख्या अधिकृत नावांचा वापर करून खोटा विश्वास संपादन करत आहे."
      }[selectedLang]
    });
  }

  // Nuance 2: Psychological Exploitation of FOMO
  if (/(?:chance|opportunity|last time|don't miss|miss out|mauka|chuko mat|संधी|सोडू नका)/i.test(lower)) {
    aiFlags.push({
      id: "fomo_manipulation",
      severity: "MEDIUM",
      source: "ai",
      title: {
        en: "Fear of Missing Out (FOMO) Manipulation",
        hi: "चूक जाने का डर (FOMO) पैदा करना",
        mr: "संधी गमावण्याची भीती (FOMO) निर्माण करणे"
      }[selectedLang],
      explanation: {
        en: "The message targets fear and excitement, making you feel you will lose a once-in-a-lifetime wealth opportunity if you don't send money immediately.",
        hi: "संदेश में यह अहसास कराया जा रहा है कि यदि आपने तुरंत पैसे नहीं लगाए तो आप अमीर बनने का बहुत बड़ा मौका खो देंगे।",
        mr: "हा संदेश भीती आणि मोहाचा गैरफायदा घेतो, ज्यामुळे आपल्याला वाटते की लगेच पैसे न दिल्यास मोठी संधी हातातून जाईल."
      }[selectedLang]
    });
  }

  // Micro-lesson generator based on detected traits
  let microLesson = getMicroLesson(flags.concat(aiFlags), selectedLang);

  // Action steps
  let actionSteps = getActionSteps(ruleResult.verdict, selectedLang);

  // Plain-language summary
  let plainExplanation = getPlainExplanation(ruleResult.verdict, flags.concat(aiFlags), selectedLang);

  return {
    aiFlags,
    plainExplanation,
    microLesson,
    actionSteps,
    disclaimer: {
      en: "Automated analysis tool. While highly accurate against common scam patterns, always exercise independent caution. Nivesh Suraksha does not provide financial or legal advice.",
      hi: "स्वचालित विश्लेषण उपकरण। सामान्य धोखाधड़ी के पैटर्न पर सटीक होने के बावजूद, हमेशा अपनी सतर्कता बरतें। निवेश सुरक्षा वित्तीय सलाह प्रदान नहीं करती है।",
      mr: "स्वयंचलित विश्लेषण साधन. घोटाळ्यांच्या पॅटर्नवर अचूक असले तरी, नेहमी स्वतः खबरदारी घ्या. निवेश सुरक्षा कोणताही आर्थिक किंवा कायदेशीर सल्ला देत नाही."
    }[selectedLang]
  };
}

function getMicroLesson(allFlags, lang) {
  const hasGuaranteed = allFlags.some(f => f.id === 'guaranteed_returns');
  const hasUrgency = allFlags.some(f => f.id === 'artificial_urgency' || f.id === 'fomo_manipulation');
  const hasPrivate = allFlags.some(f => f.id === 'private_group_migration');

  if (hasGuaranteed) {
    return {
      title: {
        en: "Why People Fall For This: The 'Certainty Illusion'",
        hi: "लोग इसमें क्यों फंसते हैं: 'निश्चितता का भ्रम'",
        mr: "लोक यात का फसतात: 'निश्चिततेचा आभास'"
      }[lang],
      content: {
        en: "Human psychology naturally craves security. When an investment promises '100% safe guaranteed profit' during volatile economic times, our brain's critical thinking center is bypassed by greed and relief. In real financial markets, higher returns mathematically require higher risk—any guarantee is an immediate mathematical impossibility.",
        hi: "इंसानी दिमाग स्वाभाविक रूप से सुरक्षा चाहता है। जब कोई '100% पक्का मुनाफा' का वादा करता है, तो हमारा दिमाग लालच में आकर सतर्कता भूल जाता है। वास्तविक वित्तीय बाजार में अधिक लाभ के साथ जोखिम भी अधिक होता है—कोई भी गारंटी वास्तविक नहीं हो सकती।",
        mr: "मानवी स्वभाव नेहमी सुरक्षिततेचा शोध घेतो. जेव्हा कोणी '१००% खात्रीशीर नफ्याचे' वचन देतो, तेव्हा मोहापोटी आपली विचार करण्याची क्षमता मंदावते. आर्थिक बाजारात हमखास परताव्याची हमी देणे पूर्णपणे अशक्य आणि खोटे असते."
      }[lang],
      takeaway: {
        en: "Rule of thumb: In finance, if the return is guaranteed, the fraud is guaranteed.",
        hi: "मूलमंत्र: वित्त में, यदि रिटर्न की गारंटी है, तो धोखाधड़ी भी पक्की है।",
        mr: "सुवर्णनियम: जर परताव्याची खात्री दिली जात असेल, तर तो नक्कीच घोटाळा आहे."
      }[lang]
    };
  }

  if (hasUrgency) {
    return {
      title: {
        en: "Why People Fall For This: Fabricated Time Pressure",
        hi: "लोग इसमें क्यों फंसते हैं: बनावटी तात्कालिकता का दबाव",
        mr: "लोक यात का फसतात: बनावट घाईगडबडीचे तंत्र"
      }[lang],
      content: {
        en: "Scammers use time pressure ('only 5 minutes left') to induce adrenaline and panic. Under stress, the human prefrontal cortex cannot perform logical verification or seek a second opinion. Legitimate investments never expire in 10 minutes.",
        hi: "धोखेबाज जल्दबाजी ('सिर्फ 5 मिनट बाकी') का नाटक करके आपको घबराहट में डालते हैं। तनाव में आकर इंसान किसी से सलाह लेने या जांच करने का मौका खो देता है। वास्तविक निवेश 10 मिनट में खत्म नहीं होते।",
        mr: "घोटाळेबाज 'फक्त ५ मिनिटे शिल्लक' अशी कृत्रिम घाई निर्माण करतात. तणावाखाली माणूस कोणाचा सल्ला न घेता घाईने चुकीचा निर्णय घेतो. अस्सल गुंतवणूक कधीही १० मिनिटांत संपत नाही."
      }[lang],
      takeaway: {
        en: "Rule of thumb: Whenever someone pushes you to decide immediately, take 24 hours to pause and verify.",
        hi: "मूलमंत्र: जब भी कोई आपको तुरंत निर्णय लेने को कहे, तो 24 घंटे रुकें और जांच करें।",
        mr: "सुवर्णनियम: जेव्हा कोणी त्वरित पैसे भरण्यास सांगेल, तेव्हा २४ तास थांबा आणि पडताळणी करा."
      }[lang]
    };
  }

  return {
    title: {
      en: "Why People Fall For This: The Social Proof Trap",
      hi: "लोग इसमें क्यों फंसते हैं: फर्जी सामाजिक प्रमाण का जाल",
      mr: "लोक यात का फसतात: बनावट सोशल प्रूफचा सापळा"
    }[lang],
    content: {
      en: "Scammers populate groups with 50+ fake bot accounts sharing fake profit screenshots and praising the 'admin'. New members assume that if hundreds of other people are making money, it must be genuine.",
      hi: "धोखेबाज टेलीग्राम/व्हाट्सएप ग्रुप में दर्जनों फर्जी बोट खातों से नकली मुनाफे के स्क्रीनशॉट पोस्ट करवाते हैं। नया व्यक्ति यह सोचकर भरोसा कर लेता है कि इतने सारे लोग कमा रहे हैं तो यह सच ही होगा।",
      mr: "घोटाळेबाज ग्रुपमध्ये अनेक बनावट खात्यांद्वारे खोटे नफ्याचे स्क्रीनशॉट्स पाठवतात. नवीन गुंतवणूकदाराला वाटते की सर्वजण नफा कमवत आहेत, तर हे खरेच असेल."
    }[lang],
    takeaway: {
      en: "Rule of thumb: Screenshots in private chat groups are trivial to fabricate. Never trust unverified digital proof.",
      hi: "मूलमंत्र: निजी चैट ग्रुप्स में स्क्रीनशॉट बनाना बहुत आसान है। असत्यापित डिजिटल दावों पर कभी भरोसा न करें।",
      mr: "सुवर्णनियम: चॅट ग्रुपमधील स्क्रीनशॉट सहज बनावट बनवता येतात. त्यावर कधीही विश्वास ठेवू नका."
    }[lang]
  };
}

function getActionSteps(verdict, lang) {
  if (verdict === "Likely scam" || verdict === "Suspicious") {
    return {
      en: [
        { title: "Do NOT Send Money or Enter PIN", desc: "Never make payments via UPI, IMPS, or transfer to personal individual accounts." },
        { title: "Do NOT Share OTP or Credentials", desc: "SEBI, banks, and genuine brokers never request your OTP, password, or UPI PIN." },
        { title: "Block and Report the Sender", desc: "Report the profile directly within WhatsApp / Telegram as spam/scam." },
        { title: "Report Financial Cyber Fraud", desc: "If you have transferred money, immediately call helpline 1930 and file on cybercrime.gov.in." }
      ],
      hi: [
        { title: "पैसे या यूपीआई पिन कभी न भेजें", desc: "किसी भी व्यक्तिगत खाते या अज्ञात यूपीआई आईडी पर कोई भुगतान न करें।" },
        { title: "ओटीपी या गुप्त विवरण साझा न करें", desc: "सेबी, बैंक और अधिकृत ब्रोकर कभी भी आपका ओटीपी या पिन नहीं मांगते।" },
        { title: "संदेश भेजने वाले को तुरंत ब्लॉक करें", desc: "व्हाट्सएप या टेलीग्राम पर उस अकाउंट को 'स्पैम/स्कैम' के रूप में रिपोर्ट करें।" },
        { title: "साइबर फ्रॉड हेल्पलाइन 1930 पर संपर्क करें", desc: "यदि आपने पैसे भेज दिए हैं, तो तुरंत 1930 डायल करें और cybercrime.gov.in पर रिपोर्ट दर्ज करें।" }
      ],
      mr: [
        { title: "पैसे पाठवू नका किंवा पिन टाकू नका", desc: "कोणत्याही वैयक्तिक बँक खात्यात किंवा संशयास्पद यूपीआय आयडीवर पैसे पाठवू नका." },
        { title: "ओटीपी किंवा गोपनीय माहिती शेअर करू नका", desc: "सेबी, बँका आणि ब्रोकर कधीही तुमचा ओटीपी किंवा यूपीआय पिन मागत नाहीत." },
        { title: "मेसेज पाठवणाऱ्याला त्वरित ब्लॉक करा", desc: "व्हॉट्सॲप किंवा टेलिग्रामवर त्या व्यक्तीला स्पॅम म्हणून रिपोर्ट करा." },
        { title: "सायबर हेल्पलाईन १९३० वर त्वरित संपर्क करा", desc: "पैसे हस्तांतरित झाले असल्यास ताबडतोब १९३० डायल करा आणि cybercrime.gov.in वर तक्रार नोंदवा." }
      ]
    }[lang];
  }

  return {
    en: [
      { title: "Verify Entity on SEBI Portal", desc: "Always check registration status on sebi.gov.in under Intermediaries list before investing." },
      { title: "Pay Only to Registered Corporate Accounts", desc: "Legitimate brokers and mutual funds only accept payments via registered banking gateways." },
      { title: "Keep Records Safe", desc: "Preserve all contract notes, payment receipts, and communications for future reference." }
    ],
    hi: [
      { title: "सेबी पोर्टल पर पंजीकरण की पुष्टि करें", desc: "निवेश करने से पहले हमेशा sebi.gov.in पर मध्यस्थ सूची में पंजीकरण की जांच करें।" },
      { title: "केवल अधिकृत संस्था के खाते में भुगतान करें", desc: "मान्यता प्राप्त ब्रोकर केवल आधिकारिक बैंकिंग गेटवे से ही भुगतान स्वीकार करते हैं।" },
      { title: "रिकॉर्ड सुरक्षित रखें", desc: "सभी अनुबंध पत्र (कॉन्ट्रैक्ट नोट्स) और भुगतान रसीदें संभाल कर रखें।" }
    ],
    mr: [
      { title: "सेबी पोर्टलवर नोंदणी तपासा", desc: "गुंतवणूक करण्यापूर्वी नेहमी sebi.gov.in वर संबंधित संस्थेची नोंदणी तपासा." },
      { title: "केवळ अधिकृत बँक खात्यात व्यवहार करा", desc: "अधिकृत ब्रोकर्स केवळ अधिकृत बँकिंग प्रणालीद्वारे पैसे स्वीकारतात." },
      { title: "सर्व पावत्या सुरक्षित ठेवा", desc: "भविष्यातील संदर्भासाठी सर्व व्यवहार नोंदी आणि करार पत्रे सुरक्षित ठेवा." }
    ]
  }[lang];
}

function getPlainExplanation(verdict, flags, lang) {
  if (verdict === "Likely scam") {
    return {
      en: `High-risk indicators detected (${flags.length} red flags). This message displays common hallmarks of investment fraud, such as promising impossible returns, creating false urgency, or asking for private payments. Do not engage.`,
      hi: `अत्यधिक जोखिम के संकेत पाए गए (${flags.length} खतरे के निशान)। यह संदेश निवेश धोखाधड़ी के स्पष्ट लक्षणों को दर्शाता है जैसे असंभव मुनाफे का दावा और जल्दबाजी का दबाव। इससे पूरी तरह दूर रहें।`,
      mr: `अत्यंत उच्च जोखमीचे संकेत आढळले आहेत (${flags.length} धोक्याचे इशारे). हा संदेश गुंतवणूक फसवणुकीची लक्षणे दाखवतो, जसे की अवास्तव नफ्याचे दावे आणि पैशांची मागणी. व्यवहार करू नका.`
    }[lang];
  }

  if (verdict === "Suspicious") {
    return {
      en: `Suspicious indicators detected (${flags.length} red flag). While not conclusive, this message requires high vigilance. Proceed with extreme caution and do not commit funds without verifying the advisor's SEBI credentials.`,
      hi: `संदिग्ध लक्षण पाए गए (${flags.length} खतरे का संकेत)। यद्यपि यह अंतिम निष्कर्ष नहीं है, लेकिन सावधानी बरतें और सेबी पंजीकरण जांचे बिना पैसे न दें।`,
      mr: `संशयास्पद बाबी आढळल्या आहेत (${flags.length} इशारा). खबरदारी बाळगा आणि सेबी नोंदणी तपासल्याशिवाय कोणतीही रक्कम गुंतवू नका.`
    }[lang];
  }

  return {
    en: "No obvious fraudulent patterns were triggered. However, remember that new fraud tactics constantly evolve. Always verify SEBI registration directly on sebi.gov.in before transferring any money.",
    hi: "धोखाधड़ी का कोई स्पष्ट पैटर्न नहीं मिला। फिर भी, हमेशा सतर्क रहें और किसी भी निवेश से पहले sebi.gov.in पर आधिकारिक पंजीकरण की पुष्टि करें।",
    mr: "फसवणुकीचा कोणताही उघड नमुना आढळला नाही. तरीही, पैसे पाठवण्यापूर्वी नेहमी sebi.gov.in वर अधिकृत नोंदणीची खात्री करा."
  }[lang];
}
