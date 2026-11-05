import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getUser,
  login as identityLogin,
  logout as identityLogout,
  signup as identitySignup,
  requestPasswordRecovery,
  updateUser,
  handleAuthCallback,
  onAuthChange,
  AuthError,
  MissingIdentityError,
} from "@netlify/identity";

const AuthContext = createContext(null);

const toUser = (u) => (u ? { id: u.id, email: u.email, name: u.name, roles: u.roles || [] } : false);

function authMessage(e) {
  if (e instanceof MissingIdentityError) return "O serviço de login ainda não está ativo neste site.";
  if (e instanceof AuthError) {
    if (e.status === 401 || e.status === 400) return "E-mail ou senha inválidos.";
    if (e.status === 403) return "Cadastro não permitido para este e-mail.";
    if (e.status === 422) return "Dados inválidos. A senha precisa ter ao menos 6 caracteres.";
    if (e.status === 404) return "Usuário não encontrado.";
    return e.message || "Não foi possível concluir. Tente novamente.";
  }
  return e?.message || "Algo deu errado. Tente novamente.";
}

export function AuthProvider({ children }) {
  // null = verificando, false = deslogado, objeto = autenticado
  const [user, setUser] = useState(null);
  // "recovery" quando o usuário volta pelo link de redefinição de senha
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await handleAuthCallback();
        if (result?.type === "recovery") setPendingAction("recovery");
        if (result?.type === "confirmation" || result?.type === "recovery") {
          if (!window.location.pathname.startsWith("/admin")) window.history.replaceState(null, "", "/admin/login");
        }
      } catch (e) {
        // link expirado ou inválido: segue para o estado normal
      }
      const u = await getUser();
      if (active) setUser(toUser(u));
    })();
    const unsubscribe = onAuthChange((_event, u) => setUser(toUser(u)));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const u = await identityLogin(email, password);
      setUser(toUser(u));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authMessage(e) };
    }
  }, []);

  const signup = useCallback(async (email, password) => {
    try {
      const u = await identitySignup(email, password);
      const confirmed = !!(u?.emailVerified || u?.confirmedAt);
      if (confirmed) setUser(toUser(u));
      return { ok: true, confirmed };
    } catch (e) {
      return { ok: false, error: authMessage(e) };
    }
  }, []);

  const recover = useCallback(async (email) => {
    try {
      await requestPasswordRecovery(email);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authMessage(e) };
    }
  }, []);

  const setNewPassword = useCallback(async (password) => {
    try {
      await updateUser({ password });
      setPendingAction(null);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authMessage(e) };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await identityLogout(); } catch (e) {}
    setUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, recover, setNewPassword, pendingAction, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
