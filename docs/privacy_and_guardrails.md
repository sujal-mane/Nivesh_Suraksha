# Privacy-by-Design & Regulatory Guardrails Compliance

## 1. Regulatory Context (SEBI Compliance Framework)
In accordance with SEBI (Investment Advisers) Regulations, 2013 and SEBI (Research Analysts) Regulations, 2014, **Nivesh Suraksha** is strictly programmed as an informational investor defense utility. It enforces hard technical barriers against offering unauthorized financial advice.

### The Five Mandatory Technical Guardrails

#### Guardrail 1: Refusal of Stock Tips & Recommendations
- **Enforcement:** `src/services/guardrailFilter.js` parses incoming queries using multilingual regex patterns for advice-seeking phrases (e.g. "Which stock should I buy?", "निफ्टी टारगेट बताओ", "कोणता शेअर खरेदी करू").
- **Behavior:** The system intercepts the request before passing it to any analysis engine, returning a formal regulatory refusal banner explaining that SEBI prohibits unauthorized advice and directing the user to official RIA databases.

#### Guardrail 2: Non-Promotional & Zero-Monetization Mandate
- The system contains zero affiliate links, zero broker integrations, and zero sponsored placements.
- All links direct strictly to sovereign or statutory regulatory domains (`.gov.in`, `sebi.gov.in`, `nsdl.co.in`, `smartodr.in`).

#### Guardrail 3: Zero Persistence of User Data (Privacy-by-Design)
- **No Database:** The application operates without any persistent storage database (no MongoDB, SQL, or disk logging of user messages).
- **In-Memory Volatility:** All text inputs and transcripts exist only in RAM during the lifetime of the HTTP request and are discarded immediately upon response completion.
- **No Tracking:** No tracking pixels, Google Analytics, or third-party advertising cookies are embedded.

#### Guardrail 4: Active PII Detection & Zero-Leakage Masking
- First-time investors frequently paste raw SMS messages containing sensitive financial credentials.
- `src/services/piiMasker.js` executes prior to any rule or LLM processing:
  - **Aadhaar Numbers:** 12-digit tokens masked to `[REDACTED_AADHAAR]`.
  - **PAN Cards:** 10-character alphanumeric tokens masked to `[REDACTED_PAN]`.
  - **Phone Numbers:** 10-digit mobile numbers masked to `[REDACTED_PHONE]`.
  - **OTPs & PINs:** 4-6 digit numeric sequences near credentials keywords masked to `[REDACTED_OTP]` and `[REDACTED_PIN]`.
  - **Credit/Debit Cards:** 16-digit card sequences masked to `[REDACTED_CARD]`.
- The user is alerted with an immediate visual warning advising them never to disclose secret credentials.

#### Guardrail 5: Transparent Communication of Uncertainty
- The system never outputs a binary claim of "100% Guaranteed Safe" or "100% Guaranteed Scam".
- Every assessment includes an explicit confidence meter and a disclaimer reminding users to perform independent verification on official regulatory portals.
- A dedicated *"I'm not sure"* state triggers when inputs lack adequate contextual indicators.
