const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_SCHEMA = process.env.SUPABASE_SCHEMA || "public";

function supabaseConfigured() {
  return Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY));
}

function supabaseKey() {
  return SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || "";
}

function supabaseHeaders(extra = {}) {
  const key = supabaseKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "Content-Profile": SUPABASE_SCHEMA,
    "Accept-Profile": SUPABASE_SCHEMA,
    ...extra,
  };
}

function supabaseUrl(table, query = "") {
  const suffix = query ? `?${query}` : "";
  return `${SUPABASE_URL}/rest/v1/${table}${suffix}`;
}

async function supabaseRequest(table, payload, options = {}) {
  if (!supabaseConfigured()) {
    return null;
  }

  const response = await fetch(supabaseUrl(table, options.query || ""), {
    method: options.method || "POST",
    headers: supabaseHeaders({
      Prefer: options.prefer || "return=minimal",
      ...(options.headers || {}),
    }),
    body: options.body ? options.body : JSON.stringify(payload),
  });

  if (!response.ok) {
    return null;
  }

  return true;
}

export function supabaseReady() {
  return supabaseConfigured();
}

export async function supabaseSelect(table, query = "", { single = false } = {}) {
  if (!supabaseConfigured()) {
    return null;
  }

  const response = await fetch(supabaseUrl(table, query), {
    method: "GET",
    headers: supabaseHeaders({ Prefer: single ? "return=representation" : undefined }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return null;
  }

  return payload;
}

export async function supabaseSelectSingle(table, query = "") {
  const payload = await supabaseSelect(table, query);
  if (!payload) return null;
  if (Array.isArray(payload)) return payload[0] || null;
  return payload;
}

export async function supabaseInsert(table, payload) {
  if (!supabaseConfigured()) {
    return null;
  }

  const response = await fetch(supabaseUrl(table), {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return null;
  }

  return data;
}

export async function supabaseUpdate(table, query, payload) {
  if (!supabaseConfigured()) {
    return null;
  }

  const response = await fetch(supabaseUrl(table, query), {
    method: "PATCH",
    headers: supabaseHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return null;
  }

  return data;
}

export async function supabaseDelete(table, query) {
  if (!supabaseConfigured()) {
    return null;
  }

  const response = await fetch(supabaseUrl(table, query), {
    method: "DELETE",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
  });

  if (!response.ok) {
    return null;
  }

  return true;
}

export function getIntegrationStatus() {
  return {
    gemini: Boolean(GEMINI_API_KEY),
    supabase: supabaseConfigured(),
    authUsers: supabaseConfigured(),
    supabaseSchema: SUPABASE_SCHEMA,
    geminiModel: GEMINI_MODEL,
  };
}

export async function askGemini({ systemInstruction = "", prompt, temperature = 0.2, maxOutputTokens = 1024 }) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini is not configured. Set GEMINI_API_KEY in your environment.");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: systemInstruction
        ? {
            parts: [{ text: systemInstruction }],
          }
        : undefined,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Gemini request failed (${response.status})`;
    throw new Error(message);
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
  return {
    model: GEMINI_MODEL,
    text,
    raw: payload,
  };
}

export async function mirrorSupabaseEvent(table, payload) {
  try {
    await supabaseRequest(table, {
      ...payload,
      created_at: payload.created_at || new Date().toISOString(),
    });
  } catch {
    return null;
  }
  return true;
}

export async function mirrorConsentEvent(payload) {
  return mirrorSupabaseEvent("kova_legal_events", {
    event_type: payload.event_type,
    user_id: payload.user_id || null,
    email: payload.email || null,
    plan: payload.plan || null,
    document_slug: payload.document_slug || null,
    document_name: payload.document_name || null,
    version: payload.version || null,
    checksum: payload.checksum || null,
    details: payload.details || {},
  });
}

export async function mirrorAiEvent(payload) {
  return mirrorSupabaseEvent("kova_ai_events", {
    event_type: payload.event_type || "ai-chat",
    user_id: payload.user_id || null,
    email: payload.email || null,
    prompt: payload.prompt || "",
    response: payload.response || "",
    context: payload.context || {},
  });
}
