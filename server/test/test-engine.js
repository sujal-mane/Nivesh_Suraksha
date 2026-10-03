/**
 * Automated Test Suite for Nivesh Suraksha
 * Tests Rule Engine, PII Masking, Guardrails, and Grievance Routing.
 */

import { detectAndMaskPii } from '../src/services/piiMasker.js';
import { checkGuardrails } from '../src/services/guardrailFilter.js';
import { runRuleEngine } from '../src/services/ruleEngine.js';
import { resolveGrievance } from '../src/services/grievanceEngine.js';
import { SAMPLE_SCAMS, SAMPLE_GRIEVANCES } from '../src/data/sampleData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing PII Masking & Sensitive Data Protection ---');
const piiSample = "My Aadhaar is 5482 1234 5678, my PAN is ABCDE1234F, my phone is 9876543210 and OTP is 482910";
const piiResult = detectAndMaskPii(piiSample);
assert(piiResult.hasPii === true, 'Detected PII correctly');
assert(piiResult.sanitizedText.includes('[REDACTED_AADHAAR]'), 'Masked Aadhaar');
assert(piiResult.sanitizedText.includes('[REDACTED_PAN]'), 'Masked PAN');
assert(piiResult.sanitizedText.includes('[REDACTED_PHONE]'), 'Masked Phone');
assert(piiResult.sanitizedText.includes('[REDACTED_OTP]'), 'Masked OTP');
assert(!piiResult.sanitizedText.includes('5482 1234 5678'), 'Original Aadhaar removed');

console.log('\n--- 2. Testing Regulatory Guardrails (SEBI Compliance) ---');
const tipRequest = "Which stock should I buy tomorrow to double my money?";
const guardrail1 = checkGuardrails(tipRequest, 'en');
assert(guardrail1.isViolation === true, 'Refused stock tip recommendation request');
assert(guardrail1.title.includes('Guardrail'), 'Returned regulatory explanation');

const hindiTipRequest = "कल कौन सा शेयर खरीदूं निफ्टी टारगेट बताओ";
const guardrail2 = checkGuardrails(hindiTipRequest, 'hi');
assert(guardrail2.isViolation === true, 'Refused Hindi stock tip recommendation request');

const benignScamCheck = "Is this message a scam: guaranteed 50% return in 1 day?";
const guardrail3 = checkGuardrails(benignScamCheck, 'en');
assert(guardrail3.isViolation === false, 'Allowed legitimate scam checking query');

console.log('\n--- 3. Testing Multilingual Rule Engine on 10 Seed Samples ---');
for (const sample of SAMPLE_SCAMS) {
  const result = runRuleEngine(sample.text, sample.language);
  if (sample.id === 'scam-10') {
    // Benign sample
    assert(result.verdict === 'No clear red flags found', `Sample ${sample.id} (${sample.label}) correctly recognized as clean`);
  } else {
    assert(result.verdict === 'Likely scam' || result.verdict === 'Suspicious',
      `Sample ${sample.id} (${sample.label}) triggered verdict "${result.verdict}" with ${result.flags.length} flags`);
  }
}

console.log('\n--- 4. Testing Grievance Navigator & Complaint Drafting ---');
for (const g of SAMPLE_GRIEVANCES) {
  const res = resolveGrievance(g.text, g.language);
  assert(res.forum && res.forum.id, `Grievance ${g.id} matched forum: ${res.forum.name}`);
  assert(res.requiredDocuments && res.requiredDocuments.length > 0, `Documents checklist generated for ${g.id}`);
  assert(res.complaintDraft && res.complaintDraft.letterBody.length > 50, `Complaint draft letter generated for ${g.id}`);
}

console.log(`\n========================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
