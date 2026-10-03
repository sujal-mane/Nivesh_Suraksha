/**
 * Multilingual Rule-Based Red Flag Detection Engine
 * Deterministic regex and keyword matching in English, Hindi (Devanagari), Marathi, and Hinglish.
 */

export const RED_FLAG_DEFINITIONS = [
  {
    id: "guaranteed_returns",
    severity: "CRITICAL",
    weight: 35,
    title: {
      en: "Guaranteed or Fixed Returns Claim",
      hi: "निश्चित या गारंटीड रिटर्न का झूठा दावा",
      mr: "खात्रीशीर किंवा निश्चित परताव्याचा दावा"
    },
    explanation: {
      en: "Stock market investments always involve market risk. Legitimate advisors never promise fixed, assured, or guaranteed returns. Such claims are illegal under SEBI regulations.",
      hi: "शेयर बाजार में निवेश हमेशा बाजार जोखिमों के अधीन होता है। वैध सलाहकार कभी भी निश्चित या गारंटीड रिटर्न का वादा नहीं करते। सेबी नियमों के तहत ऐसे दावे अवैध हैं।",
      mr: "शेअर बाजारातील गुंतवणूक नेहमीच बाजारातील जोखमीच्या अधीन असते. कायदेशीर सल्लागार कधीही हमी किंवा निश्चित परताव्याचे वचन देत नाहीत. सेबीच्या नियमांनुसार असे दावे बेकायदेशीर आहेत."
    },
    patterns: [
      /(?:100%|hundred\s*percent|guarantee|guaranteed|assured|fixed|pukka|pakka)\s*(?:return|profit|gain|faida|munafa|kamai|earning|income)/i,
      /(?:double|2x|3x|5x|10x)\s*(?:your\s*money|paisa|capital|investment)\s*in\s*(?:\d+\s*(?:days|hours|weeks|months|din|ghante))/i,
      /(?:पक्का|गारंटीड|निश्चित|100%)\s*(?:मुनाफा|रिटर्न|फायदा|कमाई|लाभ)/i,
      /(?:पैसे|रुपये)\s*(?:दोगुना|तीन\s*गुना|दुप्पट)/i,
      /(?:खात्रीशीर|गॅरंटीड|नक्की|निश्चित)\s*(?:नफा|परतावा|कमाई)/i,
      /(?:zero\s*risk|no\s*loss|loss\s*free)\s*(?:guarantee|trading|investment)/i,
      /(?:बिना\s*(?:किसी\s*)?(?:रिस्क|जोखिम)\s*(?:के\s*)?(?:मुनाफा|कमाई))/i,
      /(?:कोणताही\s*धोका\s*नाही|धोकामुक्त\s*नफा)/i
    ]
  },
  {
    id: "credential_payment_theft",
    severity: "CRITICAL",
    weight: 40,
    title: {
      en: "Request for OTP, UPI PIN, or Personal Account Transfer",
      hi: "ओटीपी, यूपीआई पिन या व्यक्तिगत खाते में पैसे की मांग",
      mr: "ओटीपी, यूपीआय पिन किंवा वैयक्तिक खात्यात पैशांची मागणी"
    },
    explanation: {
      en: "Scammers ask for OTP, UPI PIN, or money transfers into individual personal savings accounts or unknown UPI QR codes. SEBI intermediaries only accept payments into designated business accounts and never ask for PINs or OTPs.",
      hi: "धोखेबाज ओटीपी, यूपीआई पिन मांगते हैं या व्यक्तिगत खातों/क्यूआर कोड में पैसा भेजने को कहते हैं। सेबी पंजीकृत संस्थान कभी भी आपका पिन/ओटीपी नहीं मांगते।",
      mr: "घोटाळेबाज ओटीपी, यूपीआय पिन मागतात किंवा वैयक्तिक बँक खात्यात पैसे भरण्यास सांगतात. सेबी-नोंदणीकृत मध्यस्थ कधीही पिन किंवा ओटीपी मागत नाहीत."
    },
    patterns: [
      /(?:share|send|bhejo|tell|enter|daalo|type)\s*(?:your\s*)?(?:secret\s*)?(?:otp|one\s*time\s*password|upi\s*pin|mpin|pin)/i,
      /(?:enter|type|put)\s*(?:your\s*)?(?:secret\s*)?upi\s*pin\s*(?:to\s*(?:receive|claim|credit|accept|authenticate))/i,
      /(?:ओटीपी|पिन)\s*(?:शेयर|भेजें|बताएं|टाका)/i,
      /(?:transfer|send|pay)\s*(?:to\s*personal\s*account|in\s*my\s*gpay|phonepe|paytm\s*number|google\s*pay)/i,
      /(?:processing\s*fee|file\s*charge|activation\s*fee)\s*(?:first|advance|before\s*withdrawal|as|म्हणून)/i,
      /(?:पैसे\s*निकालने\s*के\s*लिए\s*पहले\s*टैक्स|फीस\s*भरें)/i,
      /(?:bonus\s*cash\s*prize|won\s*(?:rs|inr|cash)|lottery\s*bonus).*?(?:upi|pin|link)/i
    ]
  },
  {
    id: "artificial_urgency",
    severity: "HIGH",
    weight: 20,
    title: {
      en: "Artificial Urgency & Pressure Tactics",
      hi: "जल्दबाजी और दबाव बनाने की रणनीति",
      mr: "घाईगडबड आणि मानसिक दबावाचे तंत्र"
    },
    explanation: {
      en: "Scammers create false panic or scarcity ('only 3 seats left', 'offer expires in 10 minutes') so you act before verifying or thinking critically.",
      hi: "धोखेबाज 'केवल 3 सीटें शेष', 'ऑफर 10 मिनट में खत्म' जैसी कृत्रिम तात्कालिकता पैदा करते हैं ताकि आप बिना सोचे-समझे पैसे दे दें।",
      mr: "घोटाळेबाज 'फक्त ३ जागा शिल्लक', 'ऑफर १० मिनिटांत संपेल' असा दबाव आणतात जेणेकरून तुम्ही विचार न करता त्वरित पैसे द्याल."
    },
    patterns: [
      /(?:hurry|act\s*fast|limited\s*seats?|only\s*\d+\s*(?:slots?|seats?)\s*left)/i,
      /(?:offer\s*expires?|valid\s*only\s*today|valid\s*till\s*(?:midnight|tonight))/i,
      /(?:जल्दी\s*करें|सिर्फ\s*\d+\s*(?:सीटें|लोग)|आज\s*रात\s*तक\s*ही\s*मौका)/i,
      /(?:त्वरा\s*करा|फक्त\s*\d+\s*जागा\s*शिल्लक|आजच\s*शेवटची\s*संधी)/i,
      /(?:jaldi\s*karo|aaj\s*hi\s*mauka|slot\s*full\s*hone\s*wala|slot\s*closes)/i
    ]
  },
  {
    id: "insider_operator_claims",
    severity: "HIGH",
    weight: 25,
    title: {
      en: "Claims of Insider Tips or Operator Nexus",
      hi: "इनसाइडर जानकारी या ऑपरेटर गेम का दावा",
      mr: "अंतर्गत गुप्त बातमी किंवा ऑपरेटर खेळाचा दावा"
    },
    explanation: {
      en: "Claiming to have 'insider news' or 'operator nexus' is a trademark sign of pump-and-dump fraud. Insider trading is illegal, and operators use retail investors as exit liquidity.",
      hi: "'अंदर की खबर' या 'ऑपरेटर लीक' का दावा पंप-एंड-डंप धोखाधड़ी की निशानी है। ऑपरेटर आम खुदरा निवेशकों को फंसाकर अपना माल बेचकर भाग जाते हैं।",
      mr: "'अंतर्गत बातमी' किंवा 'ऑपरेटरचा गेम' असल्याचा दावा फसवणुकीचा मुख्य संकेत आहे. ऑपरेटर सामान्य गुंतवणूकदारांना अडकवून पळून जातात."
    },
    patterns: [
      /(?:insider\s*(?:tip|leak|info|news)|operator\s*(?:game|call|nexus|circuit|leak|blast))/i,
      /(?:100%|sure\s*shot)\s*(?:jackpot|breakout|upper\s*circuit)\s*(?:call|stock|tip|blast|profit)/i,
      /(?:अंदर\s*की\s*खबर|ऑपरेटर\s*गेम|जैकपॉट\s*कॉल|अपर\s*सर्किट)/i,
      /(?:अंतर्गत\s*गुप्त\s*माहिती|ऑपरेटर\s*खेळ|जॅकपॉट\s*टिप|अप्पर\s*सर्किट)/i,
      /(?:andar\s*ki\s*khabar|operator\s*leak|sure\s*shot\s*call|jackpot\s*blast)/i
    ]
  },
  {
    id: "private_group_migration",
    severity: "MEDIUM",
    weight: 15,
    title: {
      en: "Migration to Private Telegram / WhatsApp VIP Groups",
      hi: "निजी टेलीग्राम / व्हाट्सएप वीआईपी ग्रुप में बुलाना",
      mr: "खाजगी टेलिग्राम / व्हॉट्सॲप व्हीआयपी ग्रुपमध्ये नेणे"
    },
    explanation: {
      en: "Fraudsters avoid regulated platforms and push investors into private channels (Telegram, WhatsApp) where they can operate anonymously and delete chat logs.",
      hi: "धोखेबाज आधिकारिक और विनियमित मंचों से बचते हैं और निवेशकों को टेलीग्राम/व्हाट्सएप जैसे निजी चैनलों में खींचते हैं जहां वे संदेश मिटा सकते हैं।",
      mr: "घोटाळेबाज अधिकृत व्यासपीठे टाळून गुंतवणूकदारांना टेलिग्राम किंवा व्हॉट्सॲपवर नेतात जिथे ते आपली ओळख लपवून मेसेज डिलीट करू शकतात."
    },
    patterns: [
      /(?:join\s*(?:our\s*)?(?:vip|private|secret)?\s*(?:telegram|whatsapp)\s*(?:channel|group|link))/i,
      /(?:dm\s*me\s*on\s*whatsapp|inbox\s*me\s*for\s*link|message\s*on\s*telegram|dm\s*now\s*to\s*join)/i,
      /(?:टेलीग्राम\s*चैनल|व्हाट्सएप\s*ग्रुप)\s*(?:ज्वाइन|जुड़ें|लिंक)/i,
      /(?:टेलिग्राम\s*ग्रुप|व्हॉट्सॲप\s*ग्रुपमध्ये\s*सामील\s*व्हा)/i,
      /(?:t\.me\/[a-zA-Z0-9_]+|chat\.whatsapp\.com\/[a-zA-Z0-9_]+)/i,
      /(?:dm\s*karo|telegram\s*pe\s*aao|personal\s*me\s*message\s*karo)/i
    ]
  },
  {
    id: "fake_sebi_credentials",
    severity: "CRITICAL",
    weight: 35,
    title: {
      en: "Fake SEBI Registration / False Regulatory Endorsement",
      hi: "फर्जी सेबी पंजीकरण या सरकार के नाम का दुरुपयोग",
      mr: "बनावट सेबी नोंदणी किंवा सरकारी मान्यतेचा खोटा दावा"
    },
    explanation: {
      en: "SEBI regulates market participants, but NEVER endorses, guarantees, or certifies any specific investment scheme or assured returns. Claims of 'SEBI guaranteed return' are fraudulent.",
      hi: "सेबी बाजार के नियमों की देखरेख करता है, लेकिन कभी भी किसी योजना को 'गारंटीड रिटर्न' का प्रमाणपत्र नहीं देता। 'सेबी अनुमोदित पक्का मुनाफा' पूरी तरह फर्जी है।",
      mr: "सेबी बाजार नियमांचे नियंत्रण करते, परंतु कोणत्याही योजनेला हमी देत नाही. 'सेबी प्रमाणित हमी परतावा' हा संपूर्णपणे बनावट दावा आहे."
    },
    patterns: [
      /(?:sebi\s*(?:approved|certified|guaranteed)\s*(?:returns?|profit|scheme|jackpot))/i,
      /(?:gov(?:ernment)?\s*approved\s*100%\s*(?:profit|earning|income))/i,
      /(?:सेबी\s*(?:प्रमाणित|मान्यता\s*प्राप्त)\s*(?:गारंटीड|पक्का|सलाहकार)?\s*(?:मुनाफा|रिटर्न|योजना))/i,
      /(?:सेबी\s*मान्यताप्राप्त\s*खात्रीशीर\s*नफा)/i,
      /(?:sebi\s*ka\s*certificate\s*hai\s*guarantee\s*hai|sebi\s*approval\s*letter)/i
    ]
  },
  {
    id: "unrealistic_screenshots",
    severity: "MEDIUM",
    weight: 15,
    title: {
      en: "Unrealistic Profit Screenshots & Demo Ledger Pumping",
      hi: "फर्जी लाभ स्क्रीनशॉट और अवास्तविक प्रॉफिट का दिखावा",
      mr: "अवास्तव नफ्याचे स्क्रीनशॉट्स आणि बनावट नफा प्रदर्शन"
    },
    explanation: {
      en: "Inspect-element browser tricks and demo trading accounts are used to forge fake P&L screenshots showing lakhs of rupees made in minutes to induce greed.",
      hi: "लालच पैदा करने के लिए अक्सर डेमो अकाउंट या फोटो एडिट करके लाखों रुपये के फर्जी मुनाफे वाले स्क्रीनशॉट दिखाए जाते हैं।",
      mr: "गुंतवणूकदारांना भुलवण्यासाठी डेमो अकाऊंट किंवा एडिट केलेले खोट्या नफ्याचे स्क्रीनशॉट्स दाखवून लालच निर्माण केली जाते."
    },
    patterns: [
      /(?:see\s*(?:my|client|today['']?s?)\s*profit\s*screenshot|p[&n]l\s*proof)/i,
      /(?:made\s*(?:rs\.?|inr|₹)?\s*[0-9,]+\s*(?:in\s*\d+\s*(?:mins|minutes|hours)|today))/i,
      /(?:आज\s*का\s*प्रॉफिट\s*स्क्रीनशॉट|क्लाइंट\s*ने\s*कमाए)/i,
      /(?:आजचा\s*नफा\s*स्क्रीनशॉट|१०\s*मिनिटांत\s*नफा|२\s*लाख\s*कमावले)/i,
      /(?:live\s*proof\s*attached|screenshot\s*dekho)/i,
      /(?:खाते\s*आम्ही\s*हँडल\s*करू|account\s*handling)/i
    ]
  },
  {
    id: "unregulated_crypto_forex",
    severity: "HIGH",
    weight: 25,
    title: {
      en: "Unregulated Crypto/Forex/Binary Trading Scheme",
      hi: "अवैध विदेशी मुद्रा (Forex) या क्रिप्टो बाइनरी ट्रेडिंग स्कीम",
      mr: "अनधिकृत फॉरेक्स किंवा क्रिप्टो बायनरी ट्रेडिंग योजना"
    },
    explanation: {
      en: "Binary trading, unlicensed offshore forex apps, and automated crypto doubling bots are strictly illegal and unapproved by RBI and SEBI in India.",
      hi: "बाइनरी ट्रेडिंग, अनधिकृत विदेशी फॉरेक्स ऐप और क्रिप्टो ऑटो-बॉट भारत में आरबीआई और सेबी द्वारा प्रतिबंधित और अवैध हैं।",
      mr: "बायनरी ट्रेडिंग, अनधिकृत फॉरेक्स ॲप्स आणि क्रिप्टो ऑटो-बॉट्स भारतात रिझर्व्ह बँक व सेबीद्वारे बेकायदेशीर ठरवले गेले आहेत."
    },
    patterns: [
      /(?:binary\s*options?|60\s*second\s*trade|90%\s*payout\s*in\s*1\s*min|binary\s*doubler)/i,
      /(?:forex\s*trading\s*app|olymptrade|octafx|binomo|iq\s*option|forex\s*trading\s*bot)/i,
      /(?:crypto\s*(?:bot|doubler|mining\s*pool\s*guarantee|auto\s*earning))/i,
      /(?:बाइनरी\s*ऑप्शन|फॉरेक्स\s*ऑटो\s*बॉट|क्रिप्टो\s*माइनिंग\s*पक्का\s*रिटर्न)/i,
      /(?:बायनरी\s*ऑप्शन्स|फॉरेक्स\s*ट्रेडिंग)/i
    ]
  }
];

