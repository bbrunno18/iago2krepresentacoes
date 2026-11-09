import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, PackageSearch, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { useSettings, waLink, usePageMeta, brandMonogram } from "@/lib/site";
import { Reveal, MaskedLine } from "@/components/site/Reveal";

export default function Marcas() {
  const settings = useSettings();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("todas");
  const [loading, setLoading] = useState(true);

  usePageMeta("Marcas Representadas", "Conheça as marcas representadas pela 2K Representações: utilidades domésticas, materiais elétricos, maquiagem, vidros, incensos, limpeza e mais para lojistas e atacadistas.");

  useEffect(() => {
    Promise.all([api.get("/brands"), api.get("/categories")])
      .then(([b, c]) => { setBrands(b.data); setCategories(c.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const catName = (id) => categories.find((c) => c.id === id)?.name || "Categoria em definição";

  const filtered = useMemo(
    () => (filter === "todas" ? brands : brands.filter((b) => b.category_id === filter)),
    [brands, filter]
  );

  return (
    <div data-testid="brands-page" className="pt-[72px]">
      <section className="hero-grid-lines py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8">
            <span className="w-10 h-px bg-gold-dark" /> Portfólio
          </motion.p>
          <h1 data-testid="brands-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.6rem,6vw,5rem)] max-w-4xl">
            <MaskedLine delay={0.2}>Marcas que dão <span className="text-gold-dark font-editorial italic font-medium">giro</span></MaskedLine>
            <MaskedLine delay={0.33}>na sua loja.</MaskedLine>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-slate2 max-w-2xl leading-relaxed">
            {settings.stat_brands || brands.length} marcas representadas, organizadas por categoria. Filtre, conheça e solicite o catálogo de cada uma.
          </motion.p>
        </div>
      </section>

      <section className="pb-24 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-2 mb-12" role="group" aria-label="Filtrar marcas por categoria" data-testid="brands-filter">
            <button onClick={() => setFilter("todas")} data-testid="brands-filter-all"
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] border transition-colors duration-300 ${
                filter === "todas" ? "bg-ink text-white border-ink" : "bg-white text-slate2 border-[#E2E8F0] hover:border-gold hover:text-ink"
              }`}>
              Todas
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setFilter(c.id)} data-testid={`brands-filter-${c.id}`}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] border transition-colors duration-300 ${
                  filter === c.id ? "bg-ink text-white border-ink" : "bg-white text-slate2 border-[#E2E8F0] hover:border-gold hover:text-ink"
                }`}>
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-10 min-h-[260px] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-[#E2E8F0] bg-white p-16 text-center" data-testid="brands-empty">
              <PackageSearch size={32} className="mx-auto text-gold-dark mb-4" />
              <p className="font-display font-bold text-xl text-ink">Nenhuma marca nesta categoria ainda.</p>
              <p className="text-sm text-slate2 mt-2">Fale conosco para conhecer o portfólio completo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
              {filtered.map((b, i) => (
                <Reveal key={b.id} delay={(i % 3) * 0.06} className="bg-white">
                  <article className="group p-8 lg:p-10 flex flex-col h-full min-h-[300px] hover:bg-[#FAFAFA] transition-colors duration-500" data-testid={`brand-item-${i}`}>
                    <div className="flex items-start justify-between">
                      {b.image_url ? (
                        <img src={b.image_url} alt={`Logo da marca ${b.name}`} className="h-12 w-auto object-contain" loading="lazy" />
                      ) : (
                        <span className="w-14 h-14 border border-ink/15 group-hover:border-gold group-hover:bg-gold flex items-center justify-center font-display font-extrabold text-ink text-base tracking-tight transition-colors duration-500">
                          {brandMonogram(b.name)}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate2 border border-[#E2E8F0] px-3 py-1.5">
                        {catName(b.category_id)}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl tracking-tight text-ink mt-8">{b.name}</h2>
                    <p className="text-sm text-slate2 leading-relaxed mt-3 flex-1">
                      {b.description || <span className="italic text-slate2/70">Descrição em atualização — conteúdo editável pelo painel.</span>}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-8">
                      {b.catalog_url && (
                        <a href={b.catalog_url} target="_blank" rel="noopener noreferrer" data-testid={`brand-catalog-${i}`}
                          className="inline-flex items-center gap-1.5 bg-gold text-ink text-xs font-semibold px-5 py-3 hover:bg-ink hover:text-white transition-colors duration-300">
                          <BookOpen size={14} /> Ver catálogo
                        </a>
                      )}
                      <Link to={`/produtos?marca=${b.id}`} data-testid={`brand-products-${i}`}
                        className="inline-flex items-center gap-1.5 bg-ink text-white text-xs font-semibold px-5 py-3 hover:bg-gold hover:text-ink transition-colors duration-300">
                        Ver produtos <ArrowUpRight size={14} />
                      </Link>
                      <a href={waLink(settings, `Olá! Gostaria de informações sobre a marca ${b.name}.`)} target="_blank" rel="noopener noreferrer"
                        data-testid={`brand-info-${i}`}
                        className="inline-flex items-center gap-1.5 border border-ink/20 text-ink text-xs font-semibold px-5 py-3 hover:border-gold hover:text-gold-dark transition-colors duration-300">
                        <MessageCircle size={14} /> Solicitar informações
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
