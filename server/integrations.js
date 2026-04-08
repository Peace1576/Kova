const BRAIN_API_KEY = process.env.BRAIN_API_KEY || process.env.GROQ_API_KEY || "";
const BRAIN_MODEL = process.env.BRAIN_MODEL || "llama-3.1-70b-versatile";
const LEGACY_BRAIN_API_KEY = process.env.GEMINI_API_KEY || "";
const LEGACY_BRAIN_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
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
    brain: Boolean(BRAIN_API_KEY || LEGACY_BRAIN_API_KEY),
    brainProvider: BRAIN_API_KEY ? "groq" : LEGACY_BRAIN_API_KEY ? "legacy" : "missing",
    supabase: supabaseConfigured(),
    authUsers: supabaseConfigured(),
    supabaseSchema: SUPABASE_SCHEMA,
    brainModel: BRAIN_API_KEY ? BRAIN_MODEL : LEGACY_BRAIN_MODEL,
  };
}

async function askGroq({ systemInstruction = "", prompt, temperature = 0.2, maxOutputTokens = 1024 }) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BRAIN_API_KEY}`,
    },
    body: JSON.stringify({
      model: BRAIN_MODEL,
      messages: [
        ...(systemInstruction
          ? [{ role: "system", content: systemInstruction }]
          : []),
        { role: "user", content: prompt },
      ],
      temperature,
      max_tokens: maxOutputTokens,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Brain request failed (${response.status})`;
    throw new Error(message);
  }

  const text = payload?.choices?.[0]?.message?.content?.trim() || "";
  return {
    provider: "groq",
    model: BRAIN_MODEL,
    text,
    raw: payload,
  };
}

async function askLegacyBrain({ systemInstruction = "", prompt, temperature = 0.2, maxOutputTokens = 1024 }) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${LEGACY_BRAIN_MODEL}:generateContent?key=${encodeURIComponent(LEGACY_BRAIN_API_KEY)}`, {
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
    const message = payload?.error?.message || `Brain request failed (${response.status})`;
    throw new Error(message);
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
  return {
    provider: "legacy",
    model: LEGACY_BRAIN_MODEL,
    text,
    raw: payload,
  };
}

export async function askBrain({ systemInstruction = "", prompt, temperature = 0.2, maxOutputTokens = 1024 }) {
  if (BRAIN_API_KEY) {
    return askGroq({ systemInstruction, prompt, temperature, maxOutputTokens });
  }

  if (LEGACY_BRAIN_API_KEY) {
    return askLegacyBrain({ systemInstruction, prompt, temperature, maxOutputTokens });
  }

  throw new Error("The brain is not configured. Set BRAIN_API_KEY in your environment.");
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
