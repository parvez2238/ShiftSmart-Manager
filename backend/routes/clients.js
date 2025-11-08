import { Router } from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req,res)=>{ const clients = await readJson('clients'); clients.sort((a,b)=>(b.ticketCount||0)-(a.ticketCount||0)); res.json(clients); });
router.post('/', async (req,res)=>{ const clients = await readJson('clients'); const b=req.body||{}; const newC = { id: uuid(), name: b.name||'Client', ticketCount: b.ticketCount||0, notes: b.notes||'' }; clients.push(newC); await writeJson('clients', clients); res.status(201).json(newC); });
router.put('/:id', async (req,res)=>{ const {id}=req.params; const clients=await readJson('clients'); const idx=clients.findIndex(c=>c.id===id); if(idx===-1) return res.status(404).json({error:'Not found'}); clients[idx] = {...clients[idx], ...req.body, id}; await writeJson('clients', clients); res.json(clients[idx]); });
router.delete('/:id', async (req,res)=>{ const {id}=req.params; let clients=await readJson('clients'); clients = clients.filter(c=>c.id!==id); await writeJson('clients', clients); res.json({ok:true}); });
export default router;
