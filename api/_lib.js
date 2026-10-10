// Shared helpers for Mavis account functions (run on Vercel, never in the browser).
// Uses the Supabase service key from the Vercel env var SUPABASE_SERVICE_ROLE_KEY,
// so these functions can create accounts and read the locked tables. Nothing here is
// ever sent to the browser except the specific answers each function returns.
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qjxcpmkiyfrukxicdwkl.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeGNwbWtpeWZydWt4aWNkd2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDkwOTAsImV4cCI6MjA5NzUyNTA5MH0.Wiwtqf1bkokU7H6VauvFyysHcMMi5KV8mgSfwR5NEWc';

// Roles that log in with a 6-digit PIN; everyone above uses a password (8+ characters).
const PIN_ROLES = ['supervisor', 'teammember', 'dailyworker'];
const ROLE_RANK = { superadmin: 6, director: 5, manager: 4, supervisor: 3, teammember: 2, dailyworker: 1 };
// Who can manage people: managers and above.
const MANAGE_MIN_RANK = 4;

function body(req){
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}
function send(res, code, obj){
  res.setHeader('Cache-Control', 'no-store');
  res.status(code).json(obj);
}
async function db(path, opts = {}){
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    method: opts.method || 'GET',
    headers: Object.assign({ apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' }, opts.headers || {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!r.ok) { const err = new Error('db ' + r.status + ' ' + text); err.status = r.status; throw err; }
  return data;
}
async function authAdmin(path, opts = {}){
  const r = await fetch(SUPABASE_URL + '/auth/v1/admin/' + path, {
    method: opts.method || 'GET',
    headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY, 'Content-Type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!r.ok) { const err = new Error('auth ' + r.status + ' ' + text); err.status = r.status; throw err; }
  return data;
}
// Sign in on the server (so the browser never needs to know the internal login email).
async function passwordGrant(email, password){
  const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return null;
  return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in };
}
// Who is calling? Checks the browser's session token with Supabase, then loads their profile.
async function caller(req){
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  const r = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + token } });
  if (!r.ok) return null;
  const u = await r.json();
  const rows = await db('profiles?select=*&user_id=eq.' + encodeURIComponent(u.id) + '&limit=1');
  const p = rows && rows[0];
  if (!p || !p.active) return null;
  return p;
}
function authEmailFor(username){ return username.toLowerCase().replace(/[^a-z0-9-]/g, '') + '@staff.getmavis.app'; }
function slug(s){ return String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function newToken(){ return crypto.randomBytes(24).toString('base64url'); }
function secretOk(role, secret){
  const s = String(secret || '');
  if (PIN_ROLES.includes(role)) return /^\d{6}$/.test(s) ? null : 'PIN must be exactly 6 numbers';
  return s.length >= 8 ? null : 'Password must be at least 8 characters';
}
function publicProfile(p){
  if (!p) return null;
  return { id: p.id, company_id: p.company_id, username: p.username, first_name: p.first_name, last_name: p.last_name, role: p.role,
    departments: p.departments || [], venues: p.venues || [], email: p.email || null, is_owner: !!p.is_owner, active: p.active,
    has_login: !!p.user_id, last_login: p.last_login, photo: p.photo || null };
}
module.exports = { db, authAdmin, passwordGrant, caller, authEmailFor, slug, newToken, secretOk, publicProfile, send, body,
  PIN_ROLES, ROLE_RANK, MANAGE_MIN_RANK, SERVICE_KEY };
