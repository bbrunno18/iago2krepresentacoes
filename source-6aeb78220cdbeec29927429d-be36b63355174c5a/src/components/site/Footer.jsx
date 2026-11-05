import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Mail, MapPin, Clock, Phone, Instagram } from "lucide-react";
import { useSettings, waLink } from "@/lib/site";

export default function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer data-testid="site-footer" className="bg-ink text-white dark-grid-lines relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 bg-gold flex items-center justify-center font-display font-extrabold text-ink text-xl tracking-tighter">2K</span>
              <div className="leading-none">
                <span className="block font-display font-bold text-xl tracking-tight">{settings.company_name}</span>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-white/50 mt-1">Representação Comercial</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">{settings.tagline}</p>
            <a
              href={waLink(settings)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-whatsapp-btn"
              className="inline-flex items-center gap-2 mt-8 bg-gold text-ink font-semibold px-6 py-3 text-sm hover:bg-white transition-colors duration-300"
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5 font-semibold">Navegação</h3>
            <ul className="space-y-3 text-sm">
              {[["/", "Início"], ["/sobre", "Sobre"], ["/marcas", "Marcas"], ["/produtos", "Produtos"], ["/faq", "Perguntas frequentes"], ["/contato", "Fale conosco"]].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} data-testid={`footer-link-${label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ /g, "-")}`} className="text-white/70 hover:text-gold transition-colors duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5 font-semibold">Comercial</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/solicitar-catalogo" data-testid="footer-link-catalogo" className="text-white/70 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1">
                  Solicite um catálogo <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/produtos" data-testid="footer-link-consultar" className="text-white/70 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1">
                  Consultar produtos <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/marcas" data-testid="footer-link-marcas" className="text-white/70 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1">
                  Ver marcas <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5 font-semibold">Contato</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-gold shrink-0" />
                <a href={waLink(settings)} target="_blank" rel="noopener noreferrer" data-testid="footer-phone" className="hover:text-gold transition-colors duration-300">
                  {settings.phone_display}
                </a>
              </li>
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-gold shrink-0" />
                  <a href={`mailto:${settings.email}`} data-testid="footer-email" className="hover:text-gold transition-colors duration-300">{settings.email}</a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                  <span data-testid="footer-address">{settings.address}</span>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="text-gold shrink-0" />
                <span data-testid="footer-hours">{settings.business_hours}</span>
              </li>
              {settings.instagram && (
                <li className="flex items-center gap-2.5">
                  <Instagram size={14} className="text-gold shrink-0" />
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" data-testid="footer-instagram" className="hover:text-gold transition-colors duration-300">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} {settings.company_name}{settings.cnpj ? ` · CNPJ ${settings.cnpj}` : ""}. Todos os direitos reservados.</p>
          <p className="text-center">Em conformidade com a LGPD. Coletamos apenas os dados necessários para o atendimento.</p>
          <Link to="/admin/login" data-testid="footer-admin-link" className="hover:text-gold transition-colors duration-300">
            Acesso administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
