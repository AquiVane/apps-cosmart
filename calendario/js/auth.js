import { WORKER_URL } from './firebase.js';

// ── Sesión de la app (token del core + datos de la cuenta) ────────────────
const K_TOKEN = 'cal_token';
const K_USER = 'cal_user';
const LOGIN = 'login.html';

export const getSessionToken = () => { try { return localStorage.getItem(K_TOKEN) || ''; } catch (e) { return ''; } };
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(K_USER) || 'null'); } catch (e) { return null; }
}
function guardarSesion(token, cuenta) {
  const user = { email: cuenta.email, name: cuenta.nombre, role: 'client', clientId: 'me', agencyId: 'apps', mustChangePassword: false };
  try { localStorage.setItem(K_TOKEN, token); localStorage.setItem(K_USER, JSON.stringify(user)); } catch (e) {}
  return user;
}
function limpiarSesion() { try { localStorage.removeItem(K_TOKEN); localStorage.removeItem(K_USER); } catch (e) {} }

export async function llamar(method, path, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  const t = getSessionToken();
  if (t) opts.headers.Authorization = `Bearer ${t}`;
  if (body !== null) opts.body = JSON.stringify(body);
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 20000);
  opts.signal = ctl.signal;
  let res;
  try { res = await fetch(WORKER_URL + path, opts); }
  catch (e) { throw new Error(e.name === 'AbortError' ? 'El servidor tardó demasiado en responder. Probá de nuevo.' : 'No pudimos conectarnos. Revisá tu conexión.'); }
  finally { clearTimeout(to); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error(data.error || 'Ocurrió un error. Probá de nuevo.'); e.status = res.status; throw e; }
  return data;
}

export async function loginUser(email, password) {
  const d = await llamar('POST', '/api/apps/login', { email, password });
  guardarSesion(d.token, d);
  return d;
}
export async function registrarUsuario({ nombre, email, password }) {
  const d = await llamar('POST', '/api/apps/registro', { nombre, email, password });
  guardarSesion(d.token, d);
  return d;
}
// Estado de la cuenta y de la suscripción. Si la sesión venció, vuelve al login.
export async function obtenerCuenta() {
  try { return await llamar('GET', '/api/apps/me'); }
  catch (e) { if (e.status === 401) { limpiarSesion(); window.location.href = LOGIN; return null; } throw e; }
}
export const pedirNuevaClave = email => llamar('POST', '/auth/forgot', { email });
export const restablecerClave = (token, newPassword) => llamar('POST', '/auth/reset', { token, newPassword });

export async function logoutUser() {
  try { if (getSessionToken()) await llamar('POST', '/auth/logout'); } catch (e) {}
  limpiarSesion();
  window.location.href = LOGIN;
}
export function requireAuth() {
  const u = getCurrentUser();
  if (!u || !getSessionToken()) { window.location.href = LOGIN; return null; }
  return u;
}
export async function changePassword() { throw new Error('Para cambiar tu contraseña usá "Olvidé mi contraseña" en la pantalla de ingreso.'); }
