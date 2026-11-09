import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, PackageSearch, Search, PackageOpen } from "lucide-react";
import { api } from "@/lib/api";
import { fetchBrands, fetchCategories } from "@/lib/catalog";
import { useSettings, waLink, usePageMeta, brandMonogram } from "@/lib/site";
import { Reveal, MaskedLine } from "@/components/site/Reveal";

export default function Produtos() {
  const settings = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [catalogFiles, setCatalogFiles] = useState([]);

  const activeBrand = searchParams.get("marca") || "";
  const activeCategory = searchParams.get("categoria") || "";

  usePageMeta("Produtos", "Catálogo de produtos para lojistas e atacadistas: busque por produto, filtre por marca e categoria e consulte condições comerciais com a 2K Representações.");

  useEffect(() => {
    fetchBrands().then(setBrands);
    fetchCategories().then(setCategories);
    api.get("/catalog-files").then(({ data }) => Array.isArray(data) && setCatalogFiles(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (query) params.q = query;
    if (activeBrand) params.brand_id = activeBrand;
    if (activeCategory) params.category_id = activeCategory;
    const t = setTimeout(() => {
      api.get("/products", { params })
        .then(({ data }) => setProducts(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query, activeBrand, activeCategory]);

  const brandName = (id) => brands.find((b) => b.id === id)?.name || "";
  const catName = (id) => categories.find((c) => c.id === id)?.name || "";

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const hasFilters = query || activeBrand || activeCategory;

  return (
    <div data-testid="products-page" className="pt-[72px]">
      <section className="hero-grid-lines py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark mb-8">
            <span className="w-10 h-px bg-gold-dark" /> Catálogo
          </motion.p>
          <h1 data-testid="products-headline" className="font-display font-extrabold tracking-tighter leading-[0.92] text-ink text-[clamp(2.6rem,6vw,5rem)] max-w-4xl">
            <MaskedLine delay={0.2}>Encontre produtos</MaskedLine>
            <MaskedLine delay={0.33}>para <span className="text-gold-dark font-editorial italic font-medium">revender.</span></MaskedLine>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-slate2 max-w-2xl leading-relaxed">
            Busque por nome, filtre por marca ou categoria e fale direto com nosso comercial. Preços, estoque e condições: consulte condições comerciais.
          </motion.p>
        </div>
      </section>

      <section className="pb-24 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Filtros */}
          <div className="border border-[#E2E8F0] bg-white p-5 lg:p-6 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center" data-testid="products-filters">
            <div className="lg:col-span-5 relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate2" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                data-testid="products-search" placeholder="Buscar produto pelo nome..."
                aria-label="Buscar produto pelo nome"
                className="w-full border border-[#E2E8F0] bg-[#FAFAFA] pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-slate2/60 focus:border-gold outline-none transition-colors duration-300" />
            </div>
            <div className="lg:col-span-3">
              <select value={activeBrand} onChange={(e) => setParam("marca", e.target.value)}
                data-testid="products-filter-brand" aria-label="Filtrar por marca"
                className="w-full border border-[#E2E8F0] bg-[#FAFAFA] px-4 py-3.5 text-sm text-ink focus:border-gold outline-none transition-colors duration-300">
                <option value="">Todas as marcas</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-3">
              <select value={activeCategory} onChange={(e) => setParam("categoria", e.target.value)}
                data-testid="products-filter-category" aria-label="Filtrar por categoria"
                className="w-full border border-[#E2E8F0] bg-[#FAFAFA] px-4 py-3.5 text-sm text-ink focus:border-gold outline-none transition-colors duration-300">
                <option value="">Todas as categorias</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-1 flex lg:justify-end">
              {hasFilters && (
                <button onClick={() => { setQuery(""); setSearchParams({}, { replace: true }); }}
                  data-testid="products-clear-filters"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark underline-gold pb-0.5">
                  Limpar
                </button>
              )}
            </div>
          </div>

          {catalogFiles.length > 0 && (
            <div className="mb-16" data-testid="catalog-files-section">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-gold-dark" /> Direto do nosso Google Drive
              </p>
              <h2 className="font-display font-extrabold tracking-tighter text-3xl md:text-4xl text-ink mb-8">Catálogos das marcas</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
                {catalogFiles.map((f, i) => (
                  <article key={f.id} className="bg-white group flex flex-col" data-testid={`catalog-file-${i}`}>
                    <div className="relative bg-[#F4F4F5] aspect-[4/3] overflow-hidden">
                      <img src={f.thumb_url} alt={`Capa do catálogo ${f.name}`} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      <span className="absolute top-3 left-3 bg-ink text-gold text-[9px] font-bold uppercase tracking-[0.18em] px-3 py-1.5">{f.kind || "PDF"}</span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-dark font-semibold">{brandName(f.brand_id) || "Catálogo"}</p>
                      <h3 className="font-display font-bold text-base tracking-tight text-ink mt-1.5 leading-snug flex-1">{f.name}</h3>
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                        <a href={f.view_url} target="_blank" rel="noopener noreferrer" data-testid={`catalog-open-${i}`}
                          className="inline-flex items-center justify-center gap-1.5 bg-ink text-white text-xs font-semibold px-4 py-3 hover:bg-gold hover:text-ink transition-colors duration-300">
                          Abrir catálogo <ArrowUpRight size={13} />
                        </a>
                        <a href={waLink(settings, `Olá! Vi o catálogo "${f.name}" no site e tenho interesse. Podem me passar as condições?`)}
                          target="_blank" rel="noopener noreferrer" data-testid={`catalog-interest-${i}`}
                          className="inline-flex items-center justify-center gap-1.5 border border-ink/15 text-ink text-xs font-semibold px-4 py-3 hover:border-gold hover:text-gold-dark transition-colors duration-300">
                          <MessageCircle size={13} /> Tenho interesse
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-white min-h-[320px] animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#E2E8F0] bg-white p-16 lg:p-24 text-center" data-testid="products-empty">
              <PackageOpen size={36} className="mx-auto text-gold-dark mb-5" strokeWidth={1.5} />
              <h2 className="font-display font-bold text-2xl text-ink tracking-tight">
                {hasFilters ? "Nenhum produto encontrado para esses filtros." : "Catálogo em atualização."}
              </h2>
              <p className="text-sm text-slate2 mt-3 max-w-md mx-auto leading-relaxed">
                {hasFilters
                  ? "Tente ajustar a busca ou fale com nosso comercial — nem todo o portfólio está listado no site."
                  : "Estamos cadastrando os produtos das nossas marcas. Enquanto isso, solicite o catálogo completo pelo WhatsApp."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a href={waLink(settings, "Olá! Gostaria de receber o catálogo completo de produtos.")} target="_blank" rel="noopener noreferrer"
                  data-testid="products-empty-whatsapp"
                  className="inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-7 py-3.5 hover:bg-gold hover:text-ink transition-colors duration-300">
                  <MessageCircle size={15} /> Pedir catálogo no WhatsApp
                </a>
                <Link to="/solicitar-catalogo" data-testid="products-empty-catalog"
                  className="inline-flex items-center gap-2 border border-ink/25 text-ink text-sm font-semibold px-7 py-3.5 hover:border-gold hover:text-gold-dark transition-colors duration-300">
                  Solicite o catálogo <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]" data-testid="products-grid">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.05} className="bg-white">
                  <article className="group flex flex-col h-full" data-testid={`product-card-${i}`}>
                    <div className="relative overflow-hidden bg-[#F4F4F5] aspect-[4/5]">
                      {p.image_url ? (
                        <img src={p.image_url} alt={`${p.name} — ${brandName(p.brand_id)}`} loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                          <PackageSearch size={30} strokeWidth={1.25} className="text-ink/20" />
                          <span className="font-display font-extrabold text-ink/25 text-3xl tracking-tighter">{brandMonogram(brandName(p.brand_id) || p.name)}</span>
                        </div>
                      )}
                      {p.featured && (
                        <span className="absolute top-3 left-3 bg-gold text-ink text-[9px] font-bold uppercase tracking-[0.18em] px-3 py-1.5">Destaque</span>
                      )}
                    </div>
                    <div className="p-5 lg:p-6 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-dark font-semibold">{brandName(p.brand_id) || "—"}</p>
                      <h2 className="font-display font-bold text-base lg:text-lg tracking-tight text-ink mt-1.5 leading-snug">{p.name}</h2>
                      {p.description && <p className="text-xs text-slate2 leading-relaxed mt-2 line-clamp-2">{p.description}</p>}
                      <p className="text-[11px] text-slate2/80 italic mt-3">Consulte condições comerciais</p>
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                        <a href={waLink(settings, `Olá! Tenho interesse no produto "${p.name}"${brandName(p.brand_id) ? ` da marca ${brandName(p.brand_id)}` : ""}. Podem me passar as condições?`)}
                          target="_blank" rel="noopener noreferrer" data-testid={`product-interest-${i}`}
                          className="inline-flex items-center justify-center gap-1.5 bg-ink text-white text-xs font-semibold px-4 py-3 hover:bg-gold hover:text-ink transition-colors duration-300">
                          Tenho interesse <ArrowUpRight size={13} />
                        </a>
                        <a href={waLink(settings, `Olá! Gostaria de consultar a disponibilidade do produto "${p.name}".`)}
                          target="_blank" rel="noopener noreferrer" data-testid={`product-availability-${i}`}
                          className="inline-flex items-center justify-center gap-1.5 border border-ink/15 text-ink text-xs font-semibold px-4 py-3 hover:border-gold hover:text-gold-dark transition-colors duration-300">
                          <MessageCircle size={13} /> Consultar disponibilidade
                        </a>
                      </div>
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
