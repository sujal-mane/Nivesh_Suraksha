/**
 * Express Application Setup
 */

import express from 'express';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput } from './middleware/sanitize.js';
import analyzeRouter from './routes/analyze.js';
import grievanceRouter from './routes/grievance.js';
import samplesRouter from './routes/samples.js';

const app = express();

// Security and CORS configuration
app.use(cors({
  origin: '*', // Permissive for local dev & demo
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size limit to prevent memory exhaustion
app.use(express.json({ limit: '100kb' }));

// Global Rate Limiter
app.use('/api', rateLimiter);

// Global Input Sanitizer
app.use('/api', sanitizeInput);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Nivesh Suraksha API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Primary API Endpoints
app.use('/api/analyze', analyzeRouter);
app.use('/api/grievance', grievanceRouter);
app.use('/api/samples', samplesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

export default app;
