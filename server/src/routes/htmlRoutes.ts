import express, { type Request, type Response } from 'express';
import path from 'node:path'; // node path for handling file paths
import { fileURLToPath } from 'node:url'; // file to path converts URL to a file path
import { Router } from 'express'; // import router with routes

const __filename = fileURLToPath(import.meta.url); // gives the url of the current module
const __dirname = path.dirname(__filename); // gets directory name of current module file
const router = Router(); // inilitalize router with routes

// Define route to serve index.html
router.use(express.static(path.join(__dirname, '../../../client/dist/index.html')));

//route to serve index.html for the root path
router.get('/', (_req: Request, res: Response) => {
    console.log('GET request received at root path.');
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});
  
export default router; // export new routes for use on router