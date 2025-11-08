const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export async function apiGet(path){ const res = await fetch(API+path); return res.json(); }
export async function apiPost(path, body){ const res = await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})}); return res.json(); }
export async function apiPut(path, body){ const res = await fetch(API+path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})}); return res.json(); }
export async function apiDel(path){ const res = await fetch(API+path,{method:'DELETE'}); return res.json(); }
