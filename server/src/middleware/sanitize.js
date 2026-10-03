/**
 * Input Sanitization and Length Limiter Middleware
 */

export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    const textKey = req.body.text !== undefined ? 'text' : (req.body.problemDescription !== undefined ? 'problemDescription' : null);

    if (textKey !== null) {
      let val = req.body[textKey];

      if (typeof val !== 'string') {
        return res.status(400).json({ error: 'Input must be a valid text string.' });
      }

      val = val.trim();

      if (val.length === 0) {
        return res.status(400).json({ error: 'Input text cannot be empty.' });
      }

      if (val.length > 3000) {
        return res.status(400).json({ error: 'Input text exceeds maximum allowed length of 3000 characters.' });
      }

      // Basic HTML tag stripping
      req.body[textKey] = val.replace(/<[^>]*>?/gm, '');
    }

    // Sanitize language
    if (req.body.language) {
      const allowedLanguages = ['en', 'hi', 'mr'];
      if (!allowedLanguages.includes(req.body.language)) {
        req.body.language = 'en';
      }
    }
  }

  next();
}
