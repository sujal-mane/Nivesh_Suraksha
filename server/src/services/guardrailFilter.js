/**
 * Financial Ethics & Regulatory Guardrail Filter
 * Intercepts requests where user asks for stock tips, price targets, buy/sell advice,
 * or tries to use the platform for investment advice.
 */

export function checkGuardrails(text, language = 'en') {
  if (!text || typeof text !== 'string') {
    return { isViolation: false };
  }

  const normalized = text.toLowerCase();

  // Patterns asking for investment recommendations / stock tips
  const adviceSeekingPatterns = [
    /\b(?:should i buy|should i sell|which stock to buy|best stock for tomorrow|target price for)\b/i,
    /(?:kal konsa share kharidu|kaun sa stock lu|kisme invest karu|kya ye share kharidna chahiye)/i,
    /(?:कौन सा शेयर खरीदूं|कौनसा शेयर लूं|किसमें निवेश करूं|निफ्टी टारगेट बताओ|शेयर खरीदें या बेचें)/i,
    /(?:कोणता शेअर खरेदी करू|कोणत्या शेअरमध्ये गुंतवणूक करू|शेअर वाढेल का)/i,
    /\b(?:tell me stock tips|give me multibagger tips|nifty prediction|banknifty target)\b/i,
    /\b(?:give me buy call|give me sell call|crypto future signal)\b/i
  ];

  for (const pattern of adviceSeekingPatterns) {
    if (pattern.test(normalized)) {
      const messages = {
        en: {
          title: "Regulatory Guardrail Notice: No Investment Advice",
          explanation: "Nivesh Suraksha is strictly an investor safety and scam-checking tool. Under SEBI regulations, we do not provide stock tips, buy/sell/hold recommendations, or market predictions.",
          guidance: "If you need investment advice, please consult only a SEBI-registered Investment Adviser (RIA) or Research Analyst (RA). Verify their credentials at sebi.gov.in."
        },
        hi: {
          title: "नियामक सुरक्षा सूचना: निवेश सलाह उपलब्ध नहीं है",
          explanation: "निवेश सुरक्षा केवल एक निवेशक सुरक्षा और धोखाधड़ी जांच उपकरण है। सेबी (SEBI) के नियमों के तहत, हम स्टॉक टिप्स, शेयर खरीदने/बेचने की सलाह या बाजार पूर्वानुमान प्रदान नहीं करते हैं।",
          guidance: "यदि आपको निवेश सलाह की आवश्यकता है, तो कृपया केवल सेबी-पंजीकृत निवेश सलाहकार (RIA) से परामर्श लें। sebi.gov.in पर उनके क्रेडेंशियल्स की पुष्टि करें।"
        },
        mr: {
          title: "नियामक सुरक्षा सूचना: गुंतवणूक सल्ला उपलब्ध नाही",
          explanation: "निवेश सुरक्षा हे केवळ गुंतवणूकदार सुरक्षा आणि घोटाळा तपासणी साधन आहे. सेबी (SEBI) नियमांनुसार, आम्ही स्टॉक टिप्स, शेअर्स खरेदी/विक्रीचे सल्ले किंवा बाजार अंदाज देत नाही.",
          guidance: "आपल्याला गुंतवणूक सल्ल्याची आवश्यकता असल्यास, कृपया केवळ सेबी-नोंदणीकृत गुंतवणूक सल्लागाराशी (RIA) संपर्क साधा. sebi.gov.in वर त्यांच्या प्रमाणपत्राची पडताळणी करा."
        }
      };

      const selectedLang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';
      return {
        isViolation: true,
        violationType: 'ADVICE_SEEKING',
        ...messages[selectedLang]
      };
    }
  }

  return { isViolation: false };
}
