import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  adminAgreementStatuses,
  agreementBySlug,
  createUser,
  deleteUserDataForUser,
  destroyToken,
  exportLegalAuditCsvForUser,
  getDashboardForUser,
  getFlow,
  getLegalAuditForUser,
  loginUser,
  publicAgreements,
  publicHomeData,
  publicMobileScreens,
  publicPricingPlans,
  publicProducts,
  publicSystemTree,
  requestLegalRecordsForUser,
  revokeConsentForUser,
  reviewAgreement,
  startFlow,
  userFromToken,
  productBySlug,
} from "./store.js";
import { askBrain, getIntegrationStatus, mirrorAiEvent } from "./integrations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json());

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const user = await userFromToken(token);
    if (!user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "kova-api" });
});

app.get("/api/home", (_req, res) => {
  res.json({
    products: publicProducts(),
    steps: publicHomeData().steps,
    faqs: publicHomeData().faqs,
  });
});

app.get("/api/products", (_req, res) => {
  res.json({ products: publicProducts() });
});

app.get("/api/products/:slug", (req, res) => {
  const product = productBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }
  res.json({ product });
});

app.get("/api/pricing/plans", (_req, res) => {
  res.json({ plans: publicPricingPlans() });
});

app.get("/api/mobile/screens", (_req, res) => {
  res.json({ screens: publicMobileScreens() });
});

app.get("/api/system/tree", (_req, res) => {
  res.json({ tree: publicSystemTree() });
});

app.get("/api/integrations/status", (_req, res) => {
  res.json({ status: getIntegrationStatus() });
});

app.get("/api/agreements", async (_req, res) => {
  const docs = await publicAgreements();
  res.json({ docs });
});

app.get("/api/agreements/:slug", async (req, res) => {
  const doc = await agreementBySlug(req.params.slug);
  if (!doc) {
    return res.status(404).json({ error: "Agreement not found." });
  }
  res.json({ doc });
});

app.get("/api/flows/:slug", async (req, res) => {
  const flow = await getFlow(req.params.slug);
  if (!flow) {
    return res.status(404).json({ error: "Flow not found." });
  }
  res.json({ flow });
});

