import React from 'react';
const SHIFTS=['Morning','Afternoon','Evening','Night'];
const shiftColor = shift => {
  if (shift==='Morning') return {background:'#9ae6b4', color:'#042f1f'};
  if (shift==='Afternoon') return {background:'#fbd38d', color:'#4a2100'};
  if (shift==='Evening') return {background:'#c4b5fd', color:'#22103b'};
  return {background:'#0f1724', color:'#ffffff'}; // Night - dark bg, white text
};
export default function Calendar({ startDate, roster, employees, leaves }){
  const start = new Date(startDate);
  const dayKey = d => { const dt = new Date(start); dt.setDate(start.getDate()+d); return dt.toISOString().slice(0,10); }
  const dates = Array.from({length:15}).map((_,i)=>dayKey(i));
  const empById = {}; for(const e of employees) empById[e.id]=e;
  const leavesSet = new Set((leaves||[]).map(l=>`${l.employeeId}::${new Date(l.date).toDateString()}`));
  return (
    <div className="card calendar" style={{overflowX:'auto'}}>
      <div className="title">15-day Shift Roster (Shifts as rows, dates across columns)</div>
      <table>
        <thead>
          <tr>
            <th>Shift \ Date</th>
            {dates.map(d => <th key={d} style={{minWidth:120}}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {SHIFTS.map(shift => (
            <tr key={shift}>
              <td style={{fontWeight:700}}>{shift}</td>
              {dates.map(d => (
                <td key={d}>
                  {/* show employees assigned */}
                  {(roster[d]?.[shift]||[]).map(id => {
                    const e = empById[id] || { name: id, role: 'Employee', weekOff: [] };
                    const style = shiftColor(shift);
                    const leaveKey = `${id}::${new Date(d).toDateString()}`;
                    if (leavesSet.has(leaveKey)) {
                      return (<div key={id} style={{margin:'4px 0'}}><span className="badge" style={{background:'#f87171',color:'#fff'}}>On leave: {e.name}</span></div>);
                    }
                    // if employee has weekoff on that day, show Week-off badge
                    const dayName = new Date(d).toLocaleDateString('en-US', { weekday: 'long' });
                    if (e.weekOff && e.weekOff.includes(dayName)) {
                      return (<div key={id} style={{margin:'4px 0'}}><span className="badge" style={{background:'#e2e8f0',color:'#1f2937'}}>Week-off: {e.name}</span></div>);
                    }
                    return (<div key={id} style={{margin:'4px 0'}}><span className="badge" style={{background:style.background,color:style.color}}>{e.name} ({e.role})</span></div>);
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
