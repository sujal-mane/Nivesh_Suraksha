# Solution Overview: "Nivesh Suraksha" (निवेश सुरक्षा)

## 1. Executive Summary
**Nivesh Suraksha** is an open, multilingual investor defense and grievance navigation platform designed specifically for first-time retail investors, non-English regional language users, and elderly citizens in Tier-2/Tier-3 India.

Developed for the **SANGYAN Hackathon (IIT BHU with SEBI & NSDL)**, it combines deterministic rule-based pattern matching with nuanced LLM reasoning to detect financial scams, verify advisor legitimacy, and draft actionable regulatory complaints.

```
                              [USER INPUT]
                      (Voice / Text in EN, HI, MR)
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │  Zero-Retention Privacy Gate  │
                   │  - In-Memory Processing Only │
                   │  - Auto PII / OTP Masking     │
                   └───────────────┬───────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │   SEBI Ethics Guardrails      │
                   │  - Reject stock tips / picks  │
                   │  - No commercial promotions   │
                   └───────────────┬───────────────┘
                                   │
                                   ▼
               ┌───────────────────────────────────────┐
               │    HYBRID DETECTION ENGINE            │
               │                                       │
               │  1. Deterministic Rule Engine         │
               │     (Regex in EN, HI, MR, Hinglish)   │
               │     -> Tags: [Rule Engine]            │
               │                                       │
               │  2. LLM / Local Nuance Layer          │
               │     (Gemini / Claude / Local Fallback)│
               │     -> Tags: [AI Nuance Analysis]     │
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │       ACTIONABLE OUTPUT       │
                   │  - Verdict & Confidence Bar   │
                   │  - Voice Audio Playback (TTS) │
                   │  - Behavioral Micro-Lesson    │
                   │  - Immediate Next Steps       │
                   │  - Grievance Draft Generator  │
                   └───────────────────────────────┘
```

## 2. Core Pillars of the Solution

### Pillar 1: Hybrid Scam Verification
- **Two-Tier Engine:**
  - **Tier 1 (Deterministic Rules):** High-speed regex and keyword heuristics targeting 8 established fraud categories (guaranteed profits, urgency, operator tips, Telegram/WhatsApp migrations, OTP requests, fake SEBI certificates, unrealistic screenshots, unregulated binary bots).
  - **Tier 2 (AI Nuance & Fallback):** Semantic analysis of subtle social engineering cues (support impersonation, FOMO manipulation) paired with automatic offline heuristic fallback.
- **Clear Attribution:** Every detected red flag displays whether it originated from the `[Rule Engine]` or `[AI Nuance Analysis]`.
- **Honest Uncertainty:** Never claims 100% certainty. Highlights an explicit *"I'm not sure"* state when evidence is insufficient.

### Pillar 2: SEBI Advisor Verification Guide
- Direct, unadulterated links to SEBI's official public registry of recognized intermediaries (`sebi.gov.in`).
- Educational breakdown of genuine registration numbers (`INA` for Investment Advisers, `INH` for Research Analysts).
- Exposes common impersonator tricks (using a real person's name with a personal Gmail or Telegram handle; demands for 50-50 profit cuts).

### Pillar 3: Plain-Language Grievance Navigator
- Translates conversational dispute descriptions ("my broker took money but didn't credit shares", "I was conned by a Telegram admin") into structured jurisdictional routing:
  - **Stock Broker Grievance Cell:** For trade discrepancies and demat payout delays.
  - **NSDL / CDSL Depository:** For demat transmission delays, pledge disputes, and DP service issues.
  - **SEBI SCORES 2.0 & SMART ODR:** For escalations against registered entities and arbitration.
  - **National Cybercrime Reporting Portal (1930 / cybercrime.gov.in):** For urgent criminal financial fraud.
- **Auto-Generated Complaint Drafts:** Automatically generates formal dispute letters in English, Hindi, or Marathi with clear bracketed placeholders ready for one-click copy and dispatch.

### Pillar 4: Accessibility & Voice-First Design
- **Multilingual Support:** Native interface in English, Hindi (हिन्दी), and Marathi (मराठी).
- **Web Speech API:** Speech-to-text recording allows elderly or low-literacy users to speak suspicious tips.
- **Text-to-Speech:** Verbal audio playback of verdicts and guidance in regional accents (`hi-IN`, `mr-IN`, `en-IN`).
- **High-Contrast & Font Scaler:** Instant accessibility switches designed for seniors and vision-impaired users.
