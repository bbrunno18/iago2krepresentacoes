import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CrudDialog, Field, inputCls, useCrud, AddButton, RowActions, Loading, EmptyState } from "./CrudShared";

const EMPTY = { name: "", description: "", brand_id: "", category_id: "", image_url: "", featured: false };

export default function ProductsTab() {
  const { items, save, remove } = useCrud("admin/products");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    Promise.all([api.get("/brands"), api.get("/categories")])
      .then(([b, c]) => { setBrands(b.data); setCategories(c.data); })
      .catch(() => {});
  }, []);

  const brandName = (id) => brands.find((b) => b.id === id)?.name || "—";
  const catName = (id) => categories.find((c) => c.id === id)?.name || "—";

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description || "", brand_id: p.brand_id || "", category_id: p.category_id || "", image_url: p.image_url || "", featured: !!p.featured });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (await save(form, editing)) setOpen(false);
  };

  return (
    <div data-testid="products-tab">
      <AddButton onClick={openNew} label="Novo produto" testid="product-add" />
      {items === null ? <Loading /> : items.length === 0 ? <EmptyState text="Nenhum produto cadastrado ainda. Adicione produtos reais dos catálogos das marcas." /> : (
        <div className="bg-white border border-[#E2E8F0] overflow-x-auto">
          <table className="w-full text-sm" data-testid="products-table">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[10px] uppercase tracking-[0.16em] text-slate2">
                <th className="px-5 py-4 font-semibold">Produto</th>
                <th className="px-5 py-4 font-semibold">Marca</th>
                <th className="px-5 py-4 font-semibold">Categoria</th>
                <th className="px-5 py-4 font-semibold">Destaque</th>
                <th className="px-5 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#FAFAFA]" data-testid={`product-row-${p.id}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-10 h-10 object-cover bg-[#F4F4F5]" loading="lazy" />
                      ) : (
                        <span className="w-10 h-10 bg-[#F4F4F5] block" />
                      )}
                      <p className="font-semibold text-ink">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate2">{brandName(p.brand_id)}</td>
                  <td className="px-5 py-4 text-xs text-slate2">{catName(p.category_id)}</td>
                  <td className="px-5 py-4">
                    {p.featured ? <span className="text-[10px] font-bold uppercase bg-gold/15 text-gold-dark px-2 py-1">Destaque</span> : <span className="text-xs text-slate2/50">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <RowActions testid={`product-${p.id}`} onEdit={() => openEdit(p)}
                      onDelete={() => window.confirm(`Excluir o produto "${p.name}"?`) && remove(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CrudDialog open={open} onClose={() => setOpen(false)} title={editing ? "Editar produto" : "Novo produto"} onSubmit={submit} testid="product-dialog">
        <Field label="Nome do produto *">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} data-testid="product-input-name" />
        </Field>
        <Field label="Breve descrição">
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} data-testid="product-input-description" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Marca">
            <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className={inputCls} data-testid="product-input-brand">
              <option value="">Sem marca</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Categoria">
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls} data-testid="product-input-category">
              <option value="">Sem categoria</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="URL da imagem">
          <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://..." data-testid="product-input-image" />
        </Field>
        <Field label="Destaque">
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[#C5A059]" data-testid="product-input-featured" />
            <span className="text-sm text-slate2">Produto em destaque</span>
          </label>
        </Field>
      </CrudDialog>
    </div>
  );
}
