/**
 * Client-Side Instant Sensitive Data (PII) Warning Detector
 * Warns the user on typing if an OTP, PIN, Phone, Aadhaar, or PAN is typed.
 */

export function checkClientPii(text) {
  if (!text || typeof text !== 'string') {
    return { hasPii: false, detected: [] };
  }

  const detected = [];

  // Aadhaar
  if (/\b[2-9]{1}[0-9]{3}[ -]?[0-9]{4}[ -]?[0-9]{4}\b/.test(text)) {
    detected.push('Aadhaar Number');
  }

  // PAN
  if (/\b[A-Z]{5}[0-9]{4}[A-Z]\b/i.test(text)) {
    detected.push('PAN Number');
  }

  // Phone
  if (/(?:\+?91[\s-]?)?[6789]\d{9}\b/.test(text)) {
    detected.push('Mobile Number');
  }

  // OTP
  if (/(?:otp|one\s*time\s*password|ओटीपी|पासवर्ड)(?:\s+(?:is|hai|was|:|=|-))?\s*[:=]?\s*[0-9]{4,6}\b/i.test(text)) {
    detected.push('OTP / Secret Code');
  }

  // UPI PIN
  if (/(?:upi\s*pin|mpin|secret\s*pin|पिन)(?:\s+(?:is|hai|was|:|=|-))?\s*[:=]?\s*[0-9]{4,6}\b/i.test(text)) {
    detected.push('UPI/ATM PIN');
  }

  return {
    hasPii: detected.length > 0,
    detected
  };
}
