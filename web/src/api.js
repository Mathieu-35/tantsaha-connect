// API : le SEUL fichier du site web qui parle au serveur (comme api.js côté mobile).
// Le jeton de connexion est gardé dans sessionStorage : il disparaît à la fermeture de l'onglet.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'tantsaha_admin_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

// Erreur avec le message du serveur (déjà en français) et le numéro HTTP.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(body && { 'Content-Type': 'application/json' }),
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Serveur injoignable. Est-il démarré ?', 0);
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error?.message || 'Erreur inconnue', res.status);
  return data;
}

export const api = {
  login: (email, password) => request('POST', '/admin/auth/login', { email, password }),
  me: () => request('GET', '/admin/me'),
  stats: () => request('GET', '/admin/stats/summary'),
  list: (resource) => request('GET', `/admin/${resource}`),
  create: (resource, data) => request('POST', `/admin/${resource}`, data),
  update: (resource, id, data) => request('PUT', `/admin/${resource}/${id}`, data),
  remove: (resource, id) => request('DELETE', `/admin/${resource}/${id}`),
};