app.post("/api/flows/:slug/start", auth, async (req, res) => {
  const result = await startFlow(req.params.slug, req.user);
  if (!result) {
    return res.status(404).json({ error: "Flow not found." });
  }
  res.json(result);
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const result = await createUser(req.body, {
      ip: req.ip,
      userAgent: req.headers["user-agent"] || null,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/auth/logout", auth, async (req, res) => {
  await destroyToken(req.token);
  res.json({ ok: true });
});

app.get("/api/dashboard", auth, async (req, res) => {
  const dashboard = await getDashboardForUser(req.user);
  res.json(dashboard);
});

app.get("/api/legal/audit", auth, async (req, res) => {
  const audit = await getLegalAuditForUser(req.user);
  if (!audit) {
    return res.status(404).json({ error: "Audit log not found." });
  }
  res.json(audit);
});

app.get("/api/legal/records", auth, async (req, res) => {
  const records = await requestLegalRecordsForUser(req.user);
  if (!records) {
    return res.status(404).json({ error: "Records not found." });
  }
  res.json(records);
});

app.get("/api/legal/audit/export.csv", auth, async (req, res) => {
  const csv = await exportLegalAuditCsvForUser(req.user);
  if (!csv) {
    return res.status(404).json({ error: "Audit export not found." });
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="kova-legal-audit-${req.user.id}.csv"`);
  res.send(csv);
});

app.get("/api/legal/audit/print", auth, async (req, res) => {
  const audit = await getLegalAuditForUser(req.user);
  if (!audit) {
    return res.status(404).send("Audit log not found.");
  }

  const rows = audit.timeline
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.version || ""}</td>
          <td>${item.checksum || ""}</td>
          <td>${item.acceptedAt || ""}</td>
          <td>${item.reviewedByCounsel ? "Yes" : "No"}</td>
        </tr>`
    )
    .join("");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Kova legal audit</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 32px; color: #111; }
        h1, h2, p { margin: 0 0 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { text-align: left; border-bottom: 1px solid #ddd; padding: 10px 8px; font-size: 12px; vertical-align: top; }
        th { background: #f4f4f4; }
        .meta { margin-bottom: 8px; color: #444; }
        @media print { body { margin: 12px; } }
      </style>
    </head>
    <body>
      <h1>Kova legal audit</h1>
      <p class="meta">User: ${audit.user.name} (${audit.user.email})</p>
      <p class="meta">Plan: ${audit.summary.plan}</p>
      <p class="meta">Accepted: ${audit.summary.acceptedAt || "n/a"}</p>
      <table>
        <thead>
          <tr>
            <th>Document</th>
            <th>Version</th>
            <th>Checksum</th>
            <th>Accepted at</th>
            <th>Counsel reviewed</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <script>window.print();</script>
    </body>
  </html>`);
});

app.post("/api/legal/revoke", auth, async (req, res) => {
  const result = await revokeConsentForUser(req.user, { reason: req.body?.reason || "user-request" });
  if (!result) {
    return res.status(404).json({ error: "Unable to revoke consent." });
  }
  res.json(result);
});

app.post("/api/legal/delete", auth, async (req, res) => {
  const result = await deleteUserDataForUser(req.user, { requestedBy: req.body?.requestedBy || "user" });
  if (!result) {
    return res.status(404).json({ error: "Unable to delete data." });
  }
  res.json(result);
});

app.get("/api/admin/agreement-status", async (_req, res) => {
  const docs = await adminAgreementStatuses();
  res.json({ docs });
});

app.post("/api/admin/agreements/:slug/review", async (req, res) => {
  const doc = await reviewAgreement(req.params.slug, req.body || {});
  if (!doc) {
    return res.status(404).json({ error: "Agreement not found." });
  }
  res.json({ doc });
});

async function handleBrainChat(req, res) {
  try {
    const question = String(req.body?.question || "").trim();
    const docSlug = String(req.body?.docSlug || "").trim();
    const doc = docSlug ? await agreementBySlug(docSlug) : null;

    if (!question) {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const prompt = [
      "You are Kova Brain, the product assistant for money, rights, work, and permit workflows.",
      "Be practical, concise, and careful.",
      "Do not claim to be a lawyer or provide legal advice.",
      doc
        ? `Document context:\nName: ${doc.name}\nVersion: ${doc.version || "n/a"}\nExcerpt: ${doc.acceptedText || doc.excerpt}\nHighlights: ${(doc.highlights || []).join("; ")}`
        : "No specific document was provided. Answer in the context of Kova product guidance.",
      `User question: ${question}`,
    ].join("\n\n");

    const result = await askBrain({
      systemInstruction:
        "You are a careful assistant. If the user asks for legal advice, remind them to consult a licensed attorney and stay focused on product guidance, document summaries, or workflow help.",
      prompt,
      temperature: 0.25,
      maxOutputTokens: 900,
    });

    void mirrorAiEvent({
      event_type: "ai-chat",
      user_id: req.user.id,
      email: req.user.email,
      prompt: question,
      response: result.text,
      context: { docSlug: docSlug || null },
    });

    res.json({
      model: result.model,
      provider: result.provider,
      answer: result.text,
      document: doc ? { slug: doc.slug, name: doc.name, version: doc.version } : null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

app.post("/api/brain/chat", auth, handleBrainChat);
app.post("/api/ai/chat", auth, handleBrainChat);

export { app };

if (!process.env.VERCEL) {
  const distPath = path.resolve(__dirname, "..", "dist");
  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"), (error) => {
      if (error) {
        res.status(404).json({ error: "Not found." });
      }
    });
  });

  app.listen(port, () => {
    console.log(`Kova API running on http://localhost:${port}`);
  });
}
