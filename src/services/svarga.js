// Seluruh pemanggilan endpoint svarga-backend dikumpulkan di sini supaya halaman
// tidak perlu tahu bentuk URL/response Laravel (Resource membungkus di `data`).
import { api, unwrap } from "../lib/api";

export const auth = {
  login: (email, password) => api.post("/auth/login", { email, password }, { auth: false }), // → { user, token }
  me: async () => unwrap(await api.get("/auth/me")),
  logout: () => api.post("/auth/logout"),
};

export const users = {
  list: (params) => api.get("/admin/users", params), // → { data, page, last_page, per_page, filtered_total, total, aktif, nonaktif, baru_7_hari }
  create: (body) => api.post("/admin/users", body),
  update: (id, body) => api.put(`/admin/users/${id}`, body),
  remove: (id) => api.del(`/admin/users/${id}`),
  activityMonthly: async (months = 5) => unwrap(await api.get("/admin/activity-monthly", { months })),
};

export const notifications = {
  list: (params) => api.get("/admin/notifications", params),
  markAllRead: () => api.post("/admin/notifications/mark-read"),
};

export const festivals = {
  list: (params) => api.get("/festivals", { all: 1, per_page: 100, ...params }), // → { data, meta }
  create: (body) => api.post("/festivals", body),
  update: (id, body) => api.put(`/festivals/${id}`, body),
  remove: (id) => api.del(`/festivals/${id}`),
};

export const geofences = {
  list: async () => unwrap(await api.get("/geofences", { all: 1 })),
  create: (body) => api.post("/geofences", body),
  update: (id, body) => api.put(`/geofences/${id}`, body),
  remove: (id) => api.del(`/geofences/${id}`),
};

export const content = {
  soundscapes: async () => unwrap(await api.get("/soundscapes")),
  greenSpaces: async () => unwrap(await api.get("/green-spaces")),
  koridors: async () => unwrap(await api.get("/koridors")),
  umkm: async () => unwrap(await api.get("/umkm", { per_page: 100 })),
};

export const sensors = {
  snapshot: (koridorId) => api.get("/sensors/snapshot", { koridor_id: koridorId }),
  active: () => api.get("/sensors/active"),
  history: (params) => api.get("/sensors/history", params), // sensor_type, koridor_id, days
};

export const mood = {
  summary: (params) => api.get("/mood-logs/summary", params),
};

// --- Endpoint tambahan khusus admin (lihat folder backend-patch/) ---
export const devices = {
  list: () => api.get("/admin/sensor-devices"), // → { data, summary }
  create: (body) => api.post("/admin/sensor-devices", body), // → { data, api_key }
  update: (id, body) => api.put(`/admin/sensor-devices/${id}`, body),
  rotateKey: (id) => api.post(`/admin/sensor-devices/${id}/rotate-key`), // → { data, api_key }
  remove: (id) => api.del(`/admin/sensor-devices/${id}`),
};

export const settings = {
  get: () => api.get("/admin/settings"), // → { data: {...}, system: {...} }
  save: (values) => api.put("/admin/settings", { settings: values }),
  backup: () => api.post("/admin/backup"),
  downloadBackup: (file) => api.download("/admin/backup/download", { file }, file),
};

/** Kondisi lingkungan semua koridor: snapshot per koridor (paralel). */
export async function loadKoridorSnapshots(koridors) {
  const results = await Promise.all(
    koridors.map((k) => sensors.snapshot(k.id).then((s) => [k.id, s]).catch(() => [k.id, null]))
  );
  return Object.fromEntries(results);
}
