/**
 * Grievance Matcher & Complaint Draft Generator
 * Matches plain-language investor disputes to verified official forums (SEBI, NSDL, Cybercrime 1930, SMART ODR)
 * and generates ready-to-copy complaint letters in English, Hindi, and Marathi.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load verified knowledge base
const knowledgePath = path.join(__dirname, '../data/grievance_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));

export function resolveGrievance(problemDescription, language = 'en') {
  const selectedLang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';
  const text = (problemDescription || '').toLowerCase();

  let matchedForum = null;
  let highestScore = -1;

  // Scoring algorithm based on keywords and issue matches
  for (const forum of knowledgeData.forums) {
    let score = 0;

    // Check specific applicable issues
    for (const issue of forum.applicableIssues) {
      const issueWords = issue.toLowerCase().split(/\s+/);
      const matchCount = issueWords.filter(word => word.length > 3 && text.includes(word)).length;
      if (matchCount >= 2) {
        score += 15;
      }
    }

    // Broad category keywords with multilingual support
    if (forum.id === 'cybercrime_portal') {
      if (/(?:telegram|whatsapp|टेलीग्राम|टेलिग्राम|व्हाट्सएप|fake\s*advisor|सलाहकार|stolen|scam|fraud|phishing|upi|यूपीआई|cheated|dhokhadhadi|धोखा|धोखाधड़ी|loot|पैसे\s*डूबे|पैसे\s*भेजे|फंस\s*गए|फसवणूक|ब्लॉक|block)/i.test(text)) {
        score += 45;
      }
    } else if (forum.id === 'broker_grievance') {
      if (/(?:broker|zerodha|groww|angel|upstox|unauthorized\s*trade|share\s*not\s*credited|demat\s*credit|payout|charges|ब्रोकर|शेयर\s*नहीं\s*मिले|शेअर्स)/i.test(text)) {
        score += 25;
      }
    } else if (forum.id === 'depository_nsdl_cdsl') {
      if (/(?:nsdl|cdsl|depository|dp|holding|transmission|हस्तांतरित|deceased|निधन|demat\s*transfer|डीमैट|डिपॉजिटरी|डिमॅट)/i.test(text)) {
        score += 35;
      }
    } else if (forum.id === 'sebi_scores') {
      if (/(?:mutual\s*fund|listed\s*company|dividend|unresolved|scores|ria|pms|sebi\s*complaint|सेबी)/i.test(text)) {
        score += 20;
      }
    } else if (forum.id === 'smart_odr') {
      if (/(?:arbitration|conciliation|odr|dispute\s*above\s*30\s*days|लवाद)/i.test(text)) {
        score += 20;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      matchedForum = forum;
    }
  }

  // Fallback default: if unresolved or broker related, route to Broker Grievance or Cybercrime based on fraud indicators
  if (!matchedForum || highestScore <= 5) {
    if (/(?:stolen|scam|fake|lost\s*money|चोरी|धोखा|फसवणूक|टेलीग्राम|यूपीआई)/i.test(text)) {
      matchedForum = knowledgeData.forums.find(f => f.id === 'cybercrime_portal');
    } else {
      matchedForum = knowledgeData.forums.find(f => f.id === 'broker_grievance');
    }
  }

  // Generate localized complaint draft
  const complaintDraft = generateComplaintDraft(matchedForum, problemDescription, selectedLang);

  return {
    forum: {
      id: matchedForum.id,
      name: matchedForum.name,
      shortName: matchedForum.shortName,
      officialWebsite: matchedForum.officialWebsite,
      source: matchedForum.source,
      timelineDays: matchedForum.timelineDays,
      description: matchedForum.description[selectedLang] || matchedForum.description.en
    },
    requiredDocuments: matchedForum.requiredDocuments,
    escalationSteps: matchedForum.escalationSteps,
    complaintDraft,
    helplines: knowledgeData.contactHelplines
  };
}

function generateComplaintDraft(forum, userDescription, lang) {
  const dateStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN'), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sanitizedDescription = userDescription.trim().replace(/\n+/g, ' ');

  if (lang === 'hi') {
    return {
      subject: `शिकायत: [संस्था/ब्रोकर का नाम] के खिलाफ औपचारिक विवाद निवारण का अनुरोध`,
      recipient: `${forum.name} (शिकायत निवारण प्रकोष्ठ)`,
      letterBody: `दिनांक: ${dateStr}

सेवा में,
शिकायत निवारण अधिकारी,
${forum.name},
आधिकारिक पोर्टल: ${forum.officialWebsite}

विषय: [संस्था/ब्रोकर का नाम] के खिलाफ औपचारिक शिकायत

महोदय/महोदया,

मैं यह पत्र अपनी निवेश संबंधी शिकायत दर्ज कराने और न्यायसंगत समाधान पाने के लिए लिख रहा हूँ। मेरे साथ घटी घटना का विवरण नीचे दिया गया है:

१. शिकायतकर्ता का विवरण:
   - पूरा नाम: [आपका पूरा नाम]
   - मोबाइल नंबर: [आपका पंजीकृत मोबाइल नंबर]
   - ईमेल: [आपका ईमेल]
   - क्लाइंट आईडी / डीमैट खाता संख्या (यदि लागू हो): [क्लाइंट आईडी]

२. विवादित घटना का विवरण:
   - घटना की तिथि / समयावधि: [घटना की तिथि दर्ज करें]
   - विवादित लेनदेन / संदर्भ आईडी: [ट्रांजैक्शन / ऑर्डर आईडी]
   - समस्या का संक्षिप्त विवरण:
   "${sanitizedDescription}"

३. अपेक्षित समाधान:
   कृपया मामले की निष्पक्ष जांच करें और [शेयरों का तत्काल क्रेडिट / गलत काटे गए शुल्क की वापसी / धोखाधड़ी वाले लेनदेन पर कार्रवाई] सुनिश्चित करें।

संलग्न दस्तावेज:
- बैंक पासबुक / खाते का विवरण (संबंधित लेनदेन चिह्नित)
- कॉन्ट्रैक्ट नोट / डीमैट खाता विवरण (यदि लागू हो)
- संचार के स्क्रीनशॉट और शिकायत टिकट का विवरण

धन्यवाद,

भवदीय,
[आपका नाम]
[हस्ताक्षर]`
    };
  }

  if (lang === 'mr') {
    return {
      subject: `तक्रार: [संस्था/ब्रोकरचे नाव] विरोधात अधिकृत दाद मागणेबाबत`,
      recipient: `${forum.name} (तक्रार निवारण कक्ष)`,
      letterBody: `दिनांक: ${dateStr}

प्रति,
तक्रार निवारण अधिकारी,
${forum.name},
अधिकृत पोर्टल: ${forum.officialWebsite}

विषय: [संस्था/ब्रोकरचे नाव] विरोधात अधिकृत तक्रार नोंदवणेबाबत

महोदय/महोदया,

मी माझ्या गुंतवणुकीशी संबंधित तक्रारीचे निवारण करण्यासाठी हे पत्र सादर करत आहे. माझ्या बाबतीत घडलेल्या समस्येचा तपशील खालीलप्रमाणे आहे:

१. तक्रारदाराचा तपशील:
   - पूर्ण नाव: [तुमचे पूर्ण नाव]
   - मोबाईल क्रमांक: [नोंदणीकृत मोबाईल नंबर]
   - ईमेल: [तुमचा ईमेल पत्ता]
   - क्लायंट कोड / डीमॅट खाते क्रमांक: [डीमॅट / क्लायंट आयडी]

२. वादाचा सविस्तर तपशील:
   - घटनेची तारीख: [घटनेची तारीख टाका]
   - व्यवहार / संदर्भ आयडी: [व्यवहार / ऑर्डर आयडी]
   - समस्येचे संक्षिप्त वर्णन:
   "${sanitizedDescription}"

३. अपेक्षित कारवाई:
   कृपया या प्रकरणाची त्वरित दखल घेऊन [शेअर्सचे तातडीने हस्तांतरण / बेकायदेशीरपणे कापलेल्या रकमेचा परतावा / योग्य ती कायदेशीर कारवाई] करावी ही विनंती.

सोबत जोडलेली कागदपत्रे:
- बँक खात्याचा उतारा (संबंधित व्यवहारांसह)
- करार पत्र (Contract Note) / डीमॅट स्टेटमेंट
- संभाषणाचे स्क्रीनशॉट्स व ईमेल प्रती

आपला नम्र,

[तुमचे नाव]
[स्वाक्षरी]`
    };
  }

  // Default: English
  return {
    subject: `Grievance Notice: Formal Complaint Against [Entity/Broker Name] Regarding Securities Dispute`,
    recipient: `${forum.name} (Investor Grievance Cell)`,
    letterBody: `Date: ${dateStr}

To,
The Designated Grievance Officer,
${forum.name},
Official Portal: ${forum.officialWebsite}

Subject: Formal Grievance Registration Regarding Securities Dispute

Dear Sir/Madam,

I am writing to register a formal dispute and seek immediate resolution regarding an issue encountered with [Broker/Intermediary/Entity Name]. Below are the particulars of the grievance:

1. Complainant Particulars:
   - Full Legal Name: [Your Full Name]
   - Registered Mobile Number: [Your Contact Number]
   - Registered Email Address: [Your Email Address]
   - Client UCC / Demat Account No. (if applicable): [Your Client Code / DP ID]

2. Dispute Details:
   - Date of Incident / Transaction: [Date]
   - Disputed Transaction / Order / UTR ID: [Transaction Reference]
   - Statement of Facts:
   "${sanitizedDescription}"

3. Redressal Sought:
   I request your urgent intervention to investigate this matter and provide [immediate credit of pending shares / refund of unauthorized deductions / disciplinary action on fraudulent transactions].

Enclosed Documents Checklist:
- Bank statement / proof of payment highlighting the disputed amount
- Contract notes / Demat holding statement (CMR)
- Complete screenshot audit trail of correspondence and complaint tickets

Sincerely,

[Your Name]
[Signature]`
  };
}
