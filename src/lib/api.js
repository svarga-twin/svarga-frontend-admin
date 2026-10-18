// Klien HTTP untuk svarga-backend (Laravel + Sanctum token).
// Bentuk response mengikuti controller yang ada di backend — lihat komentar tiap fungsi.

export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const TOKEN_KEY = "svarga-admin:token";

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors; // { field: [pesan, ...] } untuk 422
  }
  /** Pesan validasi pertama (kalau ada) — dipakai untuk toast ringkas. */
  get firstError() {
    if (!this.errors) return this.message;
    const first = Object.values(this.errors)[0];
    return Array.isArray(first) ? first[0] : this.message;
  }
}

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage diblokir */ }
};

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

function buildUrl(path, query) {
  const url = new URL(API_BASE + path, window.location.origin);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString();
}

async function send(method, path, { query, body, auth = true, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError(`Tidak dapat terhubung ke server (${API_BASE}). Pastikan backend Laravel sedang berjalan.`, 0);
  }
  return res;
}

async function parse(res) {
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  return data;
}

async function request(method, path, opts = {}) {
  const res = await send(method, path, opts);
  const data = await parse(res);
  if (!res.ok) {
    if (res.status === 401 && opts.auth !== false && onUnauthorized) onUnauthorized();
    throw new ApiError(data?.message || `Permintaan gagal (${res.status}).`, res.status, data?.errors ?? null);
  }
  return data;
}

export const api = {
  get: (path, query, opts) => request("GET", path, { ...opts, query }),
  post: (path, body, opts) => request("POST", path, { ...opts, body: body ?? {} }),
  put: (path, body, opts) => request("PUT", path, { ...opts, body: body ?? {} }),
  del: (path, opts) => request("DELETE", path, opts),

  /** Unduh file biner (mis. backup) dengan header Authorization lalu simpan lewat <a download>. */
  async download(path, query, filename = "download") {
    const res = await send("GET", path, { query });
    if (!res.ok) {
      const data = await parse(res);
      if (res.status === 401 && onUnauthorized) onUnauthorized();
      throw new ApiError(data?.message || `Unduhan gagal (${res.status}).`, res.status);
    }
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  },
};

/** Resource Laravel membungkus array/objek di `data`; response custom tidak. */
export const unwrap = (r) => (r && typeof r === "object" && "data" in r ? r.data : r);
