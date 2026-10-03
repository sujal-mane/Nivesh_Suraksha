/**
 * LLM Service Nuance Layer
 * Interacts with external LLM providers (Gemini, Claude, OpenAI) with strict JSON output schema.
 * Automatically falls back to localReasoner if no API key is provided or if network fails.
 */

import { analyzeLocally } from './localReasoner.js';

const SYSTEM_GUARDRAIL_PROMPT = `You are Nivesh Suraksha, an objective investor protection and scam analysis engine developed for the SANGYAN Hackathon (organized by IIT BHU with SEBI and NSDL).

CRITICAL ETHICAL & REGULATORY GUARDRAILS (ZERO TOLERANCE):
1. NEVER give stock tips, buy/sell/hold recommendations, price targets, or financial outcome predictions.
2. NEVER endorse, promote, or link to any commercial broker, financial product, scheme, or advisor.
3. NEVER ask for or store passwords, OTPs, PINs, bank accounts, Aadhaar, or PAN.
4. COMMUNICATE UNCERTAINTY: Never claim 100% certainty that something is or is not a scam. Use transparent confidence ranges.
5. If the user input is seeking investment advice or stock tips, immediately refuse and redirect to SEBI-registered professionals.

YOUR TASK:
Analyze the provided suspicious message. The rule engine has already detected deterministic red flags.
Provide additional nuanced contextual flags, a simple explanation, a psychological micro-lesson on why this tricked people, and next steps in the requested language (en, hi, or mr).

OUTPUT FORMAT: Strict JSON only. No markdown formatting, no code fences.
{
  "aiFlags": [
    {
      "id": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "source": "ai",
      "title": "Short title in requested language",
      "explanation": "Clear 1-2 sentence explanation in requested language"
    }
  ],
  "plainExplanation": "Clear 2-3 sentence overall assessment in requested language",
  "microLesson": {
    "title": "Title of psychological breakdown",
    "content": "Why this trick bypassed human logic",
    "takeaway": "One-line memorable golden rule"
  },
  "actionSteps": [
    { "title": "Step title", "desc": "Step description" }
  ],
  "confidenceAssessment": "Brief note explaining the confidence calculation and uncertainty",
  "disclaimer": "Standard disclaimer"
}`;

export async function analyzeWithLLM(text, ruleResult, language = 'en') {
  const provider = process.env.LLM_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : (process.env.ANTHROPIC_API_KEY ? 'claude' : 'local'));

  // If no external key or explicitly configured to local, use high-fidelity local reasoner
  if (provider === 'local' || (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY)) {
    return analyzeLocally(text, ruleResult, language);
  }

  try {
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      return await callGeminiAPI(text, ruleResult, language);
    } else if (provider === 'claude' && process.env.ANTHROPIC_API_KEY) {
      return await callClaudeAPI(text, ruleResult, language);
    } else if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      return await callOpenAIAPI(text, ruleResult, language);
    }
  } catch (error) {
    console.warn(`[LLM Service] External provider ${provider} call failed (${error.message}). Falling back to Local Reasoner.`);
    return analyzeLocally(text, ruleResult, language);
  }

  return analyzeLocally(text, ruleResult, language);
}

async function callGeminiAPI(text, ruleResult, language) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const userPrompt = `Language requested: ${language}
Rule engine flags found: ${JSON.stringify(ruleResult.flags.map(f => f.title))}
Rule engine verdict: ${ruleResult.verdict}

Suspicious Message to analyze:
"""
${text}
"""

Analyze and output strict JSON complying with the system prompt schema.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_GUARDRAIL_PROMPT },
            { text: userPrompt }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(rawText);
}

async function callClaudeAPI(text, ruleResult, language) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const endpoint = 'https://api.anthropic.com/v1/messages';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: SYSTEM_GUARDRAIL_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Language: ${language}. Rule engine flags: ${JSON.stringify(ruleResult.flags.map(f => f.title))}. Message: "${text}". Output strict JSON only.`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || '{}';
  return JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
}

async function callOpenAIAPI(text, ruleResult, language) {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_GUARDRAIL_PROMPT },
        { role: 'user', content: `Language: ${language}. Rule flags: ${JSON.stringify(ruleResult.flags.map(f => f.title))}. Message: "${text}". Output JSON.` }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}
