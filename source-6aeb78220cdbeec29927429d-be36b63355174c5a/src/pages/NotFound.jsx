import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useSettings, waLink, usePageMeta } from "@/lib/site";
import { MaskedLine } from "@/components/site/Reveal";

export default function NotFound() {
  const settings = useSettings();
  usePageMeta("Página não encontrada", "A página que você procura não existe ou foi movida.");

  return (
    <div data-testid="not-found-page" className="pt-[72px] min-h-[80vh] hero-grid-lines flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 w-full">
        <p className="font-editorial italic text-gold-dark text-2xl mb-6">Erro 404</p>
        <h1 className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(3rem,9vw,7rem)]">
          <MaskedLine delay={0.15}>Esta página saiu</MaskedLine>
          <MaskedLine delay={0.28}>do <span className="text-gold-dark font-editorial italic font-medium">estoque.</span></MaskedLine>
        </h1>
        <p className="mt-8 text-slate2 text-base max-w-md leading-relaxed">
          O endereço que você acessou não existe ou foi movido. Que tal voltar para a vitrine?
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/" data-testid="not-found-home"
            className="inline-flex items-center gap-2 bg-ink text-white font-semibold px-7 py-4 text-sm hover:bg-gold hover:text-ink transition-colors duration-300">
            <ArrowLeft size={16} /> Voltar ao início
          </Link>
          <a href={waLink(settings)} target="_blank" rel="noopener noreferrer" data-testid="not-found-whatsapp"
            className="inline-flex items-center gap-2 border border-ink/25 text-ink font-semibold px-7 py-4 text-sm hover:border-gold hover:text-gold-dark transition-colors duration-300">
            <MessageCircle size={16} /> Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
