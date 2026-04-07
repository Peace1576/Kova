import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  agreementDocs,
  agreementPlanRequirements,
  agreementPlanDisclosures,
  homeSections,
  kovaProducts,
  mobileScreens,
  pricingPlans,
  privacyNotice,
  systemTree,
  supportContacts,
} from "../src/data/kovaData.js";
import {
  mirrorAiEvent,
  mirrorConsentEvent,
  mirrorSupabaseEvent,
  supabaseDelete,
  supabaseInsert,
  supabaseReady,
  supabaseSelectSingle,
  supabaseUpdate,
} from "./integrations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, "data");
const dbPath = path.join(dbDir, "kova-db.json");
const agreementManifestPath = path.join(dbDir, "agreement-manifest.json");

const DEFAULT_DB = {
  users: [],
  sessions: [],
  flowState: {},
  agreementReviews: {},
  recordRequests: [],
};

let agreementManifestCache = null;

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    createdAt: user.createdAt,
  };
}

async function ensureDb() {
  await mkdir(dbDir, { recursive: true });
  try {
    await readFile(dbPath, "utf8");
  } catch {
    await writeFile(dbPath, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
  }
}

async function loadAgreementManifest() {
  if (agreementManifestCache) {
    return agreementManifestCache;
  }

  try {
    const raw = await readFile(agreementManifestPath, "utf8");
    agreementManifestCache = JSON.parse(raw);
  } catch {
    agreementManifestCache = {};
  }

  return agreementManifestCache;
}

export async function loadDb() {
  await ensureDb();
  const raw = await readFile(dbPath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    flowState: parsed.flowState && typeof parsed.flowState === "object" ? parsed.flowState : {},
    agreementReviews:
      parsed.agreementReviews && typeof parsed.agreementReviews === "object" ? parsed.agreementReviews : {},
    recordRequests: Array.isArray(parsed.recordRequests) ? parsed.recordRequests : [],
  };
}

export async function saveDb(db) {
  await ensureDb();
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const attempted = Buffer.from(scryptSync(password, salt, 64).toString("hex"), "hex");
  const expected = Buffer.from(hash, "hex");
  return attempted.length === expected.length && timingSafeEqual(attempted, expected);
}

function fallbackManifestEntry(doc) {
  return {
    slug: doc.slug,
    fileName: doc.fileName,
    version: doc.version || "v1.0.0",
    checksum: null,
    acceptedText: `${doc.name}\n\n${doc.excerpt}`,
    paragraphs: [doc.name, doc.excerpt],
    wordCount: doc.excerpt ? doc.excerpt.split(/\s+/).filter(Boolean).length : 0,
  };
}

function mergeAgreementDoc(doc, manifestEntry = null, reviewState = null) {
  const artifact = manifestEntry || fallbackManifestEntry(doc);
  return {
    ...doc,
    version: doc.version || artifact.version,
    checksum: artifact.checksum,
    acceptedText: artifact.acceptedText,
    paragraphs: artifact.paragraphs,
    wordCount: artifact.wordCount,
    reviewedByCounsel: reviewState?.reviewedByCounsel ?? doc.reviewedByCounsel ?? false,
    reviewedAt: reviewState?.reviewedAt || null,
    reviewerName: reviewState?.reviewerName || null,
    reviewNotes: reviewState?.reviewNotes || "",
  };
}

function normalizeAcknowledgements(input) {
  if (!input) return new Set();
  if (Array.isArray(input)) {
    return new Set(input.filter(Boolean));
  }
  if (typeof input === "object") {
    return new Set(Object.entries(input).filter(([, value]) => Boolean(value)).map(([key]) => key));
  }
  return new Set();
}

function buildAcceptedDocuments(requiredDocs, manifest, reviewState, acceptedAt, acceptedDocs = new Set()) {
  return requiredDocs
    .map((slug) => agreementDocs.find((doc) => doc.slug === slug))
    .filter(Boolean)
    .map((doc) => {
      const entry = mergeAgreementDoc(doc, manifest[doc.slug], reviewState?.[doc.slug]);
      return {
        slug: entry.slug,
        name: entry.name,
        fileName: entry.fileName,
        path: entry.path,
        version: entry.version,
        checksum: entry.checksum,
        acceptedText: entry.acceptedText,
        paragraphs: entry.paragraphs,
        wordCount: entry.wordCount,
        summary: entry.summary,
        use: entry.use,
        excerpt: entry.excerpt,
        highlights: entry.highlights,
        requiredFor: entry.requiredFor,
        accepted: acceptedDocs.has(entry.slug),
        acceptedAt,
        reviewedByCounsel: entry.reviewedByCounsel,
        reviewedAt: entry.reviewedAt,
        reviewerName: entry.reviewerName,
      };
    });
}

function buildConsentSnapshot(user, manifest = null, reviewState = null) {
  const consent = user?.consent || null;
  const requiredDocs = Array.isArray(consent?.requiredDocs) ? consent.requiredDocs : [];
  const acceptedDocs = new Set(Array.isArray(consent?.acceptedDocs) ? consent.acceptedDocs : []);

  const documents = requiredDocs
    .map((slug) => agreementDocs.find((doc) => doc.slug === slug))
    .filter(Boolean)
    .map((doc) => {
      const entry = mergeAgreementDoc(doc, manifest?.[doc.slug] || null, reviewState?.[doc.slug] || null);
      return {
        slug: entry.slug,
        name: entry.name,
        fileName: entry.fileName,
        path: entry.path,
        version: entry.version,
        checksum: entry.checksum,
        acceptedText: entry.acceptedText,
        paragraphs: entry.paragraphs,
        wordCount: entry.wordCount,
        summary: entry.summary,
        use: entry.use,
        excerpt: entry.excerpt,
        highlights: entry.highlights,
        requiredFor: entry.requiredFor,
        accepted: acceptedDocs.has(entry.slug),
        acceptedAt: consent?.acceptedAt || null,
        reviewedByCounsel: entry.reviewedByCounsel,
        reviewedAt: entry.reviewedAt,
        reviewerName: entry.reviewerName,
      };
    });

  return {
    consent,
    documents,
  };
}

function mapSupabaseUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    plan: row.plan,
    createdAt: row.created_at,
    consent: row.consent || {},
    consentLog: row.consent_log || [],
    deletedAt: row.deleted_at || null,
    deleted: Boolean(row.deleted),
  };
}

