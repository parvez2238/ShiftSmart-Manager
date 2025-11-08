import React, { useState } from 'react';
import EditEmployeeModal from './modals/EditEmployeeModal.jsx';
import { apiDel } from '../api/client.js';

export default function EmployeesPage({ employees, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);

  function openNew(){ setEditEmp(null); setShowModal(true); }
  function openEdit(emp){ setEditEmp(emp); setShowModal(true); }

  async function remove(emp){
    if(!confirm('Delete employee '+emp.name+' ?')) return;
    await apiDel('/api/employees/'+emp.id);
    if(onRefresh) onRefresh();
  }

  return (
    <div className="card">
      <div className="title">Employees</div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div className="muted">Manage employees (add / edit / delete)</div>
        <button className="edit-btn" onClick={openNew}>Add Employee</button>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Senior</th><th>Week-offs</th><th>Actions</th></tr></thead>
        <tbody>
          {(employees||[]).map(e=> (
            <tr key={e.id} className="employee-row">
              <td>{e.name}</td>
              <td>{e.role}</td>
              <td>{e.isSenior ? 'Yes' : 'No'}</td>
              <td>{(e.weekOff||[]).join(', ')}</td>
              <td>
                <button className="edit-btn" onClick={()=>openEdit(e)}>Edit</button>
                <button className="warn" onClick={()=>remove(e)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && <EditEmployeeModal employee={editEmp} onClose={()=>{ setShowModal(false); if(onRefresh) onRefresh(); }} />}
    </div>
  )
}
