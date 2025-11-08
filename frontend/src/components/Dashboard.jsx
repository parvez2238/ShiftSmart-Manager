import React from 'react';
export default function Dashboard({ clients, tasksByClient }) {
  function progressForClient(clientId) {
    const tasks = tasksByClient[clientId] || [];
    if (tasks.length === 0) return { done:0, total:0 };
    const done = tasks.filter(t => t.status === 'done').length;
    return { done, total: tasks.length };
  }
  return (
    <div className="card">
      <div className="title">Overview</div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <div style={{flex:1}}>
          <div className="muted">Top clients (by ticket count)</div>
          <ul style={{marginTop:8}}>
            {(clients||[]).slice(0,6).map(c => {
              const p = progressForClient(c.id);
              const percent = p.total ? Math.round((p.done/p.total)*100) : 0;
              return (
                <li key={c.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}>
                  <div>
                    <div style={{fontWeight:700}}>{c.name}</div>
                    <div className="muted" style={{marginTop:4}}>{p.done} / {p.total} tasks done</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="badge">{c.ticketCount} tickets</div>
                    <div style={{marginTop:6,color:'#0369a1',fontWeight:600}}>{percent}%</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