async function getAuthUserByEmail(email) {
  if (supabaseReady()) {
    const row = await supabaseSelectSingle("kova_users", `email=eq.${encodeURIComponent(email.toLowerCase())}&select=*`);
    return mapSupabaseUser(row);
  }

  const db = await loadDb();
  return db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase()) || null;
}

async function getAuthUserById(id) {
  if (supabaseReady()) {
    const row = await supabaseSelectSingle("kova_users", `id=eq.${encodeURIComponent(id)}&select=*`);
    return mapSupabaseUser(row);
  }

  const db = await loadDb();
  return db.users.find((entry) => entry.id === id) || null;
}

async function createAuthUserRow(user) {
  if (supabaseReady()) {
    const inserted = await supabaseInsert("kova_users", {
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.passwordHash,
      plan: user.plan,
      created_at: user.createdAt,
      consent: user.consent,
      consent_log: user.consentLog || [],
      deleted_at: user.deletedAt || null,
      deleted: Boolean(user.deleted),
    });
    return inserted;
  }

  return null;
}

async function updateAuthUserRow(id, patch) {
  if (supabaseReady()) {
    await supabaseUpdate("kova_users", `id=eq.${encodeURIComponent(id)}`, patch);
    return true;
  }

  return false;
}

async function createAuthSessionRow(token, userId) {
  if (supabaseReady()) {
    const inserted = await supabaseInsert("kova_sessions", {
      token,
      user_id: userId,
      created_at: new Date().toISOString(),
    });
    return Boolean(inserted);
  }

  return false;
}

