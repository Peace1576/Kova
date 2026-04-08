import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const mirroredTables = [
  { name: "kova_users", description: "Primary auth records" },
  { name: "kova_sessions", description: "Bearer sessions" },
  { name: "kova_legal_events", description: "Consent and audit events" },
  { name: "kova_ai_events", description: "Brain prompts and responses" },
  { name: "kova_flow_events", description: "Flow lifecycle events" },
];

export function IntegrationStatusPage() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.integrationStatus()
      .then((data) => setStatus(data.status))
      .catch((err) => setError(err.message));
  }, []);

  if (!loading && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">Integrations</span>
          <h2>Live brain and Supabase status.</h2>
        </div>
        <Link className="btn btn-ghost btn-sm" to="/app">
          Back to dashboard
        </Link>
      </div>

      <div className="dashboard-grid ai-grid">
        <article className="panel">
          <span className="panel-kicker">Connection status</span>
          <h3>What is live right now</h3>

          {status ? (
            <div className="audit-summary-grid">
              <div className="audit-summary-card">
                <span>Brain</span>
                <strong>{status.brain ? "Connected" : "Missing"}</strong>
              </div>
              <div className="audit-summary-card">
                <span>Supabase</span>
                <strong>{status.supabase ? "Connected" : "Missing"}</strong>
              </div>
              <div className="audit-summary-card">
                <span>Auth tables</span>
                <strong>{status.authUsers ? "Active" : "Inactive"}</strong>
              </div>
              <div className="audit-summary-card">
                <span>Schema</span>
                <strong>{status.supabaseSchema || "public"}</strong>
              </div>
            </div>
          ) : (
            <p className="panel-copy">{error || "Loading integration status..."}</p>
          )}

          <div className="agreement-note">
            <strong>Current model</strong>
            <p>{status?.brainModel || "llama-3.1-70b-versatile"}</p>
          </div>
        </article>

        <article className="panel">
          <span className="panel-kicker">Mirrored tables</span>
          <h3>What gets written to Supabase</h3>
          <div className="audit-list">
            {mirroredTables.map((table) => (
              <div className="audit-item" key={table.name}>
                <div className="audit-item-head">
                  <div>
                    <h4>{table.name}</h4>
                    <p>{table.description}</p>
                  </div>
                  <span className="status-chip status-chip-success">Live</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel audit-checklist-panel">
          <span className="panel-kicker">Setup notes</span>
          <h3>What still needs to be configured in Supabase.</h3>
          <ul className="audit-checklist">
            <li>Keep `BRAIN_API_KEY` in `.env.local` only.</li>
            <li>Run the migrations in `supabase/migrations/`.</li>
            <li>Keep `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` only.</li>
            <li>Rotate any exposed keys before going live.</li>
            <li>Move any remaining local-only state if you want Supabase to become the full source of truth.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
