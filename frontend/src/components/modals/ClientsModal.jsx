import React, { useState } from 'react';
import { apiPost, apiPut } from '../../api/client.js';

export default function ClientsModal({ client, onClose }){
  const [name,setName] = useState(client?.name||'');
  const [tickets,setTickets] = useState(client?.ticketCount||0);
  const [notes,setNotes] = useState(client?.notes||'');

  async function save(){ if(client){ await apiPut('/api/clients/'+client.id, { name, ticketCount: Number(tickets), notes }); } else { await apiPost('/api/clients', { name, ticketCount: Number(tickets), notes }); } onClose(); }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{client ? 'Edit Client' : 'Add Client'}</h3>
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Client name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Ticket count" type="number" value={tickets} onChange={e=>setTickets(e.target.value)} />
          <textarea placeholder="Notes" rows={4} value={notes} onChange={e=>setNotes(e.target.value)} />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button onClick={onClose}>Cancel</button>
            <button className="edit-btn" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