async function deleteAuthSessionByToken(token) {
  if (supabaseReady()) {
    await supabaseDelete("kova_sessions", `token=eq.${encodeURIComponent(token)}`);
    return true;
  }

  return false;
}

async function deleteAuthSessionsByUserId(userId) {
  if (supabaseReady()) {
    await supabaseDelete("kova_sessions", `user_id=eq.${encodeURIComponent(userId)}`);
    return true;
  }

  return false;
}

export function publicProducts() {
  return kovaProducts;
}

export function publicPricingPlans() {
  return pricingPlans;
}

export function publicMobileScreens() {
  return mobileScreens;
}

export function publicSystemTree() {
  return systemTree;
}

export async function publicAgreements() {
  const manifest = await loadAgreementManifest();
  const db = await loadDb();
  return agreementDocs.map((doc) => mergeAgreementDoc(doc, manifest[doc.slug], db.agreementReviews[doc.slug]));
}

export function publicAgreementPlanRequirements() {
  return agreementPlanRequirements;
}

export function publicAgreementPlanDisclosures() {
  return agreementPlanDisclosures;
}

export function publicPrivacyNotice() {
  return privacyNotice;
}

export function publicSupportContacts() {
  return supportContacts;
}

export function publicHomeData() {
  return homeSections;
}

export async function agreementBySlug(slug) {
  const base = agreementDocs.find((doc) => doc.slug === slug) || null;
  if (!base) return null;
  const manifest = await loadAgreementManifest();
  const db = await loadDb();
  return mergeAgreementDoc(base, manifest[slug], db.agreementReviews[slug]);
}

export function productBySlug(slug) {
  return kovaProducts.find((product) => product.slug === slug) || null;
}

export function defaultFlowFor(slug) {
  const product = productBySlug(slug);
  if (!product) return null;

  const base = {
    saver: [
      { title: "Connect accounts", body: "Link bills and providers so Kova can start comparing live offers." },
      { title: "Scan usage", body: "Kova identifies overages and savings opportunities." },
      { title: "Negotiate and track", body: "The backend records the negotiation start and the dashboard picks it up." },
    ],
    legal: [
      { title: "Upload contract", body: "Send a lease, NDA, or vendor agreement to the analysis service." },
      { title: "Run risk scan", body: "Clauses are scored and flagged for review." },
      { title: "Approve pushback", body: "Kova prepares language and waits for your approval." },
    ],
    build: [
      { title: "Set project and city", body: "Choose the permit context and the jurisdiction." },
      { title: "Load permit checklist", body: "The system pulls local requirements and deadlines." },
      { title: "Submit and monitor", body: "Kova tracks rule changes and permit status." },
    ],
  };

  return {
    slug,
    title: `${product.name} flow`,
    steps: base[slug] || [],
    actionLabel: product.slug === "saver" ? "Start negotiation" : product.slug === "legal" ? "Start review" : "Start permit flow",
  };
}

