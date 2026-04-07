const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const token = localStorage.getItem("kova_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

async function rawRequest(path, options = {}) {
  const token = localStorage.getItem("kova_token");
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
}

export const api = {
  health: () => request("/api/health"),
  home: () => request("/api/home"),
  products: () => request("/api/products"),
  product: (slug) => request(`/api/products/${slug}`),
  pricing: () => request("/api/pricing/plans"),
  mobile: () => request("/api/mobile/screens"),
  system: () => request("/api/system/tree"),
  agreements: () => request("/api/agreements"),
  agreement: (slug) => request(`/api/agreements/${slug}`),
  legalAudit: () => request("/api/legal/audit"),
  legalRecords: () => request("/api/legal/records"),
  legalAuditCsv: () => rawRequest("/api/legal/audit/export.csv"),
  legalAuditPrint: () => rawRequest("/api/legal/audit/print"),
  revokeConsent: (body) => request("/api/legal/revoke", { method: "POST", body: JSON.stringify(body || {}) }),
  deleteData: (body) => request("/api/legal/delete", { method: "POST", body: JSON.stringify(body || {}) }),
  adminAgreementStatus: () => request("/api/admin/agreement-status"),
  reviewAgreement: (slug, body) =>
    request(`/api/admin/agreements/${slug}/review`, { method: "POST", body: JSON.stringify(body || {}) }),
  integrationStatus: () => request("/api/integrations/status"),
  aiChat: (body) => request("/api/ai/chat", { method: "POST", body: JSON.stringify(body || {}) }),
  dashboard: () => request("/api/dashboard"),
  flow: (slug) => request(`/api/flows/${slug}`),
  startFlow: (slug) => request(`/api/flows/${slug}/start`, { method: "POST" }),
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
};

export function setToken(token) {
  if (token) {
    localStorage.setItem("kova_token", token);
  } else {
    localStorage.removeItem("kova_token");
  }
}

export function getToken() {
  return localStorage.getItem("kova_token");
}
