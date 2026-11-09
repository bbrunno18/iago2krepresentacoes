// Envio das solicitações dos formulários (catálogo rápido, solicitar catálogo e contato)
// direto para o e-mail comercial, via FormSubmit (https://formsubmit.co).
// Não depende da API/banco de dados do site.

export const REQUEST_EMAIL = "2krepresentacoesoficial@gmail.com";
export const REQUEST_ENDPOINT = `https://formsubmit.co/ajax/${REQUEST_EMAIL}`;

const TYPE_LABELS = {
  catalog: "Solicitação de catálogo",
  contact: "Mensagem de contato",
  interest: "Interesse em produto",
};

// Monta o conteúdo do e-mail com rótulos legíveis, ignorando campos vazios.
export function buildEmailPayload(data) {
  const { type = "contact", name, company, city, state, whatsapp, email, business_type, interests, message, consent, origin } = data;
  const location = [city, state].filter(Boolean).join(" / ");

  const fields = {
    "Tipo de solicitação": TYPE_LABELS[type] || type,
    "Nome": name,
    "WhatsApp": whatsapp,
    "Empresa": company,
    "Cidade / Estado": location,
    "Tipo de negócio": business_type,
    "Categorias de interesse": Array.isArray(interests) ? interests.join(", ") : interests,
    "Mensagem": message,
    "Autorizou contato (LGPD)": consent ? "Sim" : "Não",
    "Enviado pela página": origin,
  };

  const payload = {};
  for (const [label, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") payload[label] = String(value).trim();
  }

  // "email" é o campo que o FormSubmit usa como "Responder para".
  if (email && String(email).trim()) payload.email = String(email).trim();

  payload._subject = `[Site 2K] ${TYPE_LABELS[type] || "Nova solicitação"} — ${name || "sem nome"}`;
  payload._template = "table";
  payload._captcha = "false";
  return payload;
}

export async function submitRequest(data) {
  let res;
  try {
    res = await fetch(REQUEST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildEmailPayload(data)),
    });
  } catch {
    throw new Error("Não foi possível enviar agora. Verifique sua conexão ou chame no WhatsApp.");
  }

  let body = null;
  try { body = await res.json(); } catch { /* resposta sem JSON */ }

  const ok = res.ok && body && (body.success === true || body.success === "true");
  if (!ok) {
    throw new Error("Não foi possível enviar sua solicitação. Tente novamente ou chame no WhatsApp.");
  }
  return body;
}
