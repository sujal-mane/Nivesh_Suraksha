/**
 * Route: GET /api/samples
 * Provides realistic demo scam messages and grievance scenarios
 */

import express from 'express';
import { SAMPLE_SCAMS, SAMPLE_GRIEVANCES } from '../data/sampleData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    scams: SAMPLE_SCAMS,
    grievances: SAMPLE_GRIEVANCES
  });
});

export default router;
