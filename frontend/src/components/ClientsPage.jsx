import React, { useState } from 'react';
import { apiPost, apiPut, apiDel } from '../api/client.js';
import ClientsModal from './modals/ClientsModal.jsx';
import TaskModal from './modals/TaskModal.jsx';

export default function ClientsPage({ clients, tasksByClient, onClientsChange }){
  const [showClientModal, setShowClientModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskClient, setTaskClient] = useState(null);

  async function deleteClient(c){ if(!confirm('Delete client?')) return; await apiDel('/api/clients/'+c.id); if(onClientsChange) onClientsChange(); }

  return (
    <div className="card clients-large">
      <div className="title">Clients — Full Management</div>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:2}}>
          <div className="muted" style={{marginBottom:8}}>Add / Edit client</div>
          <button onClick={()=>{ setEditClient(null); setShowClientModal(true); }} className="edit-btn">Add client</button>
        </div>
        <div style={{flex:3}}>
          <div className="muted" style={{marginBottom:8}}>Existing clients</div>
          {(clients||[]).map(c => (
            <div key={c.id} className="client-row">
              <div>
                <div style={{fontWeight:700}}>{c.name}</div>
                <div className="muted" style={{marginTop:6}}>{(tasksByClient[c.id]||[]).length} tasks</div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div className="badge">{c.ticketCount} tickets</div>
                <button className="edit-btn" onClick={()=>{ setEditClient(c); setShowClientModal(true); }}>Edit</button>
                <button className="edit-btn" onClick={()=>{ setTaskClient(c); setShowTaskModal(true); }}>Add Task</button>
                <button className="warn" onClick={()=>deleteClient(c)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showClientModal && <ClientsModal client={editClient} onClose={()=>{ setShowClientModal(false); if(onClientsChange) onClientsChange(); }} />}
      {showTaskModal && <TaskModal client={taskClient} onClose={()=>{ setShowTaskModal(false); if(onClientsChange) onClientsChange(); }} />}
    </div>
  )
}
