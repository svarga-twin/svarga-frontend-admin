import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Jalankan fungsi async saat mount / deps berubah.
 * - `interval` (ms): polling senyap (tanpa kedip skeleton).
 * - hasil lama tetap tampil saat memuat ulang (stale-while-revalidate).
 */
export function useAsync(fn, deps = [], { interval = 0, enabled = true } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: enabled });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const seq = useRef(0);

  const run = useCallback(async ({ silent = false } = {}) => {
    const id = ++seq.current;
    if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      if (id === seq.current) setState({ data, error: null, loading: false });
    } catch (error) {
      if (id === seq.current) setState((s) => ({ data: silent ? s.data : null, error, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!enabled) { setState((s) => ({ ...s, loading: false })); return undefined; }
    run();
    let timer;
    if (interval > 0) timer = setInterval(() => run({ silent: true }), interval);
    return () => { clearInterval(timer); seq.current++; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, interval, enabled]);

  const setData = useCallback((updater) => setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater })), []);

  return { ...state, reload: run, setData };
}

/** Debounce nilai (untuk kolom cari). */
export function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}
