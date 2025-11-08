import React, { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from './api/client.js';
import Calendar from './components/Calendar.jsx';
import ManagerPanel from './components/ManagerPanel.jsx';
import Dashboard from './components/Dashboard.jsx';
import EmployeesPage from './components/EmployeesPage.jsx';
import ClientsPage from './components/ClientsPage.jsx';

export default function App(){
  const [view, setView] = useState('dashboard');
  const [employees,setEmployees]=useState([]);
  const [clients,setClients]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [roster,setRoster]=useState({});
  const [leaves,setLeaves]=useState([]);
  const [startDate,setStartDate]=useState(new Date().toISOString().slice(0,10));

  async function loadAll(){
    const [e,c,t,r,l] = await Promise.all([
      apiGet('/api/employees'), apiGet('/api/clients'), apiGet('/api/tasks'), apiGet('/api/roster'), apiGet('/api/leaves')
    ]);
    setEmployees(e||[]); setClients(c||[]); setTasks(t||[]); setRoster(r||{}); setLeaves(l||[]);
  }
  useEffect(()=>{ loadAll() },[]);

  const tasksByClient = useMemo(()=>{ const map = {}; for(const t of tasks){ if(!map[t.clientId]) map[t.clientId]=[]; map[t.clientId].push(t); } return map },[tasks]);

  async function generate(){ const r = await apiPost('/api/roster/generate', { startDate }); setRoster(r); }

  async function saveEmployeeNote(empId, note){ // save to manager notes
    await apiPost('/api/manager/thoughts', { ...managerNotes, perEmployee: { ...(managerNotes.perEmployee||{}), [empId]: note } });
    loadAll();
  }

  return (
    <div className="app">
      <aside>
        <div style={{marginBottom:10}} className="card">
          <div className="row" style={{padding:10}}>
            <button onClick={()=>setView('dashboard')}>Dashboard</button>
            <button onClick={()=>setView('clients')}>Clients</button>
            <button onClick={()=>setView('employees')}>Employees</button>
          </div>
        </div>
        <ManagerPanel startDate={startDate} onStartDateChange={setStartDate} employees={employees} onRefresh={loadAll} setRoster={setRoster} generate={generate} />
      </aside>
      <main>
        {view === 'dashboard' && (
          <div style={{display:'grid',gap:16}}>
            <Dashboard clients={clients} tasksByClient={tasksByClient} />
            <Calendar startDate={startDate} roster={roster} employees={employees} leaves={leaves} />
          </div>
        )}
        {view === 'clients' && (
          <ClientsPage clients={clients} tasksByClient={tasksByClient} onClientsChange={loadAll} />
        )}
        {view === 'employees' && (
          <EmployeesPage employees={employees} onRefresh={loadAll} />
        )}
      </main>
    </div>
  )
}