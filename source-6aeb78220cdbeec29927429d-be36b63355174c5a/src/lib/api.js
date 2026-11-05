import axios from "axios";
import { refreshSession } from "@netlify/identity";

export const API = "/api";

export const api = axios.create({ baseURL: API, withCredentials: true });

// Rotas administrativas usam o cookie de sessão do Netlify Identity;
// renova o token antes de expirar para evitar 401 no meio do uso.
api.interceptors.request.use(async (config) => {
  if (config.url?.startsWith("/admin")) {
    try { await refreshSession(); } catch (e) {}
  }
  return config;
});

export function formatApiError(e) {
  const detail = e?.response?.data?.detail;
  if (detail == null) return e?.message || "Algo deu errado. Tente novamente.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((x) => (x && typeof x.msg === "string" ? x.msg : JSON.stringify(x))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
