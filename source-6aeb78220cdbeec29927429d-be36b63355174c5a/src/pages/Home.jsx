import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, ArrowRight, MessageCircle, Store, UtensilsCrossed, Zap,
  Sparkles, Gift, Paintbrush, ShoppingCart, Boxes, Check, Loader2, MapPin, Clock, Phone,
} from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { submitRequest } from "@/lib/requests";
import { useSettings, waLink, usePageMeta, brandMonogram } from "@/lib/site";
import { Reveal, MaskedLine, SectionHead, EASE } from "@/components/site/Reveal";
import BrandMarquee from "@/components/site/BrandMarquee";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HERO_IMG = "https://images.unsplash.com/photo-1592085198739-ffcad7f36b54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsb2dpc3RpY3MlMjB3YXJlaG91c2V8ZW58MHx8fHwxNzg3NTE3OTQxfDA&ixlib=rb-4.1.0&q=85";
const GOODS_IMG = "https://images.pexels.com/photos/28846858/pexels-photo-28846858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const CHAPTERS = [
  { n: "01", t: "Curadoria de produtos", d: "Selecionamos marcas e itens com real potencial de giro para o seu ponto de venda — nada de catálogo inflado." },
  { n: "02", t: "Atendimento consultivo", d: "Você fala com quem entende de varejo e indica o que faz sentido para o perfil da sua loja." },
  { n: "03", t: "Catálogo organizado", d: "Marcas, categorias e novidades reunidas em um só lugar, fáceis de consultar e de pedir." },
  { n: "04", t: "Novidades e reposição", d: "Lançamentos e reposições apresentados com agilidade, para a sua loja nunca ficar parada." },
  { n: "05", t: "Suporte ao lojista", d: "Acompanhamento próximo antes, durante e depois do pedido. Relacionamento de longo prazo." },
  { n: "06", t: "Soluções por perfil", d: "Da loja de variedades ao supermercado: produtos adequados a cada tipo de negócio." },
];

const SEGMENTS = [
  { icon: Store, label: "Lojas de variedades" },
  { icon: UtensilsCrossed, label: "Utilidades domésticas" },
  { icon: Zap, label: "Materiais elétricos" },
  { icon: Sparkles, label: "Cosméticos e maquiagem" },
  { icon: Gift, label: "Presentes e decoração" },
  { icon: Paintbrush, label: "Organização e limpeza" },
  { icon: ShoppingCart, label: "Supermercados" },
  { icon: Boxes, label: "Atacadistas e distribuidores" },
];

function CatalogMiniForm() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", whatsapp: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.whatsapp.trim().length < 8) {
      toast.error("Preencha nome e WhatsApp válidos.");
      return;
    }
    if (!consent) {
      toast.error("É necessário autorizar o contato para continuar.");
      return;
    }
    setStatus("sending");
    try {
      await submitRequest({ type: "catalog", name: form.name, whatsapp: form.whatsapp, consent, message: "Solicitação rápida de catálogo (home).", origin: "Home — Resposta rápida" });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      toast.error(formatApiError(err));
    }
  };

  if (status === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
        data-testid="home-form-success" className="border border-gold/40 bg-white/5 p-8">
        <span className="w-12 h-12 bg-gold text-ink flex items-center justify-center mb-5">
          <Check size={22} strokeWidth={3} />
        </span>
        <h3 className="font-display font-bold text-2xl text-white tracking-tight">Solicitação recebida!</h3>
        <p className="text-white/60 text-sm mt-3 leading-relaxed">
          Nossa equipe comercial entrará em contato. Se preferir, chame agora mesmo no WhatsApp.
        </p>
        <a href={waLink(settings, "Olá! Acabei de solicitar o catálogo pelo site e gostaria de agilizar o atendimento.")}
          target="_blank" rel="noopener noreferrer" data-testid="home-form-success-wa"
          className="inline-flex items-center gap-2 mt-6 bg-gold text-ink font-semibold px-6 py-3 text-sm hover:bg-white transition-colors duration-300">
          <MessageCircle size={16} /> Chamar no WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} data-testid="home-catalog-form" className="border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-gold font-semibold mb-6">Resposta rápida</p>
      <div className="space-y-5">
        <div>
          <label htmlFor="hf-name" className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Seu nome</label>
          <input id="hf-name" data-testid="home-form-name" type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full bg-transparent border-b border-white/25 focus:border-gold outline-none py-3 text-white placeholder:text-white/30 transition-colors duration-300"
            placeholder="Como podemos te chamar?" />
        </div>
        <div>
          <label htmlFor="hf-wa" className="block text-xs text-white/50 mb-2 uppercase tracking-wider">WhatsApp</label>
          <input id="hf-wa" data-testid="home-form-whatsapp" type="tel" value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} required
            className="w-full bg-transparent border-b border-white/25 focus:border-gold outline-none py-3 text-white placeholder:text-white/30 transition-colors duration-300"
            placeholder="(00) 00000-0000" />
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" data-testid="home-form-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#C5A059]" />
          <span className="text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
            Autorizo o contato da equipe comercial pelo WhatsApp, conforme a LGPD.
          </span>
        </label>
        <button type="submit" data-testid="home-form-submit" disabled={status === "sending"}
          className="w-full inline-flex items-center justify-center gap-2 bg-gold text-ink font-semibold px-6 py-4 text-sm hover:bg-white transition-colors duration-300 disabled:opacity-60">
          {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} strokeWidth={2.5} />}
          {status === "sending" ? "Enviando..." : "Quero receber o catálogo"}
        </button>
      </div>
    </form>
  );
}

