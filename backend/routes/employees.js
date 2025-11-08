import { Router } from 'express';
import { readJson, writeJson } from '../utils/db.js';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req,res)=> res.json(await readJson('employees')));
router.post('/', async (req,res)=>{ const employees = await readJson('employees'); const b=req.body||{}; const newE = { id: uuid(), name: b.name||'Unnamed', isSenior: !!b.isSenior, preferences: b.preferences||{}, weekOff: b.weekOff||[], role: b.role||'Employee' }; employees.push(newE); await writeJson('employees', employees); res.status(201).json(newE); });
router.put('/:id', async (req,res)=>{ const {id}=req.params; const employees = await readJson('employees'); const idx = employees.findIndex(e=>e.id===id); if(idx===-1) return res.status(404).json({error:'Not found'}); // allow updating role, preferences, weekOff, isSenior, name
  const allowed = (({id, name, isSenior, preferences, weekOff, role})=>({id, name, isSenior, preferences, weekOff, role}))(req.body);
  employees[idx] = {...employees[idx], ...allowed, id}; await writeJson('employees', employees); res.json(employees[idx]); });
router.delete('/:id', async (req,res)=>{ const {id}=req.params; let employees = await readJson('employees'); employees = employees.filter(e=>e.id!==id); await writeJson('employees', employees); res.json({ok:true}); });
export default router;
