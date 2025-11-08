import React, { useState } from 'react';
import { apiPost } from '../../api/client.js';

export default function TaskModal({ client, onClose }){
  const [title,setTitle]=useState('');
  const [status,setStatus]=useState('todo');
  async function save(){ if(!title) return; await apiPost('/api/tasks', { clientId: client.id, title, status }); onClose(); }
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Task for {client.name}</h3>
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="todo">todo</option>
            <option value="in-progress">in-progress</option>
            <option value="done">done</option>
          </select>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button onClick={onClose}>Cancel</button>
            <button className="edit-btn" onClick={save}>Save Task</button>
          </div>
        </div>
      </div>
    </div>
  )
}
