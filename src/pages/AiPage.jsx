import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { agreementDocs } from "../data/kovaData";

const quickPrompts = [
  "Summarize the selected agreement in plain English.",
  "What are the biggest risks or red flags?",
  "What should I ask counsel to review first?",
  "Explain the arbitration or liability language simply.",
];

export function AiPage() {
  const { user, loading } = useAuth();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [docSlug, setDocSlug] = useState(params.get("doc") || "kova-terms-of-service-v1-0-0");
  const [question, setQuestion] = useState(quickPrompts[0]);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedDoc = useMemo(
    () => agreementDocs.find((doc) => doc.slug === docSlug) || agreementDocs[0],
    [docSlug]
  );

  useEffect(() => {
    api.integrationStatus()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    setParams({ doc: docSlug }, { replace: true });
  }, [docSlug, setParams]);

  if (!loading && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      const data = await api.aiChat({
        question,
        docSlug,
      });
      setAnswer(data.answer || "No response returned.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Kova AI</span>
          <h2>Ask Gemini about a document or workflow.</h2>
        </div>
        <Link className="btn btn-ghost btn-sm" to="/app">
          Back to dashboard
        </Link>
      </div>

      <div className="dashboard-grid ai-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Integration status</p>
              <h3>Gemini and Supabase</h3>
            </div>
            <span className={`status-chip ${status?.gemini ? "status-chip-success" : ""}`}>
              {status?.gemini ? "Gemini ready" : "Gemini not set"}
            </span>
          </div>

          <div className="audit-summary-grid">
            <div className="audit-summary-card">
              <span>Gemini key</span>
              <strong>{status?.gemini ? "Loaded from env" : "Missing"}</strong>
            </div>
            <div className="audit-summary-card">
              <span>Supabase</span>
              <strong>{status?.supabase ? "Configured" : "Not configured"}</strong>
            </div>
            <div className="audit-summary-card">
              <span>Model</span>
              <strong>{status?.geminiModel || "gemini-2.0-flash"}</strong>
            </div>
            <div className="audit-summary-card">
              <span>Schema</span>
              <strong>{status?.supabaseSchema || "public"}</strong>
            </div>
          </div>

          <div className="agreement-note">
            <strong>Selected document</strong>
            <p>
              {selectedDoc.name} · {selectedDoc.fileName}
            </p>
          </div>

          <div className="module-cta-row">
            <Link className="btn btn-primary" to={`/agreements/${selectedDoc.slug}`}>
              Open viewer
            </Link>
            <Link className="btn btn-ghost" to="/app/audit">
              Open audit log
            </Link>
          </div>
        </article>

        <article className="panel">
          <span className="panel-kicker">Ask Gemini</span>
          <h3>Get a quick explanation or risk summary.</h3>

          <form onSubmit={submit} className="ai-form">
            <label>
              <span>Document</span>
              <select value={docSlug} onChange={(event) => setDocSlug(event.target.value)}>
                {agreementDocs.map((doc) => (
                  <option value={doc.slug} key={doc.slug}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Question</span>
              <textarea
                rows="5"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask Gemini to summarize the selected agreement..."
              />
            </label>

            <div className="chip-list ai-prompts">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" className="segment" onClick={() => setQuestion(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <div className="module-cta-row">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Thinking..." : "Ask Gemini"}
              </button>
              <Link className="btn btn-ghost" to={`/legal/disclosure?plan=legal`}>
                Review legal flow
              </Link>
            </div>
          </form>

          {error ? <p className="form-error">{error}</p> : null}

          {answer ? (
            <div className="viewer-paper ai-answer">
              <div className="viewer-paper-top">
                <strong>Gemini response</strong>
                <span>{selectedDoc.name}</span>
              </div>
              <pre className="viewer-accepted-text">{answer}</pre>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