export async function createUser({ name, email, password, plan, acknowledgements, legalGate }, context = {}) {
  const db = await loadDb();
  const manifest = await loadAgreementManifest();
  const existing = supabaseReady()
    ? await getAuthUserByEmail(email)
    : db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("An account with that email already exists.");
  }

  const normalizedPlan = plan || "legal";
  const requiredDocs = agreementPlanRequirements[normalizedPlan] || [];
  const acceptedDocs = normalizeAcknowledgements(acknowledgements);
  const missingDocs = requiredDocs.filter((docSlug) => !acceptedDocs.has(docSlug));
  if (missingDocs.length) {
    throw new Error("Please acknowledge the required agreements before continuing.");
  }

  const gateDocs = Array.isArray(legalGate?.requiredDocs) ? legalGate.requiredDocs : [];
  const gateMissing = requiredDocs.filter((docSlug) => !gateDocs.includes(docSlug));
  if (legalGate && (legalGate.plan !== normalizedPlan || gateMissing.length)) {
    throw new Error("Your legal consent bundle does not match the selected plan.");
  }
  if (
    !legalGate?.acceptedAt ||
    !legalGate?.reviewedBundle ||
    !legalGate?.understood ||
    !legalGate?.scrollComplete ||
    !legalGate?.disclosureAccepted
  ) {
    throw new Error("Please complete the scroll-to-accept review before signing up.");
  }

  const acceptedAt = legalGate.acceptedAt;
  const documents = buildAcceptedDocuments(requiredDocs, manifest, db.agreementReviews, acceptedAt, acceptedDocs);
  const privacyConsent = legalGate.privacyConsent || { analytics: false, essentialOnly: true };

  const user = {
    id: randomUUID(),
    name: name || email.split("@")[0],
    email,
    passwordHash: hashPassword(password),
    plan: normalizedPlan,
    createdAt: new Date().toISOString(),
    consent: {
      plan: normalizedPlan,
      acceptedAt,
      reviewedAt: legalGate.reviewedAt || acceptedAt,
      reviewedBundle: Boolean(legalGate.reviewedBundle),
      understood: Boolean(legalGate.understood),
      scrollComplete: Boolean(legalGate.scrollComplete),
      disclosureAccepted: Boolean(legalGate.disclosureAccepted),
      requiredDocs,
      acceptedDocs: [...acceptedDocs],
      documents,
      planDisclosure: agreementPlanDisclosures[normalizedPlan] || agreementPlanDisclosures.legal,
      privacyNotice,
      supportContacts,
      privacyConsent,
      retention: {
        policy:
          "Kova retains consent records and access logs for compliance while your account is active and for a reasonable post-termination retention period.",
        acknowledgedAt: acceptedAt,
      },
      userAgent: context.userAgent || null,
      ip: context.ip || null,
      acceptedBy: "scroll-to-accept",
    },
    consentLog: [
      {
        id: randomUUID(),
        type: "signup-consent",
        acceptedAt,
        plan: normalizedPlan,
        requiredDocs,
        acceptedDocs: [...acceptedDocs],
        documents,
        privacyConsent,
        userAgent: context.userAgent || null,
        ip: context.ip || null,
      },
    ],
  };

  const token = randomUUID();
  if (supabaseReady()) {
    const inserted = await createAuthUserRow(user);
    if (!inserted) {
      throw new Error("Could not save the new user to Supabase.");
    }
    const sessionSaved = await createAuthSessionRow(token, user.id);
    if (!sessionSaved) {
      throw new Error("Could not create the Supabase session.");
    }
    db.flowState[user.id] = {};
    await saveDb(db);
  } else {
    db.users.push(user);
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    db.flowState[user.id] = {};
    await saveDb(db);
  }
  void mirrorConsentEvent({
    event_type: "signup-consent",
    user_id: user.id,
    email: user.email,
    plan: normalizedPlan,
    details: {
      acceptedAt,
      reviewedBundle: Boolean(legalGate.reviewedBundle),
      understood: Boolean(legalGate.understood),
      scrollComplete: Boolean(legalGate.scrollComplete),
      disclosureAccepted: Boolean(legalGate.disclosureAccepted),
      documentCount: documents.length,
    },
  });

  return { user: serializeUser(user), token };
}

export async function loginUser({ email, password }) {
  const db = await loadDb();
  const user = supabaseReady()
    ? await getAuthUserByEmail(email)
    : db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Email or password is incorrect.");
  }

  const token = randomUUID();
  if (supabaseReady()) {
    const sessionSaved = await createAuthSessionRow(token, user.id);
    if (!sessionSaved) {
      throw new Error("Could not create the Supabase session.");
    }
  } else {
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    await saveDb(db);
  }

  return { user: serializeUser(user), token };
}

export async function userFromToken(token) {
  if (!token) return null;
  const db = await loadDb();
  const session = supabaseReady()
    ? await supabaseSelectSingle("kova_sessions", `token=eq.${encodeURIComponent(token)}&select=*`)
    : db.sessions.find((entry) => entry.token === token);
  if (!session) return null;
  const user = supabaseReady()
    ? await getAuthUserById(session.user_id)
    : db.users.find((entry) => entry.id === session.userId);
  return user ? serializeUser(user) : null;
}

