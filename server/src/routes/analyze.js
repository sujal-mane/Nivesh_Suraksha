/**
 * Route: POST /api/analyze
 * Hybrid Scam Detection Pipeline: Guardrails -> PII Masking -> Deterministic Rules -> LLM Nuance Layer
 */

import express from 'express';
import { checkGuardrails } from '../services/guardrailFilter.js';
import { detectAndMaskPii } from '../services/piiMasker.js';
import { runRuleEngine } from '../services/ruleEngine.js';
import { analyzeWithLLM } from '../services/llmService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text input is required' });
    }

    // Step 1: Enforce Ethical & Regulatory Guardrails (SEBI Compliance)
    const guardrailCheck = checkGuardrails(text, language);
    if (guardrailCheck.isViolation) {
      return res.json({
        guardrailTriggered: true,
        violationType: guardrailCheck.violationType,
        title: guardrailCheck.title,
        explanation: guardrailCheck.explanation,
        guidance: guardrailCheck.guidance,
        verdict: "Guardrail Refusal",
        confidence: 100,
        flags: [],
        ruleFlags: [],
        aiFlags: [],
        microLesson: null,
        actionSteps: []
      });
    }

    // Step 2: Sensitive Data / PII Detection & Zero-Leakage Masking
    const piiResult = detectAndMaskPii(text);
    const textForAnalysis = piiResult.sanitizedText;

    // Step 3: Deterministic Multilingual Rule Engine (Regex & Keywords)
    const ruleResult = runRuleEngine(textForAnalysis, language);

    // Step 4: LLM / Local Reasoning Nuance Layer
    const llmResult = await analyzeWithLLM(textForAnalysis, ruleResult, language);

    // Step 5: Merge and Synthesize Hybrid Findings
    const ruleFlags = ruleResult.flags.map(f => ({ ...f, source: 'rule' }));
    const aiFlags = (llmResult.aiFlags || []).map(f => ({ ...f, source: 'ai' }));
    const combinedFlags = [...ruleFlags, ...aiFlags];

    // Compute composite verdict and confidence
    let finalVerdict = ruleResult.verdict;
    let finalConfidence = ruleResult.confidence;
    let isUncertain = ruleResult.isUncertain;

    // If AI found additional high-severity flags, raise severity
    if (aiFlags.some(f => f.severity === 'CRITICAL' || f.severity === 'HIGH') && finalVerdict === 'Suspicious') {
      finalVerdict = 'Likely scam';
      finalConfidence = Math.min(95, finalConfidence + 15);
    }

    // Explicit "I'm not sure" state if confidence is low or input is vague
    if (combinedFlags.length === 0 && text.trim().split(/\s+/).length < 5) {
      finalVerdict = "I'm not sure";
      finalConfidence = 30;
      isUncertain = true;
    }

    // Assemble final response payload
    const responsePayload = {
      guardrailTriggered: false,
      verdict: finalVerdict,
      confidence: finalConfidence,
      isUncertain,
      pii: {
        detected: piiResult.hasPii,
        types: piiResult.detectedTypes,
        warnings: piiResult.warnings,
        maskedPreview: piiResult.sanitizedText
      },
      flags: combinedFlags,
      ruleFlags,
      aiFlags,
      plainExplanation: llmResult.plainExplanation,
      microLesson: llmResult.microLesson,
      actionSteps: llmResult.actionSteps || [],
      disclaimer: llmResult.disclaimer,
      timestamp: new Date().toISOString()
    };

    return res.json(responsePayload);
  } catch (error) {
    console.error('Error during scam analysis:', error);
    return res.status(500).json({
      error: 'An internal error occurred during analysis. Please try again.',
      details: error.message
    });
  }
});

export default router;
