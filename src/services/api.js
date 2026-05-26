const API_URL = 'https://proyecto-2ql0.onrender.com/api/v1';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('partgo_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Error en la petición');
  }

  return data;
}