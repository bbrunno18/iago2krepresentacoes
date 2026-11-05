# AGENTS.md

- **Frontend:** `src/` (Vite + React, alias `@` → `src`). Páginas públicas em `src/pages`, painel em `src/pages/admin` + `src/components/admin`. Textos em pt-BR.
- **Dados:** todo o conteúdo vem de `/api/*` via `src/lib/api.js` (axios). `src/lib/site.jsx` tem `FALLBACK_SETTINGS`, usado enquanto a API não responde. Respostas usam `id` string e campos snake_case (`category_id`, `brand_id`, `image_url`, `catalog_url`, `featured`, `order`); erros retornam `{ detail }`.
- **Auth:** Netlify Identity (`@netlify/identity`), não JWT próprio. Rotas `/api/admin/*` devem checar `getUser()` no servidor.
- **Tema:** cores `ink`, `gold`, `gold-dark`, `gold-pale`, `slate2` em `tailwind.config.js`; fontes Cabinet Grotesk / Manrope / Playfair.
- `lucide-react` fixado em 0.507.0 porque versões novas removeram os ícones Instagram/Facebook.
- Pendências e próximos passos: **PLAN.md**.
