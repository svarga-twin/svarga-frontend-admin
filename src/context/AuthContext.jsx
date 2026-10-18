import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, getToken, setToken, setUnauthorizedHandler } from "../lib/api";
import { auth } from "../services/svarga";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(Boolean(getToken()));

  const clear = useCallback(() => { setToken(null); setUser(null); }, []);

  useEffect(() => { setUnauthorizedHandler(clear); }, [clear]);

  // Pulihkan sesi dari token tersimpan.
  useEffect(() => {
    if (!getToken()) return;
    auth.me()
      .then((u) => { if (u?.is_admin) setUser(u); else clear(); })
      .catch(clear)
      .finally(() => setBooting(false));
  }, [clear]);

  const login = useCallback(async (email, password) => {
    const res = await auth.login(email, password);
    if (!res?.user?.is_admin) {
      // Token sudah terbit untuk akun biasa — cabut supaya tidak menggantung.
      setToken(res?.token);
      try { await auth.logout(); } catch { /* abaikan */ }
      setToken(null);
      throw new ApiError("Akun ini bukan admin. Dashboard hanya untuk administrator SVARGA.", 403);
    }
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try { await auth.logout(); } catch { /* token mungkin sudah kedaluwarsa */ }
    clear();
  }, [clear]);

  const value = useMemo(() => ({ user, booting, login, logout, setUser }), [user, booting, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
