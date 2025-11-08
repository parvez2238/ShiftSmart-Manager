import React, { useState, useEffect } from 'react';
import { apiPost, apiGet } from '../api/client.js';

export default function ManagerPanel({ startDate, onStartDateChange, employees, onRefresh, setRoster, generate }){
  const QUOTES = ["Good morning! Small steps today, big wins tomorrow.","Excellence is a habit.","Be the teammate you want to have.","Clarity creates speed.","Progress over perfection."];
  const quote = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  const [managerThoughts, setManagerThoughts] = useState('');
  useEffect(()=>{ apiGet('/api/manager/thoughts').then(r=>{ if(r) setManagerThoughts(r.thoughts||'') }).catch(()=>{} ) },[]);

  async function handleGenerate(){ if(generate) return generate(); const r = await apiPost('/api/roster/generate', { startDate }); setRoster(r); }
  async function clearRoster(){ await apiPost('/api/roster/clear', {}); setRoster({}); }
  async function saveThoughts(){ await apiPost('/api/manager/thoughts', { thoughts: managerThoughts }); alert('Saved'); if(onRefresh) onRefresh(); }

  return (
    <div className="card">
      <div className="title">Manager Panel</div>
      <div className="muted">Hello, Manager 👋</div>
      <div style={{marginTop:8, marginBottom:8}} className="good">{quote}</div>
      <div style={{display:'grid',gap:8}}>
        <label>Start date</label>
        <input type="date" value={startDate} onChange={e=>onStartDateChange(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button onClick={handleGenerate} className="edit-btn">Auto Arrange 15 days</button>
          <button onClick={clearRoster} className="warn">Clear Roster</button>
        </div>

        <div style={{marginTop:12}}>
          <div className="muted">Manager Thoughts</div>
          <textarea rows={3} value={managerThoughts} onChange={e=>setManagerThoughts(e.target.value)} />
          <div style={{marginTop:8, display:'flex', gap:8}}>
            <button onClick={saveThoughts} className="edit-btn">Save Thoughts</button>
          </div>
        </div>
      </div>
    </div>
  )
}