export async function destroyToken(token) {
  if (!token) return;
  const db = await loadDb();
  if (supabaseReady()) {
    await deleteAuthSessionByToken(token);
  } else {
    db.sessions = db.sessions.filter((session) => session.token !== token);
    await saveDb(db);
  }
}

export async function getDashboardForUser(user) {
  const db = await loadDb();
  const manifest = await loadAgreementManifest();
  const flowState = db.flowState[user.id] || {};
  const activePath = productBySlug(user.plan) || productBySlug("legal");
  const fullUser = (supabaseReady() ? await getAuthUserById(user.id) : db.users.find((entry) => entry.id === user.id)) || null;
  const snapshot = buildConsentSnapshot(fullUser, manifest, db.agreementReviews);

  return {
    user,
    path: {
      slug: activePath.slug,
      name: activePath.name,
      summary: activePath.summary,
    },
    metrics: [
      { label: "Saved this month", value: "$247", sub: "Comcast won" },
      { label: "Docs analyzed", value: "7", sub: "3 need attention" },
      { label: "Active flows", value: String(Object.keys(flowState).length || 1), sub: "API-backed" },
    ],
    activity: [
      { title: "Comcast negotiated", body: "Today · -$48/mo", tone: "green" },
      { title: "Lease analyzed", body: "Yesterday · 12 clauses", tone: "purple" },
      { title: "AT&T negotiation", body: "In progress · voice", tone: "amber" },
    ],
    compliance: {
      plan: snapshot.consent?.plan || user.plan,
      status: snapshot.consent ? "Accepted" : "Pending",
      acceptedAt: snapshot.consent?.acceptedAt || null,
      reviewedAt: snapshot.consent?.reviewedAt || null,
      reviewedBundle: Boolean(snapshot.consent?.reviewedBundle),
      understood: Boolean(snapshot.consent?.understood),
      scrollComplete: Boolean(snapshot.consent?.scrollComplete),
      requiredCount: snapshot.documents.length,
      acceptedCount: snapshot.documents.filter((doc) => doc.accepted).length,
      documents: snapshot.documents,
      privacyConsent: snapshot.consent?.privacyConsent || { analytics: false, essentialOnly: true },
      supportContacts: snapshot.consent?.supportContacts || supportContacts,
      planDisclosure: snapshot.consent?.planDisclosure || [],
    },
  };
}

export async function getLegalAuditForUser(user) {
  const db = await loadDb();
  const manifest = await loadAgreementManifest();
  const fullUser = (supabaseReady() ? await getAuthUserById(user.id) : db.users.find((entry) => entry.id === user.id)) || null;
  if (!fullUser) {
    return null;
  }

  const snapshot = buildConsentSnapshot(fullUser, manifest, db.agreementReviews);
  const consent = snapshot.consent;

  return {
    user: serializeUser(fullUser),
    summary: {
      plan: consent?.plan || fullUser.plan,
      acceptedAt: consent?.acceptedAt || null,
      reviewedAt: consent?.reviewedAt || null,
      acceptedCount: snapshot.documents.length,
      reviewedBundle: Boolean(consent?.reviewedBundle),
      understood: Boolean(consent?.understood),
      scrollComplete: Boolean(consent?.scrollComplete),
    },
    consent: consent
      ? {
          ...consent,
          documents: snapshot.documents,
        }
      : null,
    timeline: snapshot.documents.map((doc, index) => ({
      id: `${consent?.acceptedAt || fullUser.createdAt}-${doc.slug}-${index}`,
      slug: doc.slug,
      name: doc.name,
      fileName: doc.fileName,
      path: doc.path,
      version: doc.version,
      checksum: doc.checksum,
      acceptedText: doc.acceptedText,
      paragraphs: doc.paragraphs,
      wordCount: doc.wordCount,
      summary: doc.summary,
      use: doc.use,
      highlights: doc.highlights,
      requiredFor: doc.requiredFor,
      accepted: doc.accepted,
      acceptedAt: doc.acceptedAt || consent?.acceptedAt || null,
      reviewedByCounsel: doc.reviewedByCounsel,
      reviewedAt: doc.reviewedAt,
      reviewerName: doc.reviewerName,
      source: "signup-scroll-to-accept",
    })),
  };
}

