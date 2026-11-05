import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePageMeta } from "@/lib/site";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  usePageMeta("Acesso Administrativo", "Área restrita da equipe 2K Representações.");

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) navigate("/admin", { replace: true });
    else setError(result.error);
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen bg-ink dark-grid-lines flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <span className="w-12 h-12 bg-gold flex items-center justify-center font-display font-extrabold text-ink text-xl tracking-tighter">2K</span>
          <div className="leading-none">
            <span className="block font-display font-bold text-white text-lg tracking-tight">Painel Administrativo</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1">Acesso restrito</span>
          </div>
        </div>
        <form onSubmit={submit} data-testid="admin-login-form" className="border border-white/15 bg-white/5 backdrop-blur-sm p-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="al-email" className="block text-xs text-white/50 mb-2 uppercase tracking-wider">E-mail</label>
              <input id="al-email" data-testid="admin-login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-transparent border-b border-white/25 focus:border-gold outline-none py-3 text-white placeholder:text-white/30 transition-colors duration-300"
                placeholder="admin@2krepresentacoes.com.br" />
            </div>
            <div>
              <label htmlFor="al-password" className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Senha</label>
              <input id="al-password" data-testid="admin-login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-transparent border-b border-white/25 focus:border-gold outline-none py-3 text-white placeholder:text-white/30 transition-colors duration-300"
                placeholder="••••••••" />
            </div>
            {error && (
              <p data-testid="admin-login-error" className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>
            )}
            <button type="submit" data-testid="admin-login-submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold text-ink font-semibold px-6 py-4 text-sm hover:bg-white transition-colors duration-300 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>
          </div>
        </form>
        <a href="/" data-testid="admin-login-back" className="block text-center text-xs text-white/40 mt-6 hover:text-gold transition-colors duration-300">
          Voltar ao site
        </a>
      </motion.div>
    </div>
  );
}
