import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const inputCls = "w-full border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-ink focus:border-gold outline-none transition-colors duration-300";
const labelCls = "block text-xs font-semibold text-slate2 mb-1.5";

export function CrudDialog({ open, onClose, title, onSubmit, children, testid }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" data-testid={testid}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-[#E2E8F0] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white">
          <h2 className="font-display font-bold text-lg tracking-tight text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" data-testid={`${testid}-close`} className="text-slate2 hover:text-ink p-1">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} data-testid={`${testid}-cancel`}
              className="px-5 py-2.5 text-sm font-semibold text-slate2 border border-[#E2E8F0] hover:border-ink transition-colors">
              Cancelar
            </button>
            <button type="submit" data-testid={`${testid}-save`}
              className="px-5 py-2.5 text-sm font-semibold bg-ink text-white hover:bg-gold hover:text-ink transition-colors">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export { inputCls };

export function useCrud(endpoint) {
  const [items, setItems] = useState(null);
  const publicEndpoint = endpoint.replace(/^admin\//, "");

  const load = () =>
    api.get(`/${publicEndpoint}`)
      .then(({ data }) => setItems(data))
      .catch((e) => toast.error(formatApiError(e)));

  useEffect(() => { load(); }, [endpoint]);

  const save = async (payload, id) => {
    try {
      if (id) await api.put(`/${endpoint}/${id}`, payload);
      else await api.post(`/${endpoint}`, payload);
      toast.success(id ? "Atualizado com sucesso." : "Criado com sucesso.");
      load();
      return true;
    } catch (e) {
      toast.error(formatApiError(e));
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      toast.success("Excluído com sucesso.");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  return { items, load, save, remove };
}

export function AddButton({ onClick, label, testid }) {
  return (
    <button onClick={onClick} data-testid={testid}
      className="inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-gold hover:text-ink transition-colors mb-6">
      <Plus size={15} /> {label}
    </button>
  );
}

export function RowActions({ onEdit, onDelete, testid }) {
  return (
    <div className="flex justify-end gap-1">
      <button onClick={onEdit} aria-label="Editar" data-testid={`${testid}-edit`} className="text-slate2 hover:text-ink p-2 transition-colors">
        <Pencil size={15} />
      </button>
      <button onClick={onDelete} aria-label="Excluir" data-testid={`${testid}-delete`} className="text-slate2 hover:text-red-600 p-2 transition-colors">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export function Loading() {
  return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-gold-dark" /></div>;
}

export function EmptyState({ text }) {
  return (
    <div className="bg-white border border-[#E2E8F0] p-16 text-center">
      <p className="text-sm text-slate2">{text}</p>
    </div>
  );
}
