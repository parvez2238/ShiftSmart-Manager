import { Router } from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req,res)=> res.json(await readJson('leaves')));
router.post('/', async (req,res)=>{ const leaves = await readJson('leaves'); const b=req.body||{}; const newL={ id: uuid(), employeeId: b.employeeId, date: b.date, reason: b.reason||'' }; leaves.push(newL); await writeJson('leaves', leaves); res.status(201).json(newL); });
router.delete('/:id', async (req,res)=>{ const {id}=req.params; let leaves = await readJson('leaves'); leaves = leaves.filter(l=>l.id!==id); await writeJson('leaves', leaves); res.json({ok:true}); });
export default router;
