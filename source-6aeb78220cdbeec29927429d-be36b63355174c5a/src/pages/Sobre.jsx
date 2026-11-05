import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MessageCircle, Handshake, Compass, Users, Target } from "lucide-react";
import { useSettings, waLink, usePageMeta } from "@/lib/site";
import { Reveal, MaskedLine, SectionHead } from "@/components/site/Reveal";

const HANDSHAKE_IMG = "https://images.pexels.com/photos/6814524/pexels-photo-6814524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const VALUES = [
  { icon: Handshake, t: "Relacionamento primeiro", d: "Construímos parcerias de longo prazo com fornecedores e clientes, baseadas em confiança e resultado." },
  { icon: Compass, t: "Conhecimento de mercado", d: "Acompanhamos o varejo de perto para apresentar produtos com real potencial de venda em cada segmento." },
  { icon: Users, t: "Atendimento personalizado", d: "Cada loja tem um perfil. Nosso atendimento é consultivo e adaptado à realidade do seu negócio." },
  { icon: Target, t: "Compromisso com bons negócios", d: "Trabalhamos para que cada pedido faça sentido: produto certo, na loja certa, na hora certa." },
];

export default function Sobre() {
  const settings = useSettings();
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  usePageMeta("Sobre a Empresa", "Conheça a 2K Representações: representação comercial com curadoria de produtos, atendimento consultivo e foco em lojistas, atacadistas e empresas.");

  return (
    <div data-testid="about-page" className="pt-[72px]">
      <section className="hero-grid-lines py-20 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8">
            <span className="w-10 h-px bg-gold-dark" /> Sobre a empresa
          </motion.p>
          <h1 data-testid="about-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.6rem,6.5vw,5.5rem)] max-w-5xl">
            <MaskedLine delay={0.2}>A ponte entre grandes marcas</MaskedLine>
            <MaskedLine delay={0.33}>e o seu <span className="text-gold-dark font-editorial italic font-medium">ponto de venda.</span></MaskedLine>
          </h1>
        </div>
      </section>

      <section className="pb-24 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="text-lg md:text-xl text-ink leading-relaxed font-medium">
                {settings.about_text || "A 2K Representações atua como ponte entre fabricantes, importadores e compradores profissionais, com atendimento próximo, consultivo e personalizado."}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-base text-slate2 leading-relaxed">
                Nosso trabalho é simplificar a compra no atacado: organizamos catálogos, apresentamos novidades e reposições e ajudamos o lojista a encontrar os produtos adequados para o seu público — de utilidades domésticas a materiais elétricos, cosméticos, itens de limpeza e muito mais.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 border border-[#E2E8F0] bg-white p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-gold-dark font-semibold mb-4">Informações institucionais</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                  <div>
                    <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">Empresa</dt>
                    <dd className="font-semibold text-ink" data-testid="about-company-name">{settings.company_name}</dd>
                  </div>
                  <div>
                    <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">Responsável comercial</dt>
                    <dd className="font-semibold text-ink" data-testid="about-representative">{settings.representative}</dd>
                  </div>
                  <div>
                    <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">WhatsApp comercial</dt>
                    <dd className="font-semibold text-ink" data-testid="about-phone">{settings.phone_display}</dd>
                  </div>
                  {settings.cnpj && (
                    <div>
                      <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">CNPJ</dt>
                      <dd className="font-semibold text-ink" data-testid="about-cnpj">{settings.cnpj}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">Horário de atendimento</dt>
                    <dd className="font-semibold text-ink" data-testid="about-hours">{settings.business_hours}</dd>
                  </div>
                  {settings.email && (
                    <div>
                      <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">E-mail</dt>
                      <dd className="font-semibold text-ink">{settings.email}</dd>
                    </div>
                  )}
                  {settings.address && (
                    <div>
                      <dt className="text-slate2 text-xs uppercase tracking-wider mb-1">Endereço</dt>
                      <dd className="font-semibold text-ink">{settings.address}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-6 text-xs text-slate2/70 italic">História, fundação, equipe e redes sociais: campos editáveis no painel administrativo.</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6" ref={imgRef}>
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden">
                <motion.img src={HANDSHAKE_IMG} alt="Aperto de mãos representando parceria comercial entre empresas"
                  style={{ y: imgY }} className="w-full h-[380px] lg:h-[520px] object-cover scale-110" loading="lazy" />
                <span className="absolute top-4 left-4 bg-ink text-gold text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2.5">
                  Parceria estratégica
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink text-white dark-grid-lines noise-overlay relative py-24 lg:py-36" data-testid="about-values">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHead dark eyebrow="Como trabalhamos" title="O que você pode esperar da nossa parceria." />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.06} className="bg-ink">
                <div className="p-8 lg:p-10 h-full group hover:bg-[#16203a] transition-colors duration-500" data-testid={`about-value-${i}`}>
                  <v.icon size={26} strokeWidth={1.5} className="text-gold" />
                  <h3 className="font-display font-bold text-lg tracking-tight mt-6 group-hover:text-gold transition-colors duration-500">{v.t}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mt-3">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <h2 className="font-display font-extrabold tracking-tighter leading-[0.95] text-4xl md:text-5xl text-ink text-balance max-w-3xl mx-auto">
              Vamos encontrar os produtos certos para a sua loja?
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href={waLink(settings, "Olá! Li sobre a 2K Representações e quero conversar sobre produtos para minha loja.")}
                target="_blank" rel="noopener noreferrer" data-testid="about-cta-whatsapp"
                className="inline-flex items-center gap-2 bg-ink text-white font-semibold px-8 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300">
                <MessageCircle size={16} /> Fale com um consultor
              </a>
              <Link to="/marcas" data-testid="about-cta-brands"
                className="inline-flex items-center gap-2 border border-ink/25 text-ink font-semibold px-8 py-4 text-sm hover:border-gold hover:text-gold-dark transition-colors duration-300">
                Conheça nossas marcas <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
