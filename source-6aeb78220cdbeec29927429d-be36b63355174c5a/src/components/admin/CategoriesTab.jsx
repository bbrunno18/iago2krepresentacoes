import { useState } from "react";
import { CrudDialog, Field, inputCls, useCrud, AddButton, RowActions, Loading, EmptyState } from "./CrudShared";

const EMPTY = { name: "", description: "", image_url: "", order: 0 };

export default function CategoriesTab() {
  const { items, save, remove } = useCrud("admin/categories");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name, description: c.description || "", image_url: c.image_url || "", order: c.order || 0 });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (await save({ ...form, order: Number(form.order) || 0 }, editing)) setOpen(false);
  };

  return (
    <div data-testid="categories-tab">
      <AddButton onClick={openNew} label="Nova categoria" testid="category-add" />
      {items === null ? <Loading /> : items.length === 0 ? <EmptyState text="Nenhuma categoria cadastrada." /> : (
        <div className="bg-white border border-[#E2E8F0] overflow-x-auto">
          <table className="w-full text-sm" data-testid="categories-table">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[10px] uppercase tracking-[0.16em] text-slate2">
                <th className="px-5 py-4 font-semibold">Categoria</th>
                <th className="px-5 py-4 font-semibold">Descrição</th>
                <th className="px-5 py-4 font-semibold">Ordem</th>
                <th className="px-5 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#FAFAFA]" data-testid={`category-row-${c.id}`}>
                  <td className="px-5 py-4 font-semibold text-ink">{c.name}</td>
                  <td className="px-5 py-4 text-xs text-slate2 max-w-sm line-clamp-1">{c.description || "—"}</td>
                  <td className="px-5 py-4 text-xs text-slate2">{c.order}</td>
                  <td className="px-5 py-4">
                    <RowActions testid={`category-${c.id}`} onEdit={() => openEdit(c)}
                      onDelete={() => window.confirm(`Excluir a categoria "${c.name}"?`) && remove(c.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CrudDialog open={open} onClose={() => setOpen(false)} title={editing ? "Editar categoria" : "Nova categoria"} onSubmit={submit} testid="category-dialog">
        <Field label="Nome da categoria *">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} data-testid="category-input-name" />
        </Field>
        <Field label="Descrição">
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} data-testid="category-input-description" />
        </Field>
        <Field label="URL da imagem (opcional)">
          <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://..." data-testid="category-input-image" />
        </Field>
        <Field label="Ordem de exibição">
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputCls} data-testid="category-input-order" />
        </Field>
      </CrudDialog>
    </div>
  );
}