export function runRuleEngine(text, language = 'en') {
  const selectedLang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';
  const detectedFlags = [];
  let totalScore = 0;

  if (!text || text.trim().length === 0) {
    return {
      flags: [],
      score: 0,
      verdict: "No clear red flags found",
      confidence: 10,
      isUncertain: true
    };
  }

  for (const def of RED_FLAG_DEFINITIONS) {
    let matched = false;

    for (const pattern of def.patterns) {
      if (pattern.test(text)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      totalScore += def.weight;
      detectedFlags.push({
        id: def.id,
        severity: def.severity,
        weight: def.weight,
        source: 'rule',
        title: def.title[selectedLang] || def.title.en,
        explanation: def.explanation[selectedLang] || def.explanation.en
      });
    }
  }

  // Determine rule engine verdict
  let verdict = "No clear red flags found";
  let confidence = 20;
  let isUncertain = false;

  // Text length factor: very short text has inherent uncertainty
  const isShortText = text.trim().split(/\s+/).length < 6;

  if (totalScore >= 40) {
    verdict = "Likely scam";
    confidence = Math.min(96, 65 + Math.floor(totalScore * 0.3));
  } else if (totalScore >= 15) {
    verdict = "Suspicious";
    confidence = Math.min(85, 45 + Math.floor(totalScore * 0.4));
  } else if (totalScore > 0) {
    verdict = "Suspicious";
    confidence = 40;
    isUncertain = true;
  } else {
    if (isShortText) {
      verdict = "I'm not sure";
      confidence = 25;
      isUncertain = true;
    } else {
      verdict = "No clear red flags found";
      confidence = 75;
      isUncertain = false;
    }
  }

  return {
    flags: detectedFlags,
    score: totalScore,
    verdict,
    confidence,
    isUncertain
  };
}
