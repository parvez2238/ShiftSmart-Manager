import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apiPost, apiPut } from '../../api/client.js';

export default function EditEmployeeModal({ employee, onClose }){
  const [name, setName] = useState(employee?.name || '');
  const [isSenior, setIsSenior] = useState(!!employee?.isSenior);
  const [preferredShift, setPreferredShift] = useState(employee?.preferences?.preferredShift || '');
  const [avoidShift, setAvoidShift] = useState(employee?.preferences?.avoidShift || '');
  const [weekOff, setWeekOff] = useState(employee?.weekOff || []);
  const [role, setRole] = useState(employee?.role || 'Employee');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  useEffect(()=>{ setName(employee?.name || ''); setIsSenior(!!employee?.isSenior); setPreferredShift(employee?.preferences?.preferredShift || ''); setAvoidShift(employee?.preferences?.avoidShift || ''); setWeekOff(employee?.weekOff || []); setRole(employee?.role || 'Employee'); }, [employee]);

  function toggleDay(d){ setWeekOff(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]) }

  async function save(){
    const payload = { name, isSenior, preferences: { preferredShift, avoidShift }, weekOff, role };
    try{
      if (employee && employee.id) await apiPut('/api/employees/'+employee.id, payload);
      else await apiPost('/api/employees', payload);
      onClose && onClose();
    }catch(e){ console.error(e); alert('Save failed'); }
  }

  const modal = (
    <div className="modal-backdrop" onClick={(e)=>{ if(e.target === e.currentTarget) onClose && onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
        <h3>{employee ? 'Edit Employee' : 'Add Employee'}</h3>
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <label><input type="checkbox" checked={isSenior} onChange={e=>setIsSenior(e.target.checked)} /> Senior</label>
          <div style={{display:'flex',gap:8}}>
            <select value={preferredShift} onChange={e=>setPreferredShift(e.target.value)}>
              <option value=''>Preferred shift (optional)</option>
              <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option>
            </select>
            <select value={avoidShift} onChange={e=>setAvoidShift(e.target.value)}>
              <option value=''>Avoid shift (optional)</option>
              <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option>
            </select>
          </div>
          <div>
            <div className="muted">Week off days</div>
            <div className="row" style={{marginTop:6}}>
              {days.map(d => <label key={d} className="badge" style={{cursor:'pointer'}}><input type="checkbox" checked={weekOff.includes(d)} onChange={()=>toggleDay(d)} /> {d}</label>)}
            </div>
          </div>
          <div>
            <div className="muted">Role (set by manager)</div>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option>Employee</option><option>Manager</option><option>Admin</option>
            </select>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button onClick={()=>onClose && onClose()}>Cancel</button>
            <button className="edit-btn" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }
  return modal;
}
