import { Router } from 'express';
import { readJson, writeJson } from '../utils/db.js';
const router = Router();
// simple storage for manager thoughts (single object)
router.get('/thoughts', async (req,res)=> { const s = await readJson('manager'); res.json(s || {}); });
router.post('/thoughts', async (req,res)=> { const b = req.body || {}; const prev = await readJson('manager') || {}; const merged = {...prev, ...b}; await writeJson('manager', merged); res.json(merged); });
export default router;
