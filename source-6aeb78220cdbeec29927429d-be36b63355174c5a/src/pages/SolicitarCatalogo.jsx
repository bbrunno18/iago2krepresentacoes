import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, MessageCircle, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useSettings, waLink, usePageMeta } from "@/lib/site";
import { Reveal, MaskedLine, EASE } from "@/components/site/Reveal";

const BUSINESS_TYPES = [
  "Loja de variedades", "Utilidades domésticas", "Materiais elétricos", "Cosméticos e maquiagem",
  "Presentes e decoração", "Supermercado", "Atacadista / Distribuidor", "Outro",
];

const UF = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const inputCls = "w-full border border-[#E2E8F0] bg-[#FAFAFA] px-4 py-3.5 text-sm text-ink placeholder:text-slate2/50 focus:border-gold outline-none transition-colors duration-300";
const labelCls = "block text-xs font-semibold uppercase tracking-[0.16em] text-ink mb-2";

export default function SolicitarCatalogo() {
  const settings = useSettings();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", company: "", city: "", state: "", whatsapp: "", email: "", business_type: "", message: "" });
  const [interests, setInterests] = useState([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  usePageMeta("Solicite um Catálogo", "Solicite o catálogo completo da 2K Representações: marcas, categorias e condições comerciais para lojistas, atacadistas e empresas.");

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const toggleInterest = (name) =>
    setInterests((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Informe seu nome.";
    if (form.whatsapp.replace(/\D/g, "").length < 10) errs.whatsapp = "Informe um WhatsApp válido com DDD.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "E-mail inválido.";
    if (!consent) errs.consent = "É necessário autorizar o contato para continuar.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Verifique os campos destacados.");
      return;
    }
    setStatus("sending");
    try {
      await api.post("/requests", { type: "catalog", ...form, interests, consent });
      setStatus("done");
      window.scrollTo(0, 0);
    } catch (err) {
      setStatus("idle");
      toast.error(formatApiError(err));
    }
  };

  return (
    <div data-testid="catalog-page" className="pt-[72px]">
      <section className="hero-grid-lines py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8">
            <span className="w-10 h-px bg-gold-dark" /> Solicite um catálogo
          </motion.p>
          <h1 data-testid="catalog-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.6rem,6vw,5rem)] max-w-4xl">
            <MaskedLine delay={0.2}>O catálogo certo,</MaskedLine>
            <MaskedLine delay={0.33}>direto no seu <span className="text-gold-dark font-editorial italic font-medium">WhatsApp.</span></MaskedLine>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-slate2 max-w-2xl leading-relaxed">
            Preencha os dados abaixo e nossa equipe comercial retorna com o catálogo, novidades e as condições para o seu perfil de negócio.
          </motion.p>
        </div>
      </section>

      <section className="pb-24 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            {status === "done" ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
                data-testid="catalog-form-success" className="border border-[#E2E8F0] bg-white p-10 lg:p-14">
                <span className="w-14 h-14 bg-gold text-ink flex items-center justify-center mb-6">
                  <Check size={26} strokeWidth={3} />
                </span>
                <h2 className="font-display font-extrabold text-3xl tracking-tight text-ink">Solicitação enviada com sucesso!</h2>
                <p className="text-slate2 text-sm leading-relaxed mt-4 max-w-md">
                  Recebemos seus dados e nossa equipe comercial entrará em contato em breve. Para agilizar, você pode chamar agora mesmo no WhatsApp.
                </p>
                <a href={waLink(settings, `Olá! Sou ${form.name}${form.company ? `, da empresa ${form.company},` : ""} e acabei de solicitar o catálogo pelo site.`)}
                  target="_blank" rel="noopener noreferrer" data-testid="catalog-success-whatsapp"
                  className="inline-flex items-center gap-2 mt-8 bg-ink text-white font-semibold px-7 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300">
                  <MessageCircle size={16} /> Agilizar pelo WhatsApp
                </a>
              </motion.div>
            ) : (
              <Reveal>
                <form onSubmit={submit} noValidate data-testid="catalog-form" className="border border-[#E2E8F0] bg-white p-8 lg:p-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="cf-name" className={labelCls}>Nome *</label>
                      <input id="cf-name" data-testid="catalog-input-name" type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Seu nome completo" />
                      {errors.name && <p className="text-xs text-red-600 mt-1.5" data-testid="catalog-error-name">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="cf-company" className={labelCls}>Nome da empresa</label>
                      <input id="cf-company" data-testid="catalog-input-company" type="text" value={form.company} onChange={set("company")} className={inputCls} placeholder="Sua loja ou empresa" />
                    </div>
                    <div>
                      <label htmlFor="cf-city" className={labelCls}>Cidade</label>
                      <input id="cf-city" data-testid="catalog-input-city" type="text" value={form.city} onChange={set("city")} className={inputCls} placeholder="Sua cidade" />
                    </div>
                    <div>
                      <label htmlFor="cf-state" className={labelCls}>Estado</label>
                      <select id="cf-state" data-testid="catalog-input-state" value={form.state} onChange={set("state")} className={inputCls}>
                        <option value="">Selecione</option>
                        {UF.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cf-whatsapp" className={labelCls}>WhatsApp *</label>
                      <input id="cf-whatsapp" data-testid="catalog-input-whatsapp" type="tel" value={form.whatsapp} onChange={set("whatsapp")} className={inputCls} placeholder="(00) 00000-0000" />
                      {errors.whatsapp && <p className="text-xs text-red-600 mt-1.5" data-testid="catalog-error-whatsapp">{errors.whatsapp}</p>}
                    </div>
                    <div>
                      <label htmlFor="cf-email" className={labelCls}>E-mail</label>
                      <input id="cf-email" data-testid="catalog-input-email" type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="voce@empresa.com.br" />
                      {errors.email && <p className="text-xs text-red-600 mt-1.5" data-testid="catalog-error-email">{errors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="cf-business" className={labelCls}>Tipo de negócio</label>
                      <select id="cf-business" data-testid="catalog-input-business" value={form.business_type} onChange={set("business_type")} className={inputCls}>
                        <option value="">Selecione o seu segmento</option>
                        {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <fieldset className="sm:col-span-2">
                      <legend className={labelCls}>Categorias de interesse</legend>
                      <div className="flex flex-wrap gap-2 mt-1" data-testid="catalog-interests">
                        {categories.map((c) => (
                          <button type="button" key={c.id} onClick={() => toggleInterest(c.name)}
                            data-testid={`catalog-interest-${c.id}`} aria-pressed={interests.includes(c.name)}
                            className={`px-4 py-2 text-xs font-semibold border transition-colors duration-300 ${
                              interests.includes(c.name) ? "bg-ink text-white border-ink" : "bg-[#FAFAFA] text-slate2 border-[#E2E8F0] hover:border-gold hover:text-ink"
                            }`}>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <div className="sm:col-span-2">
                      <label htmlFor="cf-message" className={labelCls}>Mensagem</label>
                      <textarea id="cf-message" data-testid="catalog-input-message" value={form.message} onChange={set("message")} rows={4}
                        className={`${inputCls} resize-none`} placeholder="Conte um pouco sobre sua loja e o que procura..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" data-testid="catalog-input-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#C5A059]" />
                        <span className="text-xs text-slate2 leading-relaxed group-hover:text-ink transition-colors duration-300">
                          Autorizo o contato da equipe comercial da {settings.company_name} via WhatsApp, telefone ou e-mail, conforme a LGPD. *
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-600 mt-1.5" data-testid="catalog-error-consent">{errors.consent}</p>}
                    </div>
                  </div>
                  <button type="submit" data-testid="catalog-submit" disabled={status === "sending"}
                    className="mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ink text-white font-semibold px-10 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-60">
                    {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} strokeWidth={2.5} />}
                    {status === "sending" ? "Enviando..." : "Solicitar catálogo"}
                  </button>
                </form>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="bg-ink text-white dark-grid-lines noise-overlay relative p-8 lg:p-12 lg:sticky lg:top-28">
                <p className="text-xs uppercase tracking-[0.24em] text-gold font-semibold mb-6">Prefere agilidade?</p>
                <h2 className="font-display font-extrabold text-3xl tracking-tight leading-tight">Chame direto no WhatsApp comercial.</h2>
                <p className="text-white/60 text-sm leading-relaxed mt-4">
                  Atendimento consultivo com {settings.representative}. Tire dúvidas, peça o catálogo e consulte condições na hora.
                </p>
                <a href={waLink(settings, "Olá! Gostaria de solicitar o catálogo de produtos.")} target="_blank" rel="noopener noreferrer"
                  data-testid="catalog-aside-whatsapp"
                  className="inline-flex items-center gap-2 mt-8 bg-gold text-ink font-semibold px-7 py-4 text-sm hover:bg-white transition-colors duration-300">
                  <MessageCircle size={16} /> {settings.phone_display}
                </a>
                <div className="mt-10 pt-8 border-t border-white/10 space-y-3 text-sm text-white/60">
                  <p>Resposta em horário comercial</p>
                  <p>Catálogo organizado por marca e categoria</p>
                  <p>Sem compromisso — consulte condições</p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </div>
  );
}
