import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

export const FALLBACK_SETTINGS = {
  company_name: "Icaro Almeida e 2K Representações",
  representative: "Icaro Almeida",
  tagline: "Representação comercial e distribuição para lojistas, atacadistas e empresas.",
  whatsapp: "5592981729959",
  phone_display: "(92) 98172-9959",
  email: "2krepresentacoesoficial@gmail.com",
  address: "Av. Ayrão, 961 - Centro, Manaus - AM, 69020-205",
  business_hours: "Segunda a sexta, horário comercial",
  instagram: "https://www.instagram.com/2krepresentacoes_?srtk=bTByZXA3eTYxdDY3",
  facebook: "",
  cnpj: "27.800.807/0001-65",
  hero_headline: "Produtos que movimentam o seu negócio.",
  hero_sub: "Conectamos lojistas, atacadistas e empresas às melhores marcas, produtos e oportunidades comerciais do mercado — com atendimento consultivo e ágil.",
  about_text: "",
  stat_items: "20000",
  stat_brands: "10",
  stat_categories: "30",
  stat_regions: "",
  stat_years: "10",
  whatsapp_message: "Olá! Vim pelo site de Icaro Almeida e 2K Representações e gostaria de mais informações.",
  catalog_drive_url: "",
};

const SettingsContext = createContext(FALLBACK_SETTINGS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => setSettings({ ...FALLBACK_SETTINGS, ...data }))
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

export function waLink(settings, message) {
  const msg = message || settings.whatsapp_message || FALLBACK_SETTINGS.whatsapp_message;
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Icaro Almeida e 2K Representações` : "Icaro Almeida e 2K Representações — Representação Comercial para Lojistas e Atacadistas";
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute("content", description);
    }
  }, [title, description]);
}

export const brandMonogram = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
