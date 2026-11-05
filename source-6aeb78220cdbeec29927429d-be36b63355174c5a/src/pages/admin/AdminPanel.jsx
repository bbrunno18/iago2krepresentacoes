import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Inbox, Tag, Package, LayoutGrid, HelpCircle, Settings, LogOut, ExternalLink, Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { usePageMeta } from "@/lib/site";
import RequestsTab from "@/components/admin/RequestsTab";
import BrandsTab from "@/components/admin/BrandsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import FaqsTab from "@/components/admin/FaqsTab";
import SettingsTab from "@/components/admin/SettingsTab";

const TABS = [
  { id: "requests", label: "Solicitações", icon: Inbox },
  { id: "brands", label: "Marcas", icon: Tag },
  { id: "products", label: "Produtos", icon: Package },
  { id: "categories", label: "Categorias", icon: LayoutGrid },
  { id: "faqs", label: "Perguntas (FAQ)", icon: HelpCircle },
  { id: "settings", label: "Configurações", icon: Settings },
];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("requests");
  const [stats, setStats] = useState(null);

  usePageMeta("Painel Administrativo", "Gestão de marcas, produtos, categorias, FAQ e solicitações.");

  const loadStats = () => api.get("/admin/stats").then(({ data }) => setStats(data)).catch(() => {});

  useEffect(() => {
    if (user) loadStats();
  }, [user, tab]);

  if (user === null) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div data-testid="admin-panel" className="min-h-screen bg-[#F4F4F5] flex flex-col lg:flex-row">
      <aside className="bg-ink text-white lg:w-64 lg:min-h-screen shrink-0 flex lg:flex-col">
        <div className="p-5 lg:p-6 border-b border-white/10 flex items-center gap-3">
          <span className="w-10 h-10 bg-gold flex items-center justify-center font-display font-extrabold text-ink text-base tracking-tighter shrink-0">2K</span>
          <div className="leading-none hidden sm:block">
            <span className="block font-display font-bold text-sm tracking-tight">Painel 2K</span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-white/50 mt-0.5">Administração</span>
          </div>
        </div>
        <nav className="flex lg:flex-col flex-1 overflow-x-auto lg:overflow-visible" aria-label="Menu administrativo">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} data-testid={`admin-tab-${t.id}`}
              className={`flex items-center gap-3 px-5 lg:px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 border-l-2 ${
                tab === t.id ? "bg-white/5 text-gold border-gold" : "text-white/60 hover:text-white border-transparent"
              }`}>
              <t.icon size={17} strokeWidth={1.75} />
              {t.label}
              {t.id === "requests" && stats?.requests_new > 0 && (
                <span data-testid="admin-requests-badge" className="ml-auto bg-gold text-ink text-[10px] font-bold px-2 py-0.5">{stats.requests_new}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 lg:p-5 border-t border-white/10 flex lg:flex-col gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" data-testid="admin-view-site"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-gold px-2 py-2 transition-colors duration-300">
            <ExternalLink size={14} /> Ver site
          </a>
          <button onClick={handleLogout} data-testid="admin-logout"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-red-400 px-2 py-2 transition-colors duration-300">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-10 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-ink" data-testid="admin-tab-title">
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
            <p className="text-xs text-slate2 mt-0.5">{user.email}</p>
          </div>
          {stats && (
            <div className="hidden md:flex items-center gap-6 text-xs text-slate2" data-testid="admin-stats">
              <span><strong className="text-ink font-display text-base">{stats.brands}</strong> marcas</span>
              <span><strong className="text-ink font-display text-base">{stats.products}</strong> produtos</span>
              <span><strong className="text-ink font-display text-base">{stats.requests_total}</strong> solicitações</span>
            </div>
          )}
        </header>
        <div className="p-6 lg:p-10">
          {tab === "requests" && <RequestsTab />}
          {tab === "brands" && <BrandsTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "faqs" && <FaqsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
