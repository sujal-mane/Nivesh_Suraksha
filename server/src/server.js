/**
 * Server Bootstrap
 */

import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  Nivesh Suraksha (निवेश सुरक्षा) Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🧠 LLM Provider: ${config.llmProvider.toUpperCase()}`);
  console.log(`🚀 Ready for SANGYAN Hackathon Demonstration`);
  console.log(`=======================================================`);
});
