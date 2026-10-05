"use client";

// Wrapper fetch sisi browser -> Route Handler proxy (app/api/admin/proxy).
// Mengembalikan { ok, data, message, errors } supaya form bisa menampilkan
// pesan umum dan pesan per-field (422 dari Laravel) tanpa try/catch di mana-mana.
async function call(method, url, body) {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, data: json.data, message: json.message, errors: json.errors ?? {} };
  } catch {
    return { ok: false, message: "Tidak bisa terhubung ke server.", errors: {} };
  }
}

export const adminApi = {
  create: (resource, body) => call("POST", `/api/admin/proxy/${resource}`, body),
  update: (resource, id, body) => call("PUT", `/api/admin/proxy/${resource}/${id}`, body),
  remove: (resource, id) => call("DELETE", `/api/admin/proxy/${resource}/${id}`),
};

/** Ambil pesan error pertama per-field dari format 422 Laravel ({field: [msg]}). */
export function fieldErrors(errors) {
  return Object.fromEntries(Object.entries(errors ?? {}).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}
