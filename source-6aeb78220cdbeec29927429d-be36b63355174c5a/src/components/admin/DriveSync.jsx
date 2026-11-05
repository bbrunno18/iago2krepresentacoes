import { useEffect, useState } from "react";
import { FolderSync, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

export default function DriveSync({ onSynced }) {
  const [status, setStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    api.get("/admin/drive/status").then(({ data }) => setStatus(data)).catch(() => {});
  }, []);

  const sync = async () => {
    setSyncing(true);
    try {
      const { data } = await api.post("/admin/drive/sync");
      setStatus(data);
      toast.success(`Drive sincronizado: ${data.matched.length} marcas, ${data.files} arquivos de catálogo, ${data.products_created} produtos novos.`);
      if (onSynced) onSynced();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div data-testid="drive-sync-card" className="bg-ink text-white p-6 lg:p-8 mb-8 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-2">Integração Google Drive</p>
        <h2 className="font-display font-bold text-xl tracking-tight">Catálogos sincronizados automaticamente</h2>
        <p className="text-sm text-white/60 mt-2 max-w-xl leading-relaxed">
          Ao sincronizar, o sistema lê a pasta pública de catálogos no Drive, vincula os arquivos às marcas correspondentes,
          publica os catálogos no site e importa fotos como produtos.
        </p>
        {status?.synced_at && (
          <p className="text-xs text-gold mt-3 flex items-center gap-2" data-testid="drive-sync-status">
            <CheckCircle2 size={14} />
            Última sincronização: {new Date(status.synced_at).toLocaleString("pt-BR")} — {status.files} arquivos, {status.matched?.length} marcas
            {status.unmatched?.length > 0 && ` · não vinculadas: ${status.unmatched.join(", ")}`}
          </p>
        )}
      </div>
      <button onClick={sync} disabled={syncing} data-testid="drive-sync-btn"
        className="inline-flex items-center justify-center gap-2 bg-gold text-ink font-semibold px-8 py-4 text-sm hover:bg-white transition-colors duration-300 disabled:opacity-60 shrink-0">
        {syncing ? <Loader2 size={16} className="animate-spin" /> : <FolderSync size={16} />}
        {syncing ? "Sincronizando..." : "Sincronizar agora"}
      </button>
    </div>
  );
}
