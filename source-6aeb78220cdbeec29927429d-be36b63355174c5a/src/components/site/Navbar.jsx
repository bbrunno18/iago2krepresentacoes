import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useSettings } from "@/lib/site";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/marcas", label: "Marcas" },
  { to: "/produtos", label: "Produtos" },
  { to: "/faq", label: "FAQ" },
  { to: "/contato", label: "Contato" },
];

export default function Navbar() {
  const settings = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 inset-x-0 z-50 border-b transition-[background-color,box-shadow] duration-500 ${
          scrolled ? "bg-[#FAFAFA]/90 backdrop-blur-xl border-[#E2E8F0] shadow-[0_1px_24px_rgba(15,23,42,0.06)]" : "bg-[#FAFAFA]/70 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group" aria-label="2K Representações — Início">
            <span className="w-10 h-10 bg-ink flex items-center justify-center font-display font-extrabold text-gold text-lg tracking-tighter group-hover:bg-gold group-hover:text-ink transition-colors duration-300">
              2K
            </span>
            <span className="hidden sm:block leading-tight">
              <span className="block font-display font-bold text-ink text-sm tracking-tight">{settings.company_name}</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-slate2 mt-0.5">Representação Comercial</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide underline-gold pb-0.5 transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-slate2 hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/solicitar-catalogo"
              data-testid="nav-cta-catalog"
              className="hidden md:inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-gold hover:text-ink transition-colors duration-300"
            >
              Solicitar catálogo
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
            <button
              data-testid="nav-mobile-toggle"
              onClick={() => setOpen(!open)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-ink border border-[#E2E8F0] bg-white"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="nav-mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-ink text-white pt-[72px] lg:hidden"
          >
            <nav className="px-8 py-12 flex flex-col gap-2" aria-label="Navegação móvel">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.to}
                    data-testid={`nav-mobile-${l.label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`}
                    className="font-display font-bold text-4xl tracking-tight py-3 block hover:text-gold transition-colors duration-300"
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mt-8"
              >
                <Link
                  to="/solicitar-catalogo"
                  data-testid="nav-mobile-cta"
                  className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-8 py-4 text-base"
                >
                  Solicitar catálogo
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
