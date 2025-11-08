import { readJson, writeJson } from '../utils/db.js';
const SHIFTS = ['Morning','Afternoon','Evening','Night'];
function dayName(date){ return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()]; }
function pickCandidates(employees, { shift, date, assignedToday, leavesSet }) {
  const day = dayName(date);
  return employees.filter(e=>{
    if (e.weekOff && e.weekOff.includes(day)) return false;
    if (leavesSet.has(`${e.id}::${date.toDateString()}`)) return false;
    if (assignedToday.has(e.id)) return false;
    if (e.isSenior && (shift==='Morning' || shift==='Night')) return false;
    if (e.unavailableShifts && e.unavailableShifts.includes(shift)) return false;
    return true;
  });
}
function preferenceScore(e, shift){ if(!e||!e.preferences) return 0; if(e.preferences.preferredShift===shift) return 2; if(e.preferences.avoidShift===shift) return -2; return 0; }
function selectForShift(candidates, needed, state, shift, dateKey) {
  // fairness: sort by (assigned count asc) then preference score desc, then last assigned day/shift to avoid repeats
  candidates.sort((a,b)=>{
    const aCount = state.assignedCount.get(a.id)||0;
    const bCount = state.assignedCount.get(b.id)||0;
    if (aCount !== bCount) return aCount - bCount; // prefer lower count
    const pa = state.prefScoreMap.get(a.id)||0; const pb = state.prefScoreMap.get(b.id)||0;
    if (pa !== pb) return pb - pa; // prefer higher preference score
    // avoid assigning same employee to same shift consecutive days
    const aLast = state.lastAssigned.get(a.id) || ''; const bLast = state.lastAssigned.get(b.id) || '';
    if (aLast === dateKey+"::"+shift && bLast !== dateKey+"::"+shift) return 1;
    if (bLast === dateKey+"::"+shift && aLast !== dateKey+"::"+shift) return -1;
    return a.name.localeCompare(b.name);
  });
  return candidates.slice(0, needed);
}
export async function generateRoster({ startDateStr }) {
  const employees = await readJson('employees');
  const leaves = await readJson('leaves');
  const leavesSet = new Set(leaves.map(l=>`${l.employeeId}::${new Date(l.date).toDateString()}`));
  const start = new Date(startDateStr);
  const roster = {}; const state = { assignedCount: new Map(), lastAssigned: new Map(), prefScoreMap: new Map() };
  for (let d=0; d<15; d++) {
    const date = new Date(start); date.setDate(start.getDate()+d); const key = date.toISOString().slice(0,10);
    roster[key] = {};
    const assignedToday = new Set();
    for (const shift of SHIFTS) {
      state.prefScoreMap.clear();
      for (const e of employees) state.prefScoreMap.set(e.id, preferenceScore(e, shift));
      const candidates = pickCandidates(employees, { shift, date, assignedToday, leavesSet });
      const dateKey = key; const selected = selectForShift(candidates, 4, state, shift, dateKey);
      roster[key][shift] = selected.map(e=>e.id);
      for (const e of selected){ assignedToday.add(e.id); state.assignedCount.set(e.id, (state.assignedCount.get(e.id)||0)+1); state.lastAssigned.set(e.id, date.toDateString() + '::' + shift); }
    }
  }
  await writeJson('roster', roster);
  return roster;
}
