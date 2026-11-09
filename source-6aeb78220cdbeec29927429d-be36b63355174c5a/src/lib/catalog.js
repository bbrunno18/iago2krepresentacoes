import { api } from "./api";

// Marcas exibidas no site enquanto a API (/api/brands) não existe ou está vazia.
// Quando houver marcas cadastradas no painel, elas passam a ter prioridade.
// Os logos ficam em /public/brands.
export const FALLBACK_BRANDS = [
  { id: "fc-materiais-eletricos", name: "F.C. Materiais Elétricos", image_url: "/brands/fc-materiais-eletricos.jpg" },
  { id: "merconplas", name: "Merconplas", image_url: "/brands/merconplas.jpg" },
  { id: "alianca", name: "Aliança", image_url: "/brands/alianca.jpg" },
  { id: "amilplast", name: "Amilplast Variedades", image_url: "/brands/amilplast.jpg" },
  { id: "allmix", name: "Allmix Utilidades", image_url: "/brands/allmix.jpg" },
  { id: "interponte", name: "Interponte", image_url: "/brands/interponte.jpg" },
  { id: "face-beautiful", name: "Face Beautiful Profissional", image_url: "/brands/face-beautiful.jpg" },
].map((b, i) => ({ description: "", category_id: "", catalog_url: "", featured: true, order: i + 1, ...b }));

// Categorias exibidas no site enquanto a API (/api/categories) não existe ou está vazia.
export const FALLBACK_CATEGORIES = [
  { id: "utilidades-domesticas", name: "Utilidades Domésticas" },
  { id: "papelaria", name: "Papelaria" },
  { id: "brinquedos-e-pelucias", name: "Brinquedos e Pelúcias" },
  { id: "linha-pet", name: "Linha Pet" },
  { id: "presentes-e-decoracao", name: "Presentes e Decoração" },
  { id: "cosmeticos-e-maquiagens", name: "Cosméticos e Maquiagens" },
  { id: "outros-produtos", name: "Outros Produtos" },
].map((c, i) => ({ description: "", image_url: "", order: i + 1, ...c }));

export async function fetchCategories() {
  try {
    const { data } = await api.get("/categories");
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // API indisponível: segue para a lista local
  }
  return FALLBACK_CATEGORIES;
}

// Nunca rejeita: usa a API quando ela devolve uma lista com marcas; senão, a lista acima.
export async function fetchBrands() {
  try {
    const { data } = await api.get("/brands");
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // API indisponível: segue para a lista local
  }
  return FALLBACK_BRANDS;
}
