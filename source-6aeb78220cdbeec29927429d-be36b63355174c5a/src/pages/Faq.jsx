import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useSettings, waLink, usePageMeta } from "@/lib/site";
import { Reveal, MaskedLine } from "@/components/site/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Faq() {
  const settings = useSettings();
  const [faqs, setFaqs] = useState([]);

  usePageMeta("Perguntas Frequentes", "Tire dúvidas sobre catálogos, condições comerciais, pedido mínimo, regiões atendidas e atendimento da 2K Representações.");

  useEffect(() => {
    let cancelled = false;
    api.get("/faqs").then(({ data }) => {
      if (cancelled) return;
      setFaqs(data);
      if (data.length) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "faq-jsonld";
        script.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        });
        document.head.appendChild(script);
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
      document.getElementById("faq-jsonld")?.remove();
    };
  }, []);

  return (
    <div data-testid="faq-page" className="pt-[72px]">
      <section className="hero-grid-lines py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8">
            <span className="w-10 h-px bg-gold-dark" /> Perguntas frequentes
          </motion.p>
          <h1 data-testid="faq-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.6rem,6vw,5rem)] max-w-4xl">
            <MaskedLine delay={0.2}>Dúvidas respondidas,</MaskedLine>
            <MaskedLine delay={0.33}>sem <span className="text-gold-dark font-editorial italic font-medium">letras miúdas.</span></MaskedLine>
          </h1>
        </div>
      </section>

      <section className="pb-24 lg:pb-36">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <Reveal>
            <Accordion type="single" collapsible className="border-t border-[#E2E8F0]" data-testid="faq-accordion">
              {faqs.map((f, i) => (
                <AccordionItem key={f.id} value={f.id} className="border-b border-[#E2E8F0]">
                  <AccordionTrigger data-testid={`faq-page-trigger-${i}`}
                    className="text-left font-display font-bold text-lg lg:text-xl tracking-tight text-ink hover:text-gold-dark hover:no-underline py-7 transition-colors duration-300">
                    <span className="flex items-baseline gap-4">
                      <span className="font-editorial italic text-gold-dark text-base shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      {f.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate2 text-sm md:text-base leading-relaxed pb-7 pl-10">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-16 bg-ink text-white dark-grid-lines noise-overlay relative p-10 lg:p-14 text-center">
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">Não encontrou sua resposta?</h2>
              <p className="text-white/60 text-sm mt-3">Nossa equipe comercial responde direto no WhatsApp.</p>
              <a href={waLink(settings, "Olá! Tenho uma dúvida que não encontrei no FAQ do site.")} target="_blank" rel="noopener noreferrer"
                data-testid="faq-whatsapp-cta"
                className="inline-flex items-center gap-2 mt-7 bg-gold text-ink font-semibold px-8 py-4 text-sm hover:bg-white transition-colors duration-300">
                <MessageCircle size={16} /> Falar com um consultor
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
