import { useEffect, useState } from "react";
import { MessageCircle, Trash2, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const TYPE_LABELS = { catalog: "Catálogo", contact: "Contato", interest: "Interesse" };
const STATUS_LABELS = { novo: "Novo", em_atendimento: "Em atendimento", concluido: "Concluído" };
const STATUS_COLORS = {
  novo: "bg-gold/15 text-gold-dark border-gold/30",
  em_atendimento: "bg-blue-50 text-blue-700 border-blue-200",
  concluido: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function RequestsTab() {
  const [items, setItems] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    api.get("/admin/requests", { params: statusFilter ? { status: statusFilter } : {} })
      .then(({ data }) => setItems(data))
      .catch((e) => toast.error(formatApiError(e)));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/requests/${id}`, { status });
      toast.success("Status atualizado.");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Excluir esta solicitação?")) return;
    try {
      await api.delete(`/admin/requests/${id}`);
      toast.success("Solicitação excluída.");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const waDigits = (v = "") => v.replace(/\D/g, "");

  return (
    <div data-testid="requests-tab">
      <div className="flex flex-wrap gap-2 mb-6">
        {["", "novo", "em_atendimento", "concluido"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} data-testid={`requests-filter-${s || "todos"}`}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors duration-300 ${
              statusFilter === s ? "bg-ink text-white border-ink" : "bg-white text-slate2 border-[#E2E8F0] hover:border-gold"
            }`}>
            {s ? STATUS_LABELS[s] : "Todas"}
          </button>
        ))}
      </div>

      {items === null ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-gold-dark" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] p-16 text-center" data-testid="requests-empty">
          <Inbox size={30} className="mx-auto text-slate2/40 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-slate2">Nenhuma solicitação por aqui ainda.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] overflow-x-auto">
          <table className="w-full text-sm" data-testid="requests-table">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[10px] uppercase tracking-[0.16em] text-slate2">
                <th className="px-5 py-4 font-semibold">Tipo</th>
                <th className="px-5 py-4 font-semibold">Cliente</th>
                <th className="px-5 py-4 font-semibold">Contato</th>
                <th className="px-5 py-4 font-semibold">Detalhes</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#FAFAFA] align-top" data-testid={`request-row-${r.id}`}>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-ink text-white px-2.5 py-1">{TYPE_LABELS[r.type] || r.type}</span>
                    <p className="text-[10px] text-slate2 mt-2">{new Date(r.created_at).toLocaleString("pt-BR")}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{r.name}</p>
                    {r.company && <p className="text-xs text-slate2">{r.company}</p>}
                    {(r.city || r.state) && <p className="text-xs text-slate2">{[r.city, r.state].filter(Boolean).join(" / ")}</p>}
                    {r.business_type && <p className="text-xs text-gold-dark mt-1">{r.business_type}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <a href={`https://wa.me/55${waDigits(r.whatsapp)}`} target="_blank" rel="noopener noreferrer"
                      data-testid={`request-wa-${r.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-gold-dark transition-colors">
                      <MessageCircle size={13} /> {r.whatsapp}
                    </a>
                    {r.email && <p className="text-xs text-slate2 mt-1">{r.email}</p>}
                  </td>
                  <td className="px-5 py-4 max-w-[260px]">
                    {r.interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {r.interests.map((i) => (
                          <span key={i} className="text-[10px] bg-[#F4F4F5] border border-[#E2E8F0] px-2 py-0.5 text-slate2">{i}</span>
                        ))}
                      </div>
                    )}
                    {r.message && <p className="text-xs text-slate2 leading-relaxed">{r.message}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                      data-testid={`request-status-${r.id}`}
                      className={`text-[11px] font-semibold border px-2.5 py-1.5 outline-none ${STATUS_COLORS[r.status]}`}>
                      {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => remove(r.id)} data-testid={`request-delete-${r.id}`} aria-label="Excluir solicitação"
                      className="text-slate2 hover:text-red-600 transition-colors p-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
