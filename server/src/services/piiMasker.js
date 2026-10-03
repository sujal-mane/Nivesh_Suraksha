/**
 * Sensitive Data (PII / Financial Credentials) Masker
 * Detects sensitive financial & identity tokens, masks them with safe placeholders,
 * and alerts the system to warn the user.
 */

export function detectAndMaskPii(inputText) {
  if (!inputText || typeof inputText !== 'string') {
    return {
      sanitizedText: '',
      detectedTypes: [],
      hasPii: false,
      warnings: []
    };
  }

  let text = inputText;
  const detectedTypes = new Set();
  const warnings = [];

  // 1. Aadhaar Card Pattern (12 digits, optional space or dash)
  const aadhaarRegex = /\b[2-9]{1}[0-9]{3}[ -]?[0-9]{4}[ -]?[0-9]{4}\b/g;
  if (aadhaarRegex.test(text)) {
    detectedTypes.add('Aadhaar Number');
    warnings.push('Aadhaar number detected and masked. Never share your Aadhaar with unknown parties.');
    text = text.replace(aadhaarRegex, '[REDACTED_AADHAAR]');
  }

  // 2. PAN Card Pattern (5 uppercase letters, 4 digits, 1 uppercase letter)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/gi;
  if (panRegex.test(text)) {
    detectedTypes.add('PAN Card');
    warnings.push('PAN number detected and masked. Protect your permanent account number.');
    text = text.replace(panRegex, '[REDACTED_PAN]');
  }

  // 3. Indian Phone Numbers (10 digits starting with 6, 7, 8, 9 with optional +91)
  const phoneRegex = /(?:\+?91[\s-]?)?[6789]\d{9}\b/g;
  if (phoneRegex.test(text)) {
    detectedTypes.add('Mobile Number');
    warnings.push('Phone number detected and masked.');
    text = text.replace(phoneRegex, '[REDACTED_PHONE]');
  }

  // 4. OTP / Verification Codes (4-6 digits near keywords like OTP, code, pin, etc.)
  const otpKeywordRegex = /(?:otp|one\s*time\s*password|verification\s*code|ओटीपी|पासवर्ड)(?:\s+(?:is|hai|hota\s*hai|was|:|=|-))?\s*[:=]?\s*([0-9]{4,6})\b/gi;
  if (otpKeywordRegex.test(text)) {
    detectedTypes.add('OTP / Secret Code');
    warnings.push('CRITICAL: OTP detected. SEBI, banks, and genuine advisors NEVER ask for OTP!');
    text = text.replace(otpKeywordRegex, (match, p1) => match.replace(p1, '[REDACTED_OTP]'));
  }

  // 5. UPI PIN / MPIN (4-6 digits near pin keywords)
  const upiPinRegex = /(?:upi\s*pin|mpin|secret\s*pin|atm\s*pin|पिन)(?:\s+(?:is|hai|was|:|=|-))?\s*[:=]?\s*([0-9]{4,6})\b/gi;
  if (upiPinRegex.test(text)) {
    detectedTypes.add('UPI/ATM PIN');
    warnings.push('CRITICAL: UPI/ATM PIN detected. Never share your PIN with anyone under any circumstances.');
    text = text.replace(upiPinRegex, (match, p1) => match.replace(p1, '[REDACTED_PIN]'));
  }

  // 6. Credit / Debit Card Numbers (16 digits)
  const cardRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13})\b/g;
  if (cardRegex.test(text)) {
    detectedTypes.add('Credit/Debit Card');
    warnings.push('Card number detected and masked. Do not enter financial card details.');
    text = text.replace(cardRegex, '[REDACTED_CARD]');
  }

  // 7. Bank Account Numbers (9 to 18 digits near account keywords)
  const bankAccRegex = /(?:a\/c|account\s*(?:no|number)?|khata|खाता)[\s:=]*([0-9]{9,18})\b/gi;
  if (bankAccRegex.test(text)) {
    detectedTypes.add('Bank Account Number');
    warnings.push('Bank account number detected and masked.');
    text = text.replace(bankAccRegex, (match, p1) => match.replace(p1, '[REDACTED_ACCOUNT]'));
  }

  return {
    sanitizedText: text,
    detectedTypes: Array.from(detectedTypes),
    hasPii: detectedTypes.size > 0,
    warnings
  };
}
