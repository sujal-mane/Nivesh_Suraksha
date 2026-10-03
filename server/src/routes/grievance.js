/**
 * Route: POST /api/grievance
 * Grievance classification, escalation path, and localized complaint draft generation
 */

import express from 'express';
import { resolveGrievance } from '../services/grievanceEngine.js';
import { detectAndMaskPii } from '../services/piiMasker.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { problemDescription, language = 'en' } = req.body;

    if (!problemDescription || problemDescription.trim().length === 0) {
      return res.status(400).json({ error: 'Problem description is required.' });
    }

    // Protect sensitive data in grievance input
    const piiCheck = detectAndMaskPii(problemDescription);

    const grievanceResult = resolveGrievance(problemDescription, language);

    return res.json({
      pii: {
        detected: piiCheck.hasPii,
        types: piiCheck.detectedTypes,
        warnings: piiCheck.warnings
      },
      ...grievanceResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error during grievance resolution:', error);
    return res.status(500).json({
      error: 'Failed to process grievance dispute.',
      details: error.message
    });
  }
});

export default router;
