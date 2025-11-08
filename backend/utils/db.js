import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const files = {
  manager: path.join(dataDir, 'manager.json'),
  employees: path.join(dataDir, 'employees.json'),
  clients: path.join(dataDir, 'clients.json'),
  tasks: path.join(dataDir, 'tasks.json'),
  leaves: path.join(dataDir, 'leaves.json'),
  roster: path.join(dataDir, 'roster.json')
};
export async function initStore() {
  await fs.ensureDir(dataDir);
  for (const [k,f] of Object.entries(files)) {
    if (!(await fs.pathExists(f))) {
      const seed = (k==='roster')?{}:[];
      await fs.writeJson(f, seed, {spaces:2});
    }
  }
}
export async function readJson(name){ return fs.readJson(files[name]) }
export async function writeJson(name,data){ return fs.writeJson(files[name], data, {spaces:2}) }
export { files };
