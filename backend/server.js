import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { initStore, readJson } from './utils/db.js';
import employeesRouter from './routes/employees.js';
import clientsRouter from './routes/clients.js';
import tasksRouter from './routes/tasks.js';
import leavesRouter from './routes/leaves.js';
import rosterRouter from './routes/roster.js';
import managerRouter from './routes/manager.js';
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors()); app.use(express.json({limit:'1mb'})); app.use(compression());
app.get('/api', (req,res)=> res.json({ok:true, service:'ShiftSmart Backend'}));
app.use('/api/employees', employeesRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/roster', rosterRouter);
app.use('/api/manager', managerRouter);

// serve static frontend if available
const __dirname = path.resolve();
const publicDir = path.join(__dirname, 'public');
import fs from 'fs';
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req,res)=> res.sendFile(path.join(publicDir, 'index.html')));
}

async function seed(){
  await initStore();
  const clients = await readJson('clients');
  if (clients.length === 0) {
    const { writeJson } = await import('./utils/db.js');
    await writeJson('clients', [{id:'c1',name:'Client Alpha',ticketCount:42},{id:'c2',name:'Client Beta',ticketCount:15}]);
  }
  const tasks = await readJson('tasks');
  if (tasks.length === 0) {
    const { writeJson } = await import('./utils/db.js');
    await writeJson('tasks', [{id:'t1',clientId:'c1',title:'Initial task',status:'todo',assigneeId:null,priority:'normal'}]);
  }
  const employees = await readJson('employees');
  if (employees.length === 0) {
    const { writeJson } = await import('./utils/db.js');
    await writeJson('employees', []);
  }
}
seed().then(()=> app.listen(PORT, ()=> console.log(`ShiftSmart backend running on http://localhost:${PORT}`)) ).catch(err=>{ console.error(err); process.exit(1); });
