import { useState } from "react";
import { CrudDialog, Field, inputCls, useCrud, AddButton, RowActions, Loading, EmptyState } from "./CrudShared";

const EMPTY = { question: "", answer: "", order: 0 };

export default function FaqsTab() {
  const { items, save, remove } = useCrud("admin/faqs");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (f) => {
    setEditing(f.id);
    setForm({ question: f.question, answer: f.answer, order: f.order || 0 });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (await save({ ...form, order: Number(form.order) || 0 }, editing)) setOpen(false);
  };

  return (
    <div data-testid="faqs-tab">
      <AddButton onClick={openNew} label="Nova pergunta" testid="faq-add" />
      {items === null ? <Loading /> : items.length === 0 ? <EmptyState text="Nenhuma pergunta cadastrada." /> : (
        <div className="bg-white border border-[#E2E8F0] overflow-x-auto">
          <table className="w-full text-sm" data-testid="faqs-table">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[10px] uppercase tracking-[0.16em] text-slate2">
                <th className="px-5 py-4 font-semibold">Pergunta</th>
                <th className="px-5 py-4 font-semibold">Resposta</th>
                <th className="px-5 py-4 font-semibold">Ordem</th>
                <th className="px-5 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#FAFAFA] align-top" data-testid={`faq-row-${f.id}`}>
                  <td className="px-5 py-4 font-semibold text-ink max-w-xs">{f.question}</td>
                  <td className="px-5 py-4 text-xs text-slate2 max-w-md line-clamp-2">{f.answer}</td>
                  <td className="px-5 py-4 text-xs text-slate2">{f.order}</td>
                  <td className="px-5 py-4">
                    <RowActions testid={`faq-${f.id}`} onEdit={() => openEdit(f)}
                      onDelete={() => window.confirm("Excluir esta pergunta?") && remove(f.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CrudDialog open={open} onClose={() => setOpen(false)} title={editing ? "Editar pergunta" : "Nova pergunta"} onSubmit={submit} testid="faq-dialog">
        <Field label="Pergunta *">
          <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} data-testid="faq-input-question" />
        </Field>
        <Field label="Resposta *">
          <textarea required rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={`${inputCls} resize-none`} data-testid="faq-input-answer" />
        </Field>
        <Field label="Ordem de exibição">
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputCls} data-testid="faq-input-order" />
        </Field>
      </CrudDialog>
    </div>
  );
}
