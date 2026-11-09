import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { Field, inputCls } from "./CrudShared";

const FIELDS = [
  { key: "company_name", label: "Nome da empresa" },
  { key: "representative", label: "Responsável comercial" },
  { key: "cnpj", label: "CNPJ" },
  { key: "tagline", label: "Slogan / descrição curta", textarea: true },
  { key: "whatsapp", label: "WhatsApp (somente números, com DDI+DDD)", placeholder: "5592981729959" },
  { key: "phone_display", label: "Telefone para exibição", placeholder: "(92) 98172-9959" },
  { key: "email", label: "E-mail comercial" },
  { key: "address", label: "Endereço (exibe mapa e rodapé quando preenchido)" },
  { key: "business_hours", label: "Horário de atendimento" },
  { key: "instagram", label: "Instagram (URL)" },
  { key: "facebook", label: "Facebook (URL)" },
  { key: "hero_headline", label: "Headline da home", textarea: true },
  { key: "hero_sub", label: "Subheadline da home", textarea: true },
  { key: "about_text", label: "Texto institucional (página Sobre)", textarea: true },
  { key: "stat_brands", label: "Estatística: marcas representadas (ex.: 10)" },
  { key: "stat_categories", label: "Estatística: categorias atendidas (ex.: 30)" },
  { key: "stat_regions", label: "Estatística: regiões atendidas (ex.: 5)" },
  { key: "stat_years", label: "Estatística: anos de experiência (ex.: 10)" },
  { key: "whatsapp_message", label: "Mensagem padrão do WhatsApp", textarea: true },
  { key: "catalog_drive_url", label: "Link da pasta de catálogos (Drive)" },
];

export default function SettingsTab() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then(({ data }) => setForm(data)).catch((e) => toast.error(formatApiError(e)));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/settings", form);
      toast.success("Configurações salvas. O site já reflete as alterações.");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-gold-dark" /></div>;

  return (
    <div data-testid="settings-tab">
      <p className="text-sm text-slate2 mb-6 max-w-2xl">
        Estes dados alimentam todo o site: contatos, textos institucionais, mensagens de WhatsApp e estatísticas. Deixe em branco o que ainda não estiver definido.
      </p>
      <form onSubmit={submit} data-testid="settings-form" className="bg-white border border-[#E2E8F0] p-6 lg:p-8 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
              <Field label={f.label}>
                {f.textarea ? (
                  <textarea rows={3} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={`${inputCls} resize-none`} placeholder={f.placeholder || ""} data-testid={`settings-input-${f.key}`} />
                ) : (
                  <input value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={inputCls} placeholder={f.placeholder || ""} data-testid={`settings-input-${f.key}`} />
                )}
              </Field>
            </div>
          ))}
        </div>
        <button type="submit" data-testid="settings-save" disabled={saving}
          className="mt-8 inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-8 py-3.5 hover:bg-gold hover:text-ink transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}
