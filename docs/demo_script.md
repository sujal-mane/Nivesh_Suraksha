# Video Demonstration Script: Nivesh Suraksha (3 to 5 Minutes)
**Theme:** Detect ➔ Understand ➔ Act  
**Event:** SANGYAN Hackathon (IIT BHU with SEBI & NSDL)

---

## Act 1: The Context & Problem (0:00 - 0:45)
**Visual:** Open on the Nivesh Suraksha homepage. Switch language toggle between English, हिन्दी, and मराठी. Toggle High-Contrast mode.
**Speaker:**
> "Over 10 crore first-time retail investors have opened Demat accounts across India over the past few years, predominantly in Tier-2 and Tier-3 cities.
> Unfortunately, they are relentlessly targeted on WhatsApp and Telegram by fake advisors promising '100% guaranteed returns', fake SEBI certificates, and insider jackpot tips.
> When victims lose money, they face a bewildering maze of confusion—not knowing whether to contact their broker, NSDL, SEBI, or the police.
> Today, we present **Nivesh Suraksha** (निवेश सुरक्षा)—a multilingual investor scam checker and grievance navigator built for the SANGYAN Hackathon."

---

## Act 2: DETECT – Real-Time Scam Analysis & Guardrails (0:45 - 2:15)
**Visual:** 
1. Click the Hindi sample: *"पैसे दोगुना करने की गारंटी"* (scam-2) or demonstrate speaking into the microphone via the Web Speech API button.
2. Show the real-time client-side PII detector alerting the user if an OTP or phone number is entered.
3. Click **"संदेश की जांच करें" (Analyze for Scams)**.

**Speaker:**
> "Watch how Nivesh Suraksha handles a typical WhatsApp message promising 100% guaranteed double returns in 7 days.
> First, our privacy gate automatically detects and masks sensitive financial credentials like OTPs, PAN, and Aadhaar.
> Next, our hybrid engine goes to work:
> Look at the clear attribution tags:
> - Tagged with **[Rule Engine]**, our deterministic multilingual regex catches the illegal guaranteed return claim and artificial scarcity.
> - Tagged with **[AI Nuance Analysis]**, our reasoning model analyzes the psychological FOMO pressure.
> The composite verdict clearly flags: **'Likely scam'** with an honest confidence score of 91%—and an explicit reminder that no algorithm is infallible.
> And for elderly users or non-English readers, a single tap on the audio button plays back the verdict verbally in clear, spoken Hindi."
*(Click the audio speaker icon to let the voice playback speak for 3 seconds)*

---

## Act 3: UNDERSTAND – The Behavioral Micro-Lesson & Advisor Verification (2:15 - 3:30)
**Visual:** 
1. Scroll to the **"लघु पाठ: लोग इस झांसे में क्यों आते हैं?" (Micro-Lesson)** section.
2. Click the **"सेबी सलाहकार पड़ताल" (SEBI Advisor Verification)** tab.

**Speaker:**
> "Detecting fraud is not enough—investors must understand *why* they were vulnerable.
> Every scam check includes a behavioral micro-lesson explaining the cognitive trick used against the investor—in this case, 'The Certainty Illusion', and reminds them of our golden rule: *'In finance, if the return is guaranteed, the fraud is guaranteed.'*
> 
> Next, what if an advisor claims they are registered with SEBI?
> Under the **Advisor Verification Guide**, we show users the official prefix structure: `INA` for Investment Advisers and `INH` for Research Analysts.
> We expose the four classic impersonator tricks—such as asking for payment into personal UPI accounts or demanding 50-50 profit cuts.
> Crucially, we do not fake or scrape registry data: we provide a direct, one-click link out to SEBI's official recognized intermediaries database."

---

## Act 4: ACT – Plain-Language Grievance Navigator (3:30 - 4:30)
**Visual:** 
1. Switch to the **"शिकायत मार्गदर्शक" (Grievance Navigator)** tab.
2. Click the sample grievance: *"टेलीग्राम फर्जी सलाहकार धोखाधड़ी"* or *"Broker Non-Credit of Shares"*.
3. Click **"Find Applicable Forum & Draft Letter"**.

**Speaker:**
> "Now, what if the worst has already happened and the investor lost money?
> In plain words, the user types or speaks: *'I lost ₹50,000 on Telegram to an advisor who promised guaranteed profits and blocked me.'*
> Within seconds:
> 1. The system directs them to the **National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)** and reminds them of the critical 'Golden Hour' to freeze fraudulent bank transfers.
> 2. It generates an interactive checklist of mandatory documents (bank statements, chat screenshots, transaction UTRs).
> 3. And look here—it automatically generates a complete, formal legal complaint letter in their chosen language with clear placeholders, ready to copy and send to the authorities in one click."
*(Click the 'Copy Complaint Draft' button to show the green copied confirmation badge)*

---

## Act 5: Summary & Ethical Architecture (4:30 - 5:00)
**Visual:** Open the **"Privacy & Ethics"** modal.
**Speaker:**
> "Nivesh Suraksha is built with four uncompromising ethical principles:
> 1. Zero message retention—all processing is ephemeral and in-memory.
> 2. Zero unauthorized stock tips—if a user asks for stock recommendations, our SEBI guardrails immediately refuse and educate.
> 3. Zero commercial monetization or broker promotions.
> 4. Full offline fallback—ensuring the tool never fails even without cloud API access.
> 
> With Nivesh Suraksha, we empower every Indian investor with the knowledge to invest safely. Thank you."
