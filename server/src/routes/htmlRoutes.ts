import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import apiRoutes from './api/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

console.log(__dirname);

// TODO: Define route to serve index.html
router.use('/api', apiRoutes);
export default router;
