# Plano — Icaro Almeida e 2K Representações

1. ✅ Frontend recriado (Vite + React + Tailwind): Home, Sobre, Marcas, Produtos, Solicitar Catálogo, Contato, FAQ, 404 e telas do painel admin, com o visual original (tinta #0F172A, dourado #C5A059).
2. ✅ Autenticação do admin preparada no cliente com Netlify Identity (`src/context/AuthContext.jsx`).
3. ⬜ Banco de dados: `db/schema.ts` com Drizzle (`settings`, `categories`, `brands`, `products`, `faqs`, `catalog_files`, `requests`), `drizzle.config.ts` (out: `netlify/database/migrations`) e migração gerada com `npx drizzle-kit generate --name create_initial_tables`.
4. ⬜ Seed com os dados atuais do site original (configurações, categorias, marcas, FAQs, arquivos de catálogo).
5. ⬜ API em `netlify/functions/api.mts` (path `/api/*`): rotas públicas (`settings`, `brands`, `categories`, `products?q&brand_id&category_id`, `faqs`, `catalog-files`, `POST requests`) e rotas `/api/admin/*` protegidas por `getUser()` (CRUD, `stats`, `requests` PATCH/DELETE, `settings` PUT).
6. ⬜ Rodar `node /opt/buildhome/.claude/skills/netlify-identity/scripts/enable.cjs`; ajustar AdminLogin para "primeiro acesso" / "esqueci a senha"; deixar o cadastro como "somente convite" no painel Netlify.
7. ⬜ Substituir a sincronização com Google Drive (`DriveSync.jsx`) por função agendada ou remover o botão.
