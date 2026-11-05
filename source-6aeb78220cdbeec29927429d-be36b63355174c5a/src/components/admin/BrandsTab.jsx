import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DriveSync from "./DriveSync";
import { CrudDialog, Field, inputCls, useCrud, AddButton, RowActions, Loading, EmptyState } from "./CrudShared";

const EMPTY = { name: "", description: "", category_id: "", image_url: "", catalog_url: "", featured: false, order: 0 };

export default function BrandsTab() {
  const { items, save, remove } = useCrud("admin/brands");
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const catName = (id) => categories.find((c) => c.id === id)?.name || "—";

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ name: b.name, description: b.description || "", category_id: b.category_id || "", image_url: b.image_url || "", catalog_url: b.catalog_url || "", featured: !!b.featured, order: b.order || 0 });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (await save({ ...form, order: Number(form.order) || 0 }, editing)) setOpen(false);
  };

  return (
    <div data-testid="brands-tab">
      <DriveSync onSynced={() => window.location.reload()} />
      <AddButton onClick={openNew} label="Nova marca" testid="brand-add" />
      {items === null ? <Loading /> : items.length === 0 ? <EmptyState text="Nenhuma marca cadastrada." /> : (
        <div className="bg-white border border-[#E2E8F0] overflow-x-auto">
          <table className="w-full text-sm" data-testid="brands-table">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[10px] uppercase tracking-[0.16em] text-slate2">
                <th className="px-5 py-4 font-semibold">Marca</th>
                <th className="px-5 py-4 font-semibold">Categoria</th>
                <th className="px-5 py-4 font-semibold">Destaque</th>
                <th className="px-5 py-4 font-semibold">Ordem</th>
                <th className="px-5 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#FAFAFA]" data-testid={`brand-row-${b.id}`}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{b.name}</p>
                    {b.description && <p className="text-xs text-slate2 line-clamp-1 max-w-xs">{b.description}</p>}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate2">{catName(b.category_id)}</td>
                  <td className="px-5 py-4">
                    {b.featured ? <span className="text-[10px] font-bold uppercase bg-gold/15 text-gold-dark px-2 py-1">Destaque</span> : <span className="text-xs text-slate2/50">—</span>}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate2">{b.order}</td>
                  <td className="px-5 py-4">
                    <RowActions testid={`brand-${b.id}`} onEdit={() => openEdit(b)}
                      onDelete={() => window.confirm(`Excluir a marca "${b.name}"?`) && remove(b.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CrudDialog open={open} onClose={() => setOpen(false)} title={editing ? "Editar marca" : "Nova marca"} onSubmit={submit} testid="brand-dialog">
        <Field label="Nome da marca *">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} data-testid="brand-input-name" />
        </Field>
        <Field label="Descrição curta">
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} data-testid="brand-input-description" />
        </Field>
        <Field label="Categoria">
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls} data-testid="brand-input-category">
            <option value="">Sem categoria</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="URL do logo / imagem">
          <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://..." data-testid="brand-input-image" />
        </Field>
        <Field label="Link do catálogo (Drive, PDF...)">
          <input type="url" value={form.catalog_url} onChange={(e) => setForm({ ...form, catalog_url: e.target.value })} className={inputCls} placeholder="https://..." data-testid="brand-input-catalog" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ordem de exibição">
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputCls} data-testid="brand-input-order" />
          </Field>
          <Field label="Destacar na home">
            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[#C5A059]" data-testid="brand-input-featured" />
              <span className="text-sm text-slate2">Destaque</span>
            </label>
          </Field>
        </div>
      </CrudDialog>
    </div>
  );
}
