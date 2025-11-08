import { Router } from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { generateRoster } from '../services/rosterService.js';
const router = Router();
router.get('/', async (req,res)=> res.json(await readJson('roster')));
router.post('/generate', async (req,res)=>{ const { startDate } = req.body||{}; const startDateStr = startDate || new Date().toISOString().slice(0,10); const roster = await generateRoster({ startDateStr }); res.json(roster); });
router.post('/clear', async (req,res)=>{ await writeJson('roster', {}); res.json({ok:true}); });
export default router;
