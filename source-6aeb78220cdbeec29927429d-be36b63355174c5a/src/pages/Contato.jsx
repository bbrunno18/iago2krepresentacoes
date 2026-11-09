import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, MessageCircle, Phone, Mail, MapPin, Clock, Instagram, Facebook, Send } from "lucide-react";
import { toast } from "sonner";
import { formatApiError } from "@/lib/api";
import { submitRequest } from "@/lib/requests";
import { useSettings, waLink, usePageMeta } from "@/lib/site";
import { Reveal, MaskedLine, EASE } from "@/components/site/Reveal";

const inputCls = "w-full border border-[#E2E8F0] bg-[#FAFAFA] px-4 py-3.5 text-sm text-ink placeholder:text-slate2/50 focus:border-gold outline-none transition-colors duration-300";
const labelCls = "block text-xs font-semibold uppercase tracking-[0.16em] text-ink mb-2";

export default function Contato() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", company: "", whatsapp: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  usePageMeta("Fale Conosco", "Fale com o departamento comercial da 2K Representações: WhatsApp, telefone, e-mail e formulário de contato para lojistas e atacadistas.");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Informe seu nome.";
    if (form.whatsapp.replace(/\D/g, "").length < 10) errs.whatsapp = "Informe um WhatsApp válido com DDD.";
    if (!form.message.trim()) errs.message = "Escreva sua mensagem.";
    if (!consent) errs.consent = "É necessário autorizar o contato para continuar.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Verifique os campos destacados.");
      return;
    }
    setStatus("sending");
    try {
      await submitRequest({ type: "contact", ...form, consent, origin: "Página Fale conosco" });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      toast.error(formatApiError(err));
    }
  };

  const channels = [
    { icon: Phone, label: "WhatsApp / Telefone", value: settings.phone_display, href: waLink(settings), testid: "contact-channel-phone" },
    settings.email ? { icon: Mail, label: "E-mail", value: settings.email, href: `mailto:${settings.email}`, testid: "contact-channel-email" } : null,
    { icon: Clock, label: "Horário de atendimento", value: settings.business_hours, testid: "contact-channel-hours" },
    settings.address ? { icon: MapPin, label: "Endereço", value: settings.address, testid: "contact-channel-address" } : null,
  ].filter(Boolean);

  return (
    <div data-testid="contact-page" className="pt-[72px]">
      <section className="hero-grid-lines py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8">
            <span className="w-10 h-px bg-gold-dark" /> Fale conosco
          </motion.p>
          <h1 data-testid="contact-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.6rem,6vw,5rem)] max-w-4xl">
            <MaskedLine delay={0.2}>Atendimento rápido,</MaskedLine>
            <MaskedLine delay={0.33}>do jeito que o <span className="text-gold-dark font-editorial italic font-medium">varejo gosta.</span></MaskedLine>
          </h1>
        </div>
      </section>

      <section className="pb-24 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 space-y-px">
            <Reveal>
              <a href={waLink(settings, "Olá! Preciso de atendimento rápido.")} target="_blank" rel="noopener noreferrer"
                data-testid="contact-quick-whatsapp"
                className="flex items-center justify-between gap-4 bg-ink text-white p-7 hover:bg-gold hover:text-ink transition-colors duration-300 group">
                <div className="flex items-center gap-4">
                  <MessageCircle size={24} strokeWidth={1.75} />
                  <div>
                    <p className="font-display font-bold text-lg tracking-tight">Atendimento rápido</p>
                    <p className="text-xs opacity-60">Resposta em horário comercial</p>
                  </div>
                </div>
                <span className="font-display font-bold text-lg">{settings.phone_display}</span>
              </a>
            </Reveal>
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={0.06 * (i + 1)}>
                <div className="flex items-center gap-4 border border-[#E2E8F0] bg-white p-7" data-testid={c.testid}>
                  <c.icon size={20} strokeWidth={1.75} className="text-gold-dark shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate2 font-semibold">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                        className="font-semibold text-ink text-sm hover:text-gold-dark transition-colors duration-300">
                        {c.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-ink text-sm">{c.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
            {(settings.instagram || settings.facebook) && (
              <Reveal delay={0.3}>
                <div className="flex items-center gap-3 border border-[#E2E8F0] bg-white p-7" data-testid="contact-socials">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate2 font-semibold mr-2">Redes sociais</p>
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="contact-instagram"
                      className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center text-ink hover:border-gold hover:text-gold-dark transition-colors duration-300">
                      <Instagram size={17} />
                    </a>
                  )}
                  {settings.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-testid="contact-facebook"
                      className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center text-ink hover:border-gold hover:text-gold-dark transition-colors duration-300">
                      <Facebook size={17} />
                    </a>
                  )}
                </div>
              </Reveal>
            )}
            <Reveal delay={0.35}>
              <p className="text-xs text-slate2/70 italic pt-4">Endereço, e-mail e redes sociais são configuráveis no painel administrativo.</p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {status === "done" ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
                data-testid="contact-form-success" className="border border-[#E2E8F0] bg-white p-10 lg:p-14 h-full flex flex-col items-start justify-center">
                <span className="w-14 h-14 bg-gold text-ink flex items-center justify-center mb-6">
                  <Check size={26} strokeWidth={3} />
                </span>
                <h2 className="font-display font-extrabold text-3xl tracking-tight text-ink">Mensagem enviada!</h2>
                <p className="text-slate2 text-sm leading-relaxed mt-4 max-w-md">
                  Recebemos seu contato e retornaremos em breve. Se preferir, chame agora no WhatsApp.
                </p>
                <a href={waLink(settings, "Olá! Acabei de enviar uma mensagem pelo formulário de contato do site.")}
                  target="_blank" rel="noopener noreferrer" data-testid="contact-success-whatsapp"
                  className="inline-flex items-center gap-2 mt-8 bg-ink text-white font-semibold px-7 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300">
                  <MessageCircle size={16} /> Chamar no WhatsApp
                </a>
              </motion.div>
            ) : (
              <Reveal delay={0.1}>
                <form onSubmit={submit} noValidate data-testid="contact-form" className="border border-[#E2E8F0] bg-white p-8 lg:p-12">
                  <h2 className="font-display font-extrabold text-2xl tracking-tight text-ink mb-8">Envie sua mensagem</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="ct-name" className={labelCls}>Nome *</label>
                      <input id="ct-name" data-testid="contact-input-name" type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Seu nome" />
                      {errors.name && <p className="text-xs text-red-600 mt-1.5" data-testid="contact-error-name">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="ct-company" className={labelCls}>Empresa</label>
                      <input id="ct-company" data-testid="contact-input-company" type="text" value={form.company} onChange={set("company")} className={inputCls} placeholder="Sua loja ou empresa" />
                    </div>
                    <div>
                      <label htmlFor="ct-whatsapp" className={labelCls}>WhatsApp *</label>
                      <input id="ct-whatsapp" data-testid="contact-input-whatsapp" type="tel" value={form.whatsapp} onChange={set("whatsapp")} className={inputCls} placeholder="(00) 00000-0000" />
                      {errors.whatsapp && <p className="text-xs text-red-600 mt-1.5" data-testid="contact-error-whatsapp">{errors.whatsapp}</p>}
                    </div>
                    <div>
                      <label htmlFor="ct-email" className={labelCls}>E-mail</label>
                      <input id="ct-email" data-testid="contact-input-email" type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="voce@empresa.com.br" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="ct-message" className={labelCls}>Mensagem *</label>
                      <textarea id="ct-message" data-testid="contact-input-message" value={form.message} onChange={set("message")} rows={5}
                        className={`${inputCls} resize-none`} placeholder="Como podemos ajudar?" />
                      {errors.message && <p className="text-xs text-red-600 mt-1.5" data-testid="contact-error-message">{errors.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" data-testid="contact-input-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#C5A059]" />
                        <span className="text-xs text-slate2 leading-relaxed group-hover:text-ink transition-colors duration-300">
                          Autorizo o contato da equipe comercial, conforme a LGPD. *
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-600 mt-1.5" data-testid="contact-error-consent">{errors.consent}</p>}
                    </div>
                  </div>
                  <button type="submit" data-testid="contact-submit" disabled={status === "sending"}
                    className="mt-10 inline-flex items-center justify-center gap-2 bg-ink text-white font-semibold px-10 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-60">
                    {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                    {status === "sending" ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {settings.address && (
        <section className="pb-24 lg:pb-36" data-testid="contact-map-section">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <Reveal>
              <div className="border border-[#E2E8F0] bg-white p-2">
                <iframe
                  title={`Mapa — ${settings.address}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=16&output=embed`}
                  className="w-full h-[400px] border-0 grayscale contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="text-xs text-slate2 mt-3 flex items-center gap-2" data-testid="contact-map-address">
                <MapPin size={13} className="text-gold-dark" /> {settings.address}
              </p>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