export async function exportLegalAuditCsvForUser(user) {
  const audit = await getLegalAuditForUser(user);
  if (!audit) return null;

  const rows = [
    ["User", audit.user.name, audit.user.email, audit.summary.plan, audit.summary.acceptedAt || "", audit.summary.reviewedAt || ""],
    ["Doc", "Version", "Checksum", "Accepted At", "Reviewed By Counsel", "Accepted Text"],
    ...audit.timeline.map((item) => [
      item.name,
      item.version || "",
      item.checksum || "",
      item.acceptedAt || "",
      item.reviewedByCounsel ? "Yes" : "No",
      (item.acceptedText || "").replace(/\s+/g, " ").trim(),
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "");
          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
}

export async function requestLegalRecordsForUser(user) {
  const db = await loadDb();
  const manifest = await loadAgreementManifest();
  const fullUser = (supabaseReady() ? await getAuthUserById(user.id) : db.users.find((entry) => entry.id === user.id)) || null;
  if (!fullUser) return null;

  const snapshot = buildConsentSnapshot(fullUser, manifest, db.agreementReviews);
  const record = {
    requestedAt: new Date().toISOString(),
    userId: fullUser.id,
    email: fullUser.email,
    plan: fullUser.plan,
  };
  db.recordRequests.push(record);
  await saveDb(db);
  void mirrorConsentEvent({
    event_type: "records-requested",
    user_id: fullUser.id,
    email: fullUser.email,
    plan: fullUser.plan,
    details: record,
  });

  return {
    request: record,
    user: serializeUser(fullUser),
    consent: snapshot.consent,
    documents: snapshot.documents,
    support: supportContacts,
  };
}

export async function revokeConsentForUser(user, context = {}) {
  const db = await loadDb();
  const fullUser = supabaseReady() ? await getAuthUserById(user.id) : db.users.find((entry) => entry.id === user.id);
  if (!fullUser) return null;

  const revokedAt = new Date().toISOString();
  fullUser.consent = {
    ...(fullUser.consent || {}),
    revokedAt,
    revoked: true,
    revokedReason: context.reason || "user-request",
    revokedBy: context.requestedBy || "user",
  };
  fullUser.consentLog = Array.isArray(fullUser.consentLog) ? fullUser.consentLog : [];
  fullUser.consentLog.push({
    id: randomUUID(),
    type: "revocation",
    revokedAt,
    revokedReason: context.reason || "user-request",
  });
  if (supabaseReady()) {
    await updateAuthUserRow(fullUser.id, {
      consent: fullUser.consent,
      consent_log: fullUser.consentLog,
    });
    await deleteAuthSessionsByUserId(fullUser.id);
  } else {
    db.sessions = db.sessions.filter((session) => session.userId !== user.id);
    await saveDb(db);
  }
  void mirrorConsentEvent({
    event_type: "consent-revoked",
    user_id: fullUser.id,
    email: fullUser.email,
    plan: fullUser.plan,
    details: {
      revokedAt,
      revokedReason: context.reason || "user-request",
    },
  });
  return { revokedAt };
}

export async function deleteUserDataForUser(user, context = {}) {
  const db = await loadDb();
  const fullUser = supabaseReady() ? await getAuthUserById(user.id) : db.users.find((entry) => entry.id === user.id);
  if (!fullUser) return null;

  const deletedAt = new Date().toISOString();
  const record = {
    id: randomUUID(),
    type: "delete-request",
    deletedAt,
    userId: fullUser.id,
    email: fullUser.email,
    requestedBy: context.requestedBy || "user",
  };
  db.recordRequests.push(record);
  fullUser.deletedAt = deletedAt;
  fullUser.deleted = true;
  fullUser.name = "Deleted user";
  fullUser.email = `${fullUser.id.slice(0, 8)}@deleted.local`;
  fullUser.passwordHash = hashPassword(randomUUID());
  fullUser.consent = {
    ...(fullUser.consent || {}),
    deletedAt,
    deleted: true,
  };
  fullUser.consentLog = Array.isArray(fullUser.consentLog) ? fullUser.consentLog : [];
  fullUser.consentLog.push({
    id: randomUUID(),
    type: "delete",
    deletedAt,
  });
  if (supabaseReady()) {
    await updateAuthUserRow(fullUser.id, {
      name: fullUser.name,
      email: fullUser.email,
      password_hash: fullUser.passwordHash,
      plan: fullUser.plan,
      deleted_at: deletedAt,
      deleted: true,
      consent: fullUser.consent,
      consent_log: fullUser.consentLog,
    });
    await deleteAuthSessionsByUserId(fullUser.id);
  } else {
    db.sessions = db.sessions.filter((session) => session.userId !== user.id);
    await saveDb(db);
  }
  void mirrorConsentEvent({
    event_type: "account-deleted",
    user_id: fullUser.id,
    email: fullUser.email,
    plan: fullUser.plan,
    details: {
      deletedAt,
      requestedBy: context.requestedBy || "user",
    },
  });
  return { deletedAt };
}

export async function adminAgreementStatuses() {
  const db = await loadDb();
  const manifest = await loadAgreementManifest();
  return agreementDocs.map((doc) => mergeAgreementDoc(doc, manifest[doc.slug], db.agreementReviews[doc.slug]));
}

export async function reviewAgreement(slug, payload = {}) {
  const db = await loadDb();
  const existing = agreementDocs.find((doc) => doc.slug === slug);
  if (!existing) return null;

  db.agreementReviews[slug] = {
    reviewedByCounsel: Boolean(payload.reviewedByCounsel),
    reviewedAt: payload.reviewedByCounsel ? new Date().toISOString() : null,
    reviewerName: payload.reviewerName || null,
    reviewNotes: payload.reviewNotes || "",
  };
  await saveDb(db);
  const doc = mergeAgreementDoc(existing, (await loadAgreementManifest())[slug], db.agreementReviews[slug]);
  void mirrorConsentEvent({
    event_type: "agreement-reviewed",
    document_slug: doc.slug,
    document_name: doc.name,
    version: doc.version,
    checksum: doc.checksum,
    details: {
      reviewedByCounsel: doc.reviewedByCounsel,
      reviewedAt: doc.reviewedAt,
      reviewerName: doc.reviewerName,
      reviewNotes: doc.reviewNotes,
    },
  });
  return doc;
}

export async function getFlow(slug, userId = null) {
  const flow = defaultFlowFor(slug);
  if (!flow) return null;

  if (!userId) {
    return flow;
  }

  const db = await loadDb();
  const state = db.flowState[userId]?.[slug];
  return {
    ...flow,
    status: state?.status || "ready",
    startedAt: state?.startedAt || null,
  };
}

export async function startFlow(slug, user) {
  const db = await loadDb();
  const flow = defaultFlowFor(slug);
  if (!flow) return null;

  if (!db.flowState[user.id]) {
    db.flowState[user.id] = {};
  }

  db.flowState[user.id][slug] = {
    status: "started",
    startedAt: new Date().toISOString(),
  };
  await saveDb(db);
  void mirrorSupabaseEvent("kova_flow_events", {
    event_type: "flow-started",
    user_id: user.id,
    email: user.email,
    plan: user.plan,
    flow_slug: slug,
    details: {
      startedAt: db.flowState[user.id][slug].startedAt,
    },
  });

  return {
    flow: {
      ...flow,
      status: "started",
      startedAt: db.flowState[user.id][slug].startedAt,
    },
    message: `${flow.actionLabel} queued.`,
  };
}