export default function Home() {
  const settings = useSettings();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  usePageMeta("", "Representação comercial e distribuição de produtos para lojistas, atacadistas e empresas. Conheça as marcas representadas pela 2K Representações e solicite o catálogo.");

  useEffect(() => {
    Promise.all([api.get("/brands"), api.get("/categories"), api.get("/faqs")])
      .then(([b, c, f]) => {
        setBrands(b.data);
        setCategories(c.data.filter((x) => x.name !== "Outras Categorias"));
        setFaqs(f.data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const catName = (id) => categories.find((c) => c.id === id)?.name || "";
  const featured = brands.filter((b) => b.featured).slice(0, 8);
  const brandsCount = (catId) => brands.filter((b) => b.category_id === catId).length;

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100svh] hero-grid-lines overflow-hidden flex items-center pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-center w-full">
          <div className="lg:col-span-7 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8"
              data-testid="hero-eyebrow">
              <span className="w-10 h-px bg-gold-dark" />
              Representação Comercial · Brasil
            </motion.p>

            <h1 data-testid="hero-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.8rem,7.5vw,6.5rem)]">
              <MaskedLine delay={0.25}>Produtos que</MaskedLine>
              <MaskedLine delay={0.38}>movimentam</MaskedLine>
              <MaskedLine delay={0.51} className="text-gold-dark font-editorial italic font-medium">o seu negócio.</MaskedLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
              data-testid="hero-subheadline"
              className="mt-8 text-base md:text-lg text-slate2 leading-relaxed max-w-xl">
              {settings.hero_sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}
              className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/marcas" data-testid="hero-cta-brands"
                className="inline-flex items-center gap-2 bg-ink text-white font-semibold px-7 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300">
                Conheça nossas marcas <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
              <a href={waLink(settings, "Olá! Vim pelo site e gostaria de falar com um consultor.")} target="_blank" rel="noopener noreferrer"
                data-testid="hero-cta-consultant"
                className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-7 py-4 text-sm hover:bg-ink hover:text-white transition-colors duration-300">
                <MessageCircle size={16} /> Fale com um consultor
              </a>
              <Link to="/solicitar-catalogo" data-testid="hero-cta-catalog"
                className="inline-flex items-center gap-2 border border-ink/25 text-ink font-semibold px-7 py-4 text-sm hover:border-gold hover:text-gold-dark transition-colors duration-300">
                Solicite o catálogo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.25 }}
              className="mt-14 flex items-center gap-8 text-sm text-slate2" data-testid="hero-proof">
              <div>
                <span className="block font-display font-extrabold text-3xl text-ink tracking-tighter">{settings.stat_brands || brands.length || "—"}</span>
                <span className="text-xs uppercase tracking-[0.18em]">marcas representadas</span>
              </div>
              <span className="w-px h-10 bg-[#E2E8F0]" />
              <div>
                <span className="block font-display font-extrabold text-3xl text-ink tracking-tighter">{settings.stat_categories || categories.length || "—"}</span>
                <span className="text-xs uppercase tracking-[0.18em]">categorias de produtos</span>
              </div>
              <span className="w-px h-10 bg-[#E2E8F0] hidden sm:block" />
              <div className="hidden sm:block">
                <span className="block font-display font-extrabold text-3xl text-ink tracking-tighter">B2B</span>
                <span className="text-xs uppercase tracking-[0.18em]">foco em lojistas</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative h-[420px] lg:h-[600px]">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
              className="absolute inset-0 overflow-hidden">
              <motion.img src={HERO_IMG} alt="Corredor de centro de distribuição com prateleiras organizadas de produtos"
                style={{ y: imgY }} className="w-full h-[120%] object-cover scale-110" loading="eager" />
              <div className="absolute inset-0 bg-ink/15" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
              style={{ y: cardY }}
              className="absolute -bottom-6 -left-6 lg:-left-16 bg-white border border-[#E2E8F0] shadow-[0_24px_64px_rgba(15,23,42,0.14)] p-4 w-56 lg:w-64">
              <div className="overflow-hidden">
                <img src={GOODS_IMG} alt="Produtos embalados prontos para distribuição no atacado" className="w-full h-36 object-cover" loading="lazy" />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-gold-dark font-semibold">Catálogo completo</p>
              <p className="font-display font-bold text-ink text-sm tracking-tight mt-1 leading-snug">Utilidades, elétricos, cosméticos, limpeza e mais.</p>
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -top-5 -right-3 lg:-right-6 bg-gold text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2.5">
              Parceiro do lojista
            </motion.span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <BrandMarquee items={brands.map((b) => b.name)} />

      {/* MANIFESTO */}
      <section className="bg-ink text-white dark-grid-lines noise-overlay relative py-24 lg:py-36" data-testid="manifesto-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHead dark eyebrow="O que nos move" title="Mais do que representar marcas. Movimentar negócios."
            description="Atuamos como a ponte entre fabricantes, importadores e compradores profissionais — com curadoria, agilidade e relacionamento de verdade." />
          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.06} className="bg-ink">
                <div className="p-8 lg:p-12 h-full group hover:bg-[#16203a] transition-colors duration-500" data-testid={`manifesto-chapter-${c.n}`}>
                  <span className="font-editorial italic text-gold text-3xl lg:text-4xl">{c.n}</span>
                  <h3 className="font-display font-bold text-xl lg:text-2xl tracking-tight mt-5 group-hover:text-gold transition-colors duration-500">{c.t}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mt-3 max-w-md">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-24 lg:py-36" data-testid="categories-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <SectionHead eyebrow="Encontre produtos para sua loja" title="Categorias pensadas para giro e margem." />
            <Reveal delay={0.2}>
              <Link to="/produtos" data-testid="categories-see-all"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline-gold pb-1 hover:text-gold-dark transition-colors duration-300">
                Ver catálogo completo <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05} className="bg-[#FAFAFA]">
                <Link to={`/produtos?categoria=${c.id}`} data-testid={`category-card-${i}`}
                  className="group flex flex-col justify-between h-full p-8 lg:p-10 min-h-[220px] hover:bg-ink transition-colors duration-500">
                  <div className="flex items-start justify-between">
                    <span className="font-editorial italic text-gold-dark group-hover:text-gold text-xl transition-colors duration-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight size={20} className="text-ink/30 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl lg:text-2xl tracking-tight text-ink group-hover:text-white transition-colors duration-500">{c.name}</h3>
                    <p className="text-xs text-slate2 group-hover:text-white/50 mt-2 uppercase tracking-[0.16em] transition-colors duration-500">
                      {brandsCount(c.id)} {brandsCount(c.id) === 1 ? "marca" : "marcas"}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <section className="py-24 lg:py-36 bg-white border-y border-[#E2E8F0]" data-testid="brands-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <SectionHead eyebrow="Marcas representadas" title="Um portfólio construído para o varejo." />
            <Reveal delay={0.2}>
              <Link to="/marcas" data-testid="brands-see-all"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline-gold pb-1 hover:text-gold-dark transition-colors duration-300">
                Ver todas as marcas <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
            {featured.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.04} className="bg-white">
                <Link to={`/produtos?marca=${b.id}`} data-testid={`brand-card-${i}`}
                  className="group flex flex-col items-start justify-between p-8 min-h-[200px] hover:bg-[#FAFAFA] transition-colors duration-500 h-full">
                  <span className="w-12 h-12 border border-ink/15 group-hover:border-gold group-hover:bg-gold group-hover:text-ink flex items-center justify-center font-display font-extrabold text-ink text-sm tracking-tight transition-colors duration-500">
                    {brandMonogram(b.name)}
                  </span>
                  <div className="mt-8">
                    <h3 className="font-display font-bold text-lg tracking-tight text-ink leading-tight">{b.name}</h3>
                    <p className="text-xs text-slate2 mt-1.5 uppercase tracking-[0.14em]">{catName(b.category_id) || "Categoria em definição"}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUE COMERCIAL */}
      <section className="bg-ink text-white dark-grid-lines noise-overlay relative py-24 lg:py-36" data-testid="commercial-cta-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7">
            <SectionHead dark eyebrow="Departamento comercial" title="Receba o catálogo completo e as condições para revenda."
              description="Conte para a gente o perfil da sua loja e receba o catálogo organizado, novidades e atendimento personalizado direto no seu WhatsApp." />
            <Reveal delay={0.25}>
              <ul className="mt-10 space-y-4">
                {["Catálogo organizado por marca e categoria", "Consultoria para escolher o mix ideal", "Novidades e reposições em primeira mão"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-6 h-6 border border-gold/50 flex items-center justify-center shrink-0">
                      <Check size={13} className="text-gold" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <CatalogMiniForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SEGMENTOS */}
      <section className="py-24 lg:py-36" data-testid="segments-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHead eyebrow="Para quem trabalhamos" title="Soluções para cada tipo de negócio."
            description="Atendemos compradores profissionais de diferentes segmentos, com o mix de produtos adequado para cada ponto de venda." />
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
            {SEGMENTS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.04} className="bg-[#FAFAFA]">
                <div className="group p-8 lg:p-10 flex flex-col gap-6 hover:bg-ink transition-colors duration-500 h-full" data-testid={`segment-card-${i}`}>
                  <s.icon size={26} strokeWidth={1.5} className="text-gold-dark group-hover:text-gold transition-colors duration-500" />
                  <p className="font-display font-bold text-base lg:text-lg tracking-tight text-ink group-hover:text-white transition-colors duration-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIANÇA */}
      <section className="py-24 lg:py-32 bg-gold-pale/40 border-y border-[#E8DCC0]" data-testid="trust-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-editorial italic text-2xl md:text-3xl lg:text-4xl text-ink leading-snug text-balance">
                “A ponte entre grandes marcas e o seu ponto de venda — com atendimento próximo e produtos que giram.”
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-sm text-slate2">
                {settings.representative} · {settings.company_name}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-[#E8DCC0] border border-[#E8DCC0]">
            <Reveal className="bg-[#FAFAFA]">
              <div className="p-8 text-center" data-testid="trust-stat-brands">
                <span className="block font-display font-extrabold text-5xl text-ink tracking-tighter">{settings.stat_brands || brands.length || "—"}</span>
                <span className="block text-xs uppercase tracking-[0.18em] text-slate2 mt-2">marcas representadas</span>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="bg-[#FAFAFA]">
              <div className="p-8 text-center" data-testid="trust-stat-categories">
                <span className="block font-display font-extrabold text-5xl text-ink tracking-tighter">{settings.stat_categories || categories.length || "—"}</span>
                <span className="block text-xs uppercase tracking-[0.18em] text-slate2 mt-2">categorias atendidas</span>
              </div>
            </Reveal>
            {settings.stat_regions && (
              <Reveal delay={0.12} className="bg-[#FAFAFA]">
                <div className="p-8 text-center" data-testid="trust-stat-regions">
                  <span className="block font-display font-extrabold text-5xl text-ink tracking-tighter">{settings.stat_regions}</span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate2 mt-2">regiões atendidas</span>
                </div>
              </Reveal>
            )}
            {settings.stat_years && (
              <Reveal delay={0.16} className="bg-[#FAFAFA]">
                <div className="p-8 text-center" data-testid="trust-stat-years">
                  <span className="block font-display font-extrabold text-5xl text-ink tracking-tighter">{settings.stat_years}</span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate2 mt-2">anos de experiência</span>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      {settings.address && (
        <section className="py-24 lg:py-32 bg-white border-y border-[#E2E8F0]" data-testid="home-map-section">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <SectionHead eyebrow="Nosso escritório" title="Estamos em Manaus, perto de você."
                description="Atendimento presencial para lojistas e parceiros comerciais — ou chame no WhatsApp e resolva tudo sem sair da loja." />
              <Reveal delay={0.2}>
                <ul className="mt-8 space-y-4 text-sm text-slate2">
                  <li className="flex items-start gap-3" data-testid="home-map-address">
                    <MapPin size={17} className="text-gold-dark shrink-0 mt-0.5" /> {settings.address}
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock size={17} className="text-gold-dark shrink-0" /> {settings.business_hours}
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={17} className="text-gold-dark shrink-0" /> {settings.phone_display}
                  </li>
                </ul>
              </Reveal>
              <Reveal delay={0.25}>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                  target="_blank" rel="noopener noreferrer" data-testid="home-map-directions"
                  className="inline-flex items-center gap-2 mt-8 border border-ink/25 text-ink font-semibold px-7 py-4 text-sm hover:border-gold hover:text-gold-dark transition-colors duration-300">
                  Como chegar <ArrowUpRight size={16} />
                </a>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <div className="border border-[#E2E8F0] bg-[#FAFAFA] p-2 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
                  <iframe
                    title={`Mapa — escritório ${settings.company_name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=16&output=embed`}
                    className="w-full h-[380px] border-0 grayscale contrast-[1.05] hover:grayscale-0 transition-[filter] duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* FAQ PREVIEW */}
      <section className="py-24 lg:py-36" data-testid="faq-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Perguntas frequentes" title="Tudo o que o lojista precisa saber."
              description="Respostas diretas sobre catálogos, condições comerciais e atendimento." />
            <Reveal delay={0.25}>
              <Link to="/faq" data-testid="faq-see-all"
                className="inline-flex items-center gap-2 mt-10 text-sm font-semibold text-ink underline-gold pb-1 hover:text-gold-dark transition-colors duration-300">
                Ver todas as perguntas <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="border-t border-[#E2E8F0]">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.id} value={f.id} className="border-b border-[#E2E8F0]">
                    <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left font-display font-bold text-lg tracking-tight text-ink hover:text-gold-dark hover:no-underline py-6 transition-colors duration-300">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate2 text-sm leading-relaxed pb-6">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-ink text-white dark-grid-lines noise-overlay relative py-28 lg:py-40" data-testid="final-cta-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold mb-8">Vamos conversar?</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display font-extrabold tracking-tighter leading-[0.95] text-4xl md:text-6xl lg:text-7xl max-w-4xl mx-auto text-balance">
              Sua loja merece um parceiro que entende de varejo.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link to="/solicitar-catalogo" data-testid="final-cta-catalog"
                className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-8 py-4 text-sm hover:bg-white transition-colors duration-300">
                Solicitar catálogo <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
              <a href={waLink(settings)} target="_blank" rel="noopener noreferrer" data-testid="final-cta-whatsapp"
                className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-8 py-4 text-sm hover:border-gold hover:text-gold transition-colors duration-300">
                <MessageCircle size={16} /> Falar no WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
